// TypeScript matches every book in src/data/books.json to its Wikidata item with Node's standard library, then writes src/data/book-links.json.
// Dry run by default. Pass --write to save the file. The links live apart from books.json because the export script regenerates that file from private notes.
// A title links to English Wikipedia (enwiki sitelink). A book is linked only when its title, its author and its type all agree: a wrong link is worse than none.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import type { Book } from '../src/data/books.ts';

const userAgent = 'antoniwan.online-book-links/1.0 (https://antoniwan.online)';
const api = 'https://www.wikidata.org/w/api.php';
const delayMs = 300;
const cacheDir = new URL('../node_modules/.cache/link-books/', import.meta.url);
mkdirSync(cacheDir, { recursive: true });

// ---------------------------------------------------------------- overrides
// Book id -> Wikidata QID, or null for "no item exists / too ambiguous: leave unlinked".
// Each entry was checked by hand against the item's label, author (P50) and article.
const overrides: Record<string, string | null> = {};

// ---------------------------------------------------------------- vocabulary
// P31 (instance of) values that make an item a written work: literary work, book, written work, non-fiction work.
// A class that is a subclass (P279, followed up to a few levels) of any of these also counts.
const workClasses = new Set(['Q7725634', 'Q571', 'Q47461344', 'Q20540385']);
// "version, edition or translation": accepted only when no work item matches. A subclass counts too.
const editionClasses = new Set(['Q3331189']);
// Debugging aid: --why <id>[,<id>] prints every search hit for those books and why it passed or failed.
const whyIndex = process.argv.indexOf('--why');
const explain = new Set(whyIndex === -1 ? [] : (process.argv[whyIndex + 1] ?? '').split(','));

