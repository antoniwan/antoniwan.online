// TypeScript matches every game in src/data/games.json to its Wikidata item with Node's standard library, then writes src/data/game-links.json.
// Dry run by default. Pass --write to save the file. The links live apart from games.json because the export script regenerates that file from private notes.
// A title links to English Wikipedia (enwiki sitelink) and to the Steam store (P1733). Both come from the same Wikidata item, so they describe the same game.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import type { GamesSnapshot } from '../src/data/games.ts';

const userAgent = 'antoniwan.online-games-links/1.0 (https://antoniwan.online)';
const api = 'https://www.wikidata.org/w/api.php';
const delayMs = 300;
const cacheDir = new URL('../node_modules/.cache/link-games/', import.meta.url);
mkdirSync(cacheDir, { recursive: true });

// ---------------------------------------------------------------- overrides
// Game id -> Wikidata QID, or null for "no item exists / too ambiguous: leave unlinked".
// Each entry was checked by hand against the item's label, release date, platforms and developer.
const overrides: Record<string, string | null | { qid: string; steam: false }> = {
  // Search found several plausible items; these are the base games, not expansions, editions, ports or mods.
  'age-of-empires-ii': 'Q34852', // The Age of Kings (1999). The Conquerors (Q615499) is the expansion.
  'skyrim': 'Q323862', // The Elder Scrolls V: Skyrim. Q134080727 is a texture mod.
  'sid-meiers-civilization-vii': 'Q126405953', // Civilization VII. The VR and Arcade items are separate products.
  'the-sims-3': 'Q185482', // The Sims 3 (2009, Windows). The other items are console, handheld and mobile ports or expansions.
  'tie-fighter': 'Q55312', // Star Wars: TIE Fighter (1994). The other hits are expansions and compilations.
  'vampire-survivors': 'Q110726215', // Vampire Survivors. Q115715264 is the Legacy of the Moonspell expansion.
  'warhammer-40000-space-marine-2': 'Q110055360', // Space Marine II. The others are anniversary editions.
  'marvels-spider-man-2': 'Q108479502', // Spider-Man 2 (2023), enwiki "Marvel's Spider-Man 2". Other Spider-Man items are different games.
  'marvels-spider-man-miles-morales': 'Q96216165', // Spider-Man: Miles Morales. Q141483688 is a bundle.
  'marvels-spider-man-remastered': 'Q100440421', // The Remastered item (PC release, Steam 1817070). games.json uses the 2018 original year.
  'dragons-dogma-2': 'Q112609559', // Labelled "Dragon's Dogma II"; enwiki is "Dragon's Dogma 2". Q135045245 is a character-creator tool.
  'greedfall-2': 'Q114729594', // GreedFall: The Dying World, the released name of GreedFall II. Developer Spiders.
  // The year in games.json is the original or full-release year, not the item's own release date.
  'lego-worlds': 'Q20024451', // Item dates the early access (2015); full release was 2017. The other hits are DLC.
  'disco-elysium-the-final-cut': 'Q71693825', // The Final Cut item (Q127164835) has no article and a wrong date; the base game article covers it. Same Steam app 632470.
  'x-wing': 'Q54853', // Star Wars: X-Wing is 1993; games.json says 1990, which is wrong. No other X-Wing game fits "Flight Simulation".
  'roller-coaster-tycoon': 'Q5800778', // RollerCoaster Tycoon (1999). The search hit Q828749 is the series.
  'kotor-knights-of-the-old-republic': 'Q725902', // Star Wars: Knights of the Old Republic (2003). The abbreviation does not search.
  'kotor-ii-the-sith-lords': 'Q74669', // Star Wars Knights of the Old Republic II: The Sith Lords (2004).
  'nier-replicant': 'Q106645039', // The ver.1.22474487139... remaster, which is the PS5 version Antonio played. No article of its own; Steam 1113560.
  // Remasters and editions whose own item lacks an article: link the base game's article and drop a Steam link that would not match.
  'days-gone-remastered': { qid: 'Q24576564', steam: false }, // Days Gone article covers the PS5 remaster; the Steam page is the original release.
  // Left unlinked on purpose.
  'bonfire': null, // Two unrelated 2019 and 2020 video games called Bonfire; no year to choose.
  'call-of-duty': null, // games.json says the title is not distinguished.
  'the-settlers': null, // Many games in the series; no year.
  'foundation': 'Q112966923', // Polymorph Games city builder (Steam 690830): early access 2019, full release 2025, which is the year games.json records.
  'the-nioh-collection': null, // A PS5 bundle with no Wikidata item of its own.
};