const normalize = (value: string) => value.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/['’]/g, '').replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, ' ').trim();
const wantedLanguages = 'en|es|mul';

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

interface Entity { id: string; labels?: Record<string, { value: string }>; aliases?: Record<string, { value: string }[]>; descriptions?: Record<string, { value: string }>; claims?: Record<string, any[]>; sitelinks?: Record<string, { title: string }> }
const entities = new Map<string, Entity>();
async function loadEntities(ids: string[], props: string) {
  const need = [...new Set(ids)].filter(id => !entities.has(id + '|' + props));
  for (let index = 0; index < need.length; index += 40) {
    const chunk = need.slice(index, index + 40);
    const result = await getJson(query({ action: 'wbgetentities', ids: chunk.join('|'), props, languages: wantedLanguages, sitefilter: 'enwiki' }));
    for (const id of chunk) if (result.entities?.[id]) entities.set(id + '|' + props, result.entities[id]);
  }
  return ids.map(id => entities.get(id + '|' + props)).filter(Boolean) as Entity[];
}
const itemProps = 'claims|sitelinks|labels|aliases|descriptions';
const nameProps = 'labels|aliases';

// ---------------------------------------------------------------- wikidata reading
const claimIds = (entity: Entity, property: string) => (entity.claims?.[property] ?? []).filter(claim => claim.rank !== 'deprecated').map(claim => claim.mainsnak?.datavalue?.value?.id).filter(Boolean) as string[];
/** Every label and alias the item carries in English, Spanish or the language-neutral "mul" code. */
function names(entity: Entity) {
  const found: string[] = [];
  for (const language of wantedLanguages.split('|')) {
    const label = entity.labels?.[language]?.value;
    if (label) found.push(label);
    for (const alias of entity.aliases?.[language] ?? []) found.push(alias.value);
  }
  return [...new Set(found)];
}
const searchLabels = new Map<string, string>();
const labelOf = (entity: Entity) => entity.labels?.en?.value ?? entity.labels?.mul?.value ?? entity.labels?.es?.value ?? searchLabels.get(entity.id) ?? '';

type ClassKind = 'work' | 'edition' | null;
const classVerdicts = new Map<string, ClassKind>();
/** 'work' when a class is one of the work classes or a subclass of one, 'edition' for the edition classes, following P279 up to six levels. */
async function classKind(start: string): Promise<ClassKind> {
  if (classVerdicts.has(start)) return classVerdicts.get(start)!;
  let frontier = [start];
  const seen = new Set<string>();
  let verdict: ClassKind = null;
  for (let depth = 0; depth < 6 && frontier.length && !verdict; depth++) {
    if (frontier.some(id => workClasses.has(id))) { verdict = 'work'; break; }
    if (frontier.some(id => editionClasses.has(id))) { verdict = 'edition'; break; }
    frontier.forEach(id => seen.add(id));
    const classes = await loadEntities(frontier, 'claims');
    frontier = [...new Set(classes.flatMap(entity => claimIds(entity, 'P279')))].filter(id => !seen.has(id));
  }
  classVerdicts.set(start, verdict);
  return verdict;
}
/** 'work' if any P31 value is a written-work class, else 'edition' if any is an edition class, else null. */
async function itemKind(entity: Entity): Promise<ClassKind> {
  const kinds = new Set<ClassKind>();
  for (const type of claimIds(entity, 'P31')) kinds.add(await classKind(type));
  return kinds.has('work') ? 'work' : kinds.has('edition') ? 'edition' : null;
}

// ---------------------------------------------------------------- authors
const suffixes = new Set(['jr', 'sr', 'ii', 'iii', 'iv']);
/** Split the author field into people: "A and B", "A, B", "A & B". */
function authorsOf(field: string) {
  return field.split(/\s*(?:,|&|\band\b)\s*/i).map(name => name.trim()).filter(Boolean);
}
const tokens = (name: string) => normalize(name).split(' ').filter(token => token && !suffixes.has(token));
/** Two names agree when they are equal, or share first and last token (so a middle name or initial does not matter). A single name must appear whole in the other. */
function sameName(first: string, second: string) {
  const a = tokens(first);
  const b = tokens(second);
  if (!a.length || !b.length) return false;
  if (a.join(' ') === b.join(' ')) return true;
  if (a.length === 1) return b.includes(a[0]);
  if (b.length === 1) return a.includes(b[0]);
  return a[0] === b[0] && a[a.length - 1] === b[b.length - 1];
}
const authorVerdicts = new Map<string, boolean>();
/** True when any P50 author of the item matches any person named in the book's author field. */
async function authorMatches(entity: Entity, field: string) {
  const authorIds = claimIds(entity, 'P50');
  if (!authorIds.length) return false;
  const people = authorsOf(field);
  const loaded = await loadEntities(authorIds, nameProps);
  const key = entity.id + '|' + field;
  const verdict = loaded.some(author => names(author).some(name => people.some(person => sameName(name, person)))) || (people.length > 1 && loaded.some(author => names(author).some(name => sameName(name, field))));
  authorVerdicts.set(key, verdict);
  return verdict;
}

// ---------------------------------------------------------------- titles
/** The title with its subtitle dropped: "12 Rules for Life: An Antidote to Chaos" -> "12 Rules for Life". */
const mainTitle = (title: string) => title.split(/\s*[:：]\s+/)[0];
/** Equal after normalization, or one side is the other plus a subtitle. */
function sameTitle(ours: string, theirs: string) {
  const a = normalize(ours);
  const b = normalize(theirs);
  if (!a || !b) return false;
  if (a === b) return true;
  if (/[:：]/.test(ours) && normalize(mainTitle(ours)) === b) return true;
  if (/[:：]/.test(theirs) && normalize(mainTitle(theirs)) === a) return true;
  // "The Five Love Languages" and "5 Love Languages" are not guessed; articles are ignored only.
  const bare = (value: string) => value.replace(/^(the|a|an|el|la|los|las) /, '');
  return bare(a) === bare(b);
}

// ---------------------------------------------------------------- matching
/** Search variants for a title: the title itself, then a few harmless rewrites. */
function searchTerms(title: string) {
  const terms = [title, mainTitle(title), title.replace(/&/g, 'and'), title.replace(/\s+and\s+/g, ' & ')];
  return [...new Set(terms.map(term => term.trim()).filter(Boolean))];
}
const surname = (field: string) => tokens(authorsOf(field)[0] ?? field).slice(-1)[0] ?? '';

interface Candidate { qid: string; label: string; description: string; kind: Exclude<ClassKind, null>; entity: Entity; wikipedia: boolean }

async function findCandidates(book: Book) {
  const found = new Map<string, string>();
  const remember = (id: string, label?: string, description?: string) => {
    if (!found.has(id)) found.set(id, description ?? '');
    if (label && !searchLabels.has(id)) searchLabels.set(id, label);
  };
  for (const term of searchTerms(book.title)) {
    const result = await getJson(query({ action: 'wbsearchentities', search: term, language: 'en', uselang: 'en', type: 'item', limit: '12' }));
    for (const hit of result.search ?? []) remember(hit.id, hit.display?.label?.value ?? hit.label, hit.display?.description?.value);
  }
  // Spanish titles live under Spanish labels.
  const spanish = await getJson(query({ action: 'wbsearchentities', search: book.title, language: 'es', uselang: 'es', type: 'item', limit: '12' }));
  for (const hit of spanish.search ?? []) remember(hit.id, hit.display?.label?.value ?? hit.label, hit.display?.description?.value);
  // Full-text search ranks well-linked items first, and the descriptions usually name the author.
  const text = await getJson(query({ action: 'query', list: 'search', srsearch: book.title + ' ' + surname(book.author), srlimit: '15', srnamespace: '0' }));
  for (const hit of text.query?.search ?? []) remember(hit.title);

  const loaded = await loadEntities([...found.keys()], itemProps);
  // An edition names the work it belongs to (P629); prefer the work, so load those too.
  const editionOf = new Map<string, string[]>();
  for (const entity of loaded) editionOf.set(entity.id, claimIds(entity, 'P629'));
  const extra = [...new Set([...editionOf.values()].flat())].filter(id => !found.has(id));
  const works = extra.length ? await loadEntities(extra, itemProps) : [];

  const candidates: Candidate[] = [];
  const seen = new Set<string>();
  const consider = async (entity: Entity, viaEdition: Entity | null) => {
    if (seen.has(entity.id)) return;
    const kind = await itemKind(entity);
    const titled = names(entity).concat(viaEdition ? names(viaEdition) : []).some(name => sameTitle(book.title, name));
    // An edition's work inherits the edition's author when it names none.
    const authored = (await authorMatches(entity, book.author)) || (viaEdition ? await authorMatches(viaEdition, book.author) : false);
    if (explain.has(book.id)) console.log('  [why ' + book.id + '] ' + entity.id + ' "' + labelOf(entity) + '" kind=' + kind + ' title=' + titled + ' author=' + authored + (viaEdition ? ' via edition ' + viaEdition.id : '') + ' enwiki=' + Boolean(entity.sitelinks?.enwiki) + ' - ' + (entity.descriptions?.en?.value ?? found.get(entity.id)));
    if (!kind || !titled || !authored) return;
    seen.add(entity.id);
    candidates.push({ qid: entity.id, label: labelOf(entity), description: entity.descriptions?.en?.value ?? found.get(entity.id) ?? '', kind, entity, wikipedia: Boolean(entity.sitelinks?.enwiki) });
  };
  for (const entity of loaded) await consider(entity, null);
  for (const entity of loaded) {
    if (!(await itemKind(entity)) || (await itemKind(entity)) !== 'edition') continue;
    for (const id of editionOf.get(entity.id) ?? []) {
      const work = works.find(item => item.id === id) ?? loaded.find(item => item.id === id);
      if (work) await consider(work, entity);
    }
  }
  return candidates;
}

type Link = { wikidata: string; wikipedia: string | null };
function linkFor(entity: Entity): Link {
  const title = entity.sitelinks?.enwiki?.title;
  return {
    wikidata: entity.id,
    wikipedia: title ? 'https://en.wikipedia.org/wiki/' + encodeURIComponent(title.replace(/ /g, '_')).replace(/%3A/g, ':').replace(/%2C/g, ',').replace(/%27/g, "'").replace(/%21/g, '!').replace(/%28/g, '(').replace(/%29/g, ')') : null,
  };
}

// ---------------------------------------------------------------- run
const books = JSON.parse(readFileSync(new URL('../src/data/books.json', import.meta.url), 'utf8')) as Book[];
const links: Record<string, Link> = {};
const matched: string[] = [];
const ambiguous: string[] = [];
const unmatched: string[] = [];
const notes: string[] = [];

for (const book of books) {
  const tag = book.title + ' (' + book.author + ')';
  if (book.id in overrides) {
    const qid = overrides[book.id];
    if (qid === null) { unmatched.push(tag + '  [override: leave unlinked]'); continue; }
    const [entity] = await loadEntities([qid], itemProps);
    if (!entity) throw new Error('Override for ' + book.id + ' points at a missing item: ' + qid);
    if (!(await itemKind(entity))) notes.push('Override ' + book.id + ' -> ' + qid + ' is not typed as a written work (' + labelOf(entity) + ')');
    links[book.id] = linkFor(entity);
    matched.push(tag + '  ->  ' + qid + ' ' + labelOf(entity) + '  [override]');
    continue;
  }
  const candidates = await findCandidates(book);
  // Prefer work items over editions; among those prefer the ones with an English article. Accept only when one candidate stands alone.
  const works = candidates.filter(candidate => candidate.kind === 'work');
  const pool = works.length ? works : candidates;
  const withArticle = pool.filter(candidate => candidate.wikipedia);
  const best = withArticle.length ? withArticle : pool;
  const describe = (candidate: Candidate) => candidate.qid + ' "' + candidate.label + '" [' + candidate.kind + (candidate.wikipedia ? ', enwiki' : ', no enwiki') + '] - ' + candidate.description;
  if (best.length === 1) {
    links[book.id] = linkFor(best[0].entity);
    matched.push(tag + '  ->  ' + describe(best[0]));
  } else if (candidates.length === 0) {
    unmatched.push(tag);
  } else {
    ambiguous.push(tag + '\n' + candidates.map(candidate => '      ' + describe(candidate)).join('\n'));
  }
}

const generatedAt = new Date().toLocaleDateString('en-CA');
const sortedLinks = Object.fromEntries(Object.entries(links).sort(([a], [b]) => a.localeCompare(b)));
console.log(JSON.stringify({ books: books.length, matched: matched.length, withWikipedia: Object.values(links).filter(link => link.wikipedia).length, ambiguous: ambiguous.length, unmatched: unmatched.length }, null, 2));
console.log('\nMatched (' + matched.length + '):\n' + matched.map(line => '  ' + line).join('\n'));
console.log('\nAmbiguous (' + ambiguous.length + '), not written unless overridden:\n' + ambiguous.map(line => '  ' + line).join('\n'));
console.log('\nUnmatched (' + unmatched.length + '):\n' + unmatched.map(line => '  ' + line).join('\n'));
if (notes.length) console.log('\nNotes:\n' + notes.map(line => '  ' + line).join('\n'));
const withoutWikipedia = Object.entries(sortedLinks).filter(([, link]) => !link.wikipedia).map(([id]) => id);
if (withoutWikipedia.length) console.log('\nMatched but no English Wikipedia article: ' + withoutWikipedia.join(', '));

if (process.argv.includes('--write')) {
  writeFileSync(new URL('../src/data/book-links.json', import.meta.url), JSON.stringify({ generatedAt, links: sortedLinks }, null, 2) + '\n');
  console.log('\nWrote src/data/book-links.json');
} else console.log('\nDry run. Pass --write to save src/data/book-links.json.');