// ---------------------------------------------------------------- vocabulary
// P31 (instance of) values that make an item a game: video game, free-to-play video game, expansion pack, compilation, remake, remaster.
// A class that is a subclass (P279, followed up to a few levels) of any of these also counts.
const gameClasses = new Set(['Q7889', 'Q21125433', 'Q209163', 'Q1066707', 'Q865493', 'Q64170203']);
const yearTolerance = 1;
// Debugging aid: --why <id>[,<id>] prints every search hit for those games and whether it passed the game test.
const whyIndex = process.argv.indexOf('--why');
const explain = new Set(whyIndex === -1 ? [] : (process.argv[whyIndex + 1] ?? '').split(','));

const normalize = (value: string) => value.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/['’]/g, '').replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, ' ').trim();

// ---------------------------------------------------------------- cached, polite fetching
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
async function getJson(url: string): Promise<any> {
  const file = new URL(createHash('sha256').update(url).digest('hex').slice(0, 24) + '.json', cacheDir);
  if (existsSync(file)) return JSON.parse(readFileSync(file, 'utf8'));
  for (let attempt = 1; attempt <= 4; attempt++) {
    await sleep(delayMs * attempt);
    const response = await fetch(url, { headers: { 'User-Agent': userAgent, 'Accept': 'application/json' } });
    if (response.status === 429 || response.status >= 500) { await sleep(2000 * attempt); continue; }
    if (!response.ok) throw new Error(response.status + ' for ' + url);
    const body = await response.json();
    // The API reports "too busy" and lag problems as a 200 with an error object. Never cache those.
    if (body.error) { await sleep(2000 * attempt); continue; }
    writeFileSync(file, JSON.stringify(body));
    return body;
  }
  throw new Error('Gave up on ' + url);
}
const query = (params: Record<string, string>) => api + '?' + new URLSearchParams({ format: 'json', formatversion: '2', ...params }).toString();

interface Entity { id: string; labels?: Record<string, { value: string }>; descriptions?: Record<string, { value: string }>; claims?: Record<string, any[]>; sitelinks?: Record<string, { title: string }> }
const entities = new Map<string, Entity>();
async function loadEntities(ids: string[], props: string) {
  const need = [...new Set(ids)].filter(id => !entities.has(id + '|' + props));
  for (let index = 0; index < need.length; index += 40) {
    const chunk = need.slice(index, index + 40);
    const result = await getJson(query({ action: 'wbgetentities', ids: chunk.join('|'), props, languages: 'en' }));
    for (const id of chunk) if (result.entities?.[id]) entities.set(id + '|' + props, result.entities[id]);
  }
  return ids.map(id => entities.get(id + '|' + props)).filter(Boolean) as Entity[];
}
const itemProps = 'claims|sitelinks|labels|descriptions';

// ---------------------------------------------------------------- wikidata reading
const claimIds = (entity: Entity, property: string) => (entity.claims?.[property] ?? []).filter(claim => claim.rank !== 'deprecated').map(claim => claim.mainsnak?.datavalue?.value?.id).filter(Boolean) as string[];
function releaseYears(entity: Entity) {
  return (entity.claims?.P577 ?? []).filter(claim => claim.rank !== 'deprecated').map(claim => Number(String(claim.mainsnak?.datavalue?.value?.time ?? '').match(/^[+-]?(\d{4})/)?.[1])).filter(Boolean);
}
function steamId(entity: Entity) {
  const claims = (entity.claims?.P1733 ?? []).filter(claim => claim.rank !== 'deprecated' && claim.mainsnak?.datavalue?.value);
  const preferred = claims.filter(claim => claim.rank === 'preferred');
  return String((preferred[0] ?? claims[0])?.mainsnak?.datavalue?.value ?? '') || null;
}
const classVerdicts = new Map<string, boolean>();
/** True when a class is one of the game classes or a subclass of one, following P279 up to six levels. */
async function isGameClass(start: string): Promise<boolean> {
  if (classVerdicts.has(start)) return classVerdicts.get(start)!;
  let frontier = [start];
  const seen = new Set<string>();
  let verdict = false;
  for (let depth = 0; depth < 6 && frontier.length && !verdict; depth++) {
    if (frontier.some(id => gameClasses.has(id))) { verdict = true; break; }
    frontier.forEach(id => seen.add(id));
    const classes = await loadEntities(frontier, 'claims');
    frontier = [...new Set(classes.flatMap(entity => claimIds(entity, 'P279')))].filter(id => !seen.has(id));
  }
  classVerdicts.set(start, verdict);
  return verdict;
}
async function isGame(entity: Entity) {
  for (const type of claimIds(entity, 'P31')) if (await isGameClass(type)) return true;
  return false;
}

// ---------------------------------------------------------------- matching
interface Candidate { qid: string; label: string; description: string; years: number[]; labelMatch: boolean; yearExact: boolean; entity: Entity }
// Many recent items carry their label under the language-neutral "mul" code, so the search hit's own label is the fallback.
const searchLabels = new Map<string, string>();
const labelOf = (entity: Entity) => entity.labels?.en?.value ?? entity.labels?.mul?.value ?? searchLabels.get(entity.id) ?? '';

/** Search variants for a title: the title itself, then a few harmless rewrites. */
function searchTerms(title: string) {
  const terms = [title];
  const stripped = title.replace(/\s*[—–-]\s*.*$/, '').replace(/\s+(Director's Cut|Remastered|Enhanced Edition|All You Can Eat)$/i, '');
  if (stripped !== title) terms.push(stripped);
  return [...new Set(terms)];
}

async function findCandidates(game: { id: string; title: string; year: number | null }) {
  const found = new Map<string, string>();
  for (const term of searchTerms(game.title)) {
    const result = await getJson(query({ action: 'wbsearchentities', search: term, language: 'en', uselang: 'en', type: 'item', limit: '12' }));
    for (const hit of result.search ?? []) {
      if (!found.has(hit.id)) found.set(hit.id, hit.display?.description?.value ?? '');
      const label = hit.display?.label?.value ?? hit.label;
      if (label && !searchLabels.has(hit.id)) searchLabels.set(hit.id, label);
    }
  }
  const loaded = await loadEntities([...found.keys()], itemProps);
  const wanted = new Set([normalize(game.title), ...searchTerms(game.title).map(normalize)]);
  const candidates: Candidate[] = [];
  for (const entity of loaded) {
    const kind = await isGame(entity);
    const years = releaseYears(entity);
    if (explain.has(game.id)) console.log('  [why ' + game.id + '] ' + entity.id + ' "' + labelOf(entity) + '" game=' + kind + ' years=' + years.join('/') + ' - ' + (entity.descriptions?.en?.value ?? found.get(entity.id)));
    if (!kind) continue;
    if (game.year !== null && !years.some(year => Math.abs(year - game.year!) <= yearTolerance)) continue;
    const label = labelOf(entity);
    candidates.push({
      qid: entity.id, label, description: entity.descriptions?.en?.value ?? found.get(entity.id) ?? '', years, entity,
      labelMatch: wanted.has(normalize(label)),
      yearExact: game.year !== null && years.includes(game.year),
    });
  }
  return candidates;
}

type Link = { wikidata: string; wikipedia: string | null; steam: string | null };
function linkFor(entity: Entity): Link {
  const title = entity.sitelinks?.enwiki?.title;
  const steam = steamId(entity);
  return {
    wikidata: entity.id,
    wikipedia: title ? 'https://en.wikipedia.org/wiki/' + encodeURIComponent(title.replace(/ /g, '_')).replace(/%3A/g, ':').replace(/%2C/g, ',') : null,
    steam: steam && /^\d+$/.test(steam) ? 'https://store.steampowered.com/app/' + steam + '/' : null,
  };
}

// ---------------------------------------------------------------- run
const snapshot = JSON.parse(readFileSync(new URL('../src/data/games.json', import.meta.url), 'utf8')) as GamesSnapshot;
const links: Record<string, Link> = {};
const matched: string[] = [];
const ambiguous: string[] = [];
const unmatched: string[] = [];
const notes: string[] = [];

for (const game of snapshot.games) {
  if (game.builtByMe) continue;
  const tag = game.title + ' (' + (game.year ?? 'no year') + ')';
  if (game.id in overrides) {
    const override = overrides[game.id];
    const qid = typeof override === 'object' && override !== null ? override.qid : override;
    if (qid === null) { unmatched.push(tag + '  [override: leave unlinked]'); continue; }
    const [entity] = await loadEntities([qid], itemProps);
    if (!entity) throw new Error('Override for ' + game.id + ' points at a missing item: ' + qid);
    if (!(await isGame(entity))) notes.push('Override ' + game.id + ' -> ' + qid + ' is not typed as a game (' + labelOf(entity) + ')');
    links[game.id] = typeof override === 'object' && override !== null ? { ...linkFor(entity), steam: null } : linkFor(entity);
    matched.push(tag + '  ->  ' + qid + ' ' + labelOf(entity) + '  [override]');
    continue;
  }
  const candidates = await findCandidates(game);
  // Prefer exact label + exact year, then exact label, then exact year; accept only when one candidate stands alone at the best tier.
  const tiers = [
    candidates.filter(candidate => candidate.labelMatch && candidate.yearExact),
    candidates.filter(candidate => candidate.labelMatch),
    candidates.filter(candidate => candidate.yearExact && candidate.entity.sitelinks?.enwiki),
  ];
  const best = tiers.find(tier => tier.length > 0) ?? [];
  const describe = (candidate: Candidate) => candidate.qid + ' "' + candidate.label + '" ' + candidate.years.join('/') + ' - ' + candidate.description;
  if (best.length === 1 && (best[0].labelMatch || candidates.length === 1)) {
    links[game.id] = linkFor(best[0].entity);
    matched.push(tag + '  ->  ' + describe(best[0]));
  } else if (candidates.length === 0) {
    unmatched.push(tag);
  } else {
    ambiguous.push(tag + '\n' + candidates.map(candidate => '      ' + describe(candidate)).join('\n'));
  }
}

const generatedAt = new Date().toLocaleDateString('en-CA');
const sortedLinks = Object.fromEntries(Object.entries(links).sort(([a], [b]) => a.localeCompare(b)));
console.log(JSON.stringify({ games: snapshot.games.filter(game => !game.builtByMe).length, matched: matched.length, withWikipedia: Object.values(links).filter(link => link.wikipedia).length, withSteam: Object.values(links).filter(link => link.steam).length, ambiguous: ambiguous.length, unmatched: unmatched.length }, null, 2));
console.log('\nMatched (' + matched.length + '):\n' + matched.map(line => '  ' + line).join('\n'));
console.log('\nAmbiguous (' + ambiguous.length + '), not written unless overridden:\n' + ambiguous.map(line => '  ' + line).join('\n'));
console.log('\nUnmatched (' + unmatched.length + '):\n' + unmatched.map(line => '  ' + line).join('\n'));
if (notes.length) console.log('\nNotes:\n' + notes.map(line => '  ' + line).join('\n'));
const withoutWikipedia = Object.entries(sortedLinks).filter(([, link]) => !link.wikipedia).map(([id]) => id);
if (withoutWikipedia.length) console.log('\nMatched but no English Wikipedia article: ' + withoutWikipedia.join(', '));

if (process.argv.includes('--write')) {
  writeFileSync(new URL('../src/data/game-links.json', import.meta.url), JSON.stringify({ generatedAt, links: sortedLinks }, null, 2) + '\n');
  console.log('\nWrote src/data/game-links.json');
} else console.log('\nDry run. Pass --write to save src/data/game-links.json.');
