// TypeScript builds the public games snapshot from two private Markdown files with Node's standard library.
// Dry run by default. Pass --write to save src/data/games.json. The repo is public: only allowlisted sections and fields are read.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import type { Game, GameHours, GameStatus, GamesSnapshot, HoursConfidence } from '../src/data/games.ts';

const argument = (name: string) => {
  const index = process.argv.indexOf(name);
  const value = index === -1 ? undefined : process.argv[index + 1];
  if (!value || value.startsWith('--')) throw new Error('Provide ' + name + ' with the local Markdown file path. Usage: node scripts/export-games.ts --inventory <path> --backlog <path> [--write]');
  return value;
};
const inventory = readFileSync(argument('--inventory'), 'utf8').replace(/\r\n/g, '\n');
const backlog = readFileSync(argument('--backlog'), 'utf8').replace(/\r\n/g, '\n');

// ---------------------------------------------------------------- vocabulary
// The sources record finer statuses. They decide which record wins a merge, then fold into the three public ones.
type SourceStatus = 'playing' | 'retired' | 'finished' | 'started' | 'played' | 'launched' | 'backlog' | 'wishlist';
const statusRank: SourceStatus[] = ['playing', 'retired', 'finished', 'started', 'played', 'launched', 'backlog', 'wishlist'];
const publicStatus: Record<SourceStatus, GameStatus> = { playing: 'playing', retired: 'played', finished: 'played', started: 'played', played: 'played', launched: 'played', backlog: 'up-next', wishlist: 'up-next' };
const platformOrder = ['PC', 'Steam', 'GOG', 'Origin', 'Ubisoft Connect', 'Xbox', 'PSN', 'PS5', 'Browser'];
const pcStores = ['Steam', 'GOG', 'Origin', 'Ubisoft Connect'];

const normalize = (value: string) => value.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/['’]/g, '').replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, ' ').trim();
// Matching key: ignores case, accents, a leading "The", and the "Sid Meier's" prefix.
const matchKey = (title: string) => normalize(title).replace(/^the /, '').replace(/^sid meiers /, '');
const slug = (title: string) => normalize(title.replace(/,/g, '')).replace(/ /g, '-');

// Explicit alias map: variant title -> canonical title. A variant is merged into the canonical record, and the canonical title wins.
const aliases: [string, string][] = [
  ['Dragon Age: Inquisition Digital Deluxe', 'Dragon Age: Inquisition'],
  ['Battlefield 3 Limited Edition', 'Battlefield 3'],
  ['SimCity Limited Edition', 'SimCity'],
  ['The Witcher 3: Wild Hunt — Complete Edition', 'The Witcher 3: Wild Hunt'],
  ['Outer Worlds', 'The Outer Worlds'],
  ['The Outer Worlds: Spacer\'s Choice Edition', 'The Outer Worlds'],
  ['Baldur\'s Gate 3: Early Access', 'Baldur\'s Gate 3'],
  ['Final Fantasy XIV: A Realm Reborn', 'Final Fantasy XIV'],
  ['Final Fantasy XIV Online', 'Final Fantasy XIV'],
  ['XCOM 2: War of the Chosen', 'XCOM 2'],
  ['World of Warcraft (heavy raiding era)', 'World of Warcraft'],
  ['NieR Replicant ver.1.22474487139...', 'NieR Replicant'],
  ['Assassin\'s Creed IV Black Flag — Resynced', 'Assassin\'s Creed IV Black Flag'],
  ['The Last of Us Part 2', 'The Last of Us Part II'],
  ['Call of Duty (PC, title not distinguished)', 'Call of Duty'],
  // Display-name clean-ups for all-caps source titles.
  ['FINAL FANTASY VII REBIRTH', 'Final Fantasy VII Rebirth'],
  ['GOD FORSAKEN', 'God Forsaken'],
  ['HARVESTELLA', 'Harvestella'],
  ['OCTOPATH TRAVELER II', 'Octopath Traveler II'],
  ['WARCANA', 'Warcana'],
  ['HUMANKIND', 'Humankind'],
  ['DRAGON QUEST BUILDERS 2', 'Dragon Quest Builders 2'],
  ['STAR WARS Squadrons', 'Star Wars Squadrons'],
  ['STAR WARS Outlaws', 'Star Wars Outlaws'],
];
const aliasMap = new Map(aliases.map(([variant, canonical]) => [matchKey(tidy(variant)), canonical]));

// Titles never published, even when they sit inside an allowed table.
// Rows that stay private, stored as SHA-256 hashes of the normalized title so this public file does not name them.
const excludedTitleHashes = new Set(['3ca3410957184316d3c05a861eae9fd8490a4c846053643ced61d734f7117fc3', '201ee940b13bf45e88b715763a8287fe59445045a360a7b4b8a714d10d164f6b']);
const isExcluded = (title: string) => excludedTitleHashes.has(createHash('sha256').update(normalize(title)).digest('hex'));

// Public release years (original release for remasters) for titles whose rows carry no year in either file. These are public facts, not read from the vault. Titles I was unsure of are left out on purpose.
const publicReleaseYears: Record<string, number> = {
  'Pathfinder: Wrath of the Righteous': 2021, 'Battlefield 4': 2013, 'Battlefield 3': 2011, 'Metal Gear Solid V: The Phantom Pain': 2015,
  'Oxygen Not Included': 2019, 'SimCity': 2013, 'Pathfinder: Kingmaker': 2018, 'Rust': 2018, 'Halo Infinite': 2021, 'Anno 1800': 2019,
  'Far Cry 6': 2021, 'Grand Theft Auto V': 2013, 'V Rising': 2024, 'Ori and the Will of the Wisps': 2020, 'Dragon Quest Builders 2': 2018,
  'Humankind': 2021, 'Rocket League': 2015, 'Diablo III: Reaper of Souls': 2014, 'Conan Exiles': 2018, 'Horizon Zero Dawn': 2017,
  'Assassin\'s Creed Origins': 2017, 'FAR: Changing Tides': 2022, 'Carrion': 2020, 'Dead Cells': 2018, 'NBA 2K16': 2015,
  'Ratchet & Clank': 2016, 'Red Dead Redemption 2': 2018, 'Apex Legends': 2019, 'Warhammer 40,000: Rogue Trader': 2023,
  'Dune: Awakening': 2025, 'Crimson Desert': 2026, 'Control Resonant': 2026, 'The Last of Us Part II': 2020,
  'Age of Empires IV': 2021, 'Age of Wonders 4': 2023, 'Anno 2205': 2015, 'Assassin\'s Creed IV Black Flag': 2013, 'Assassin\'s Creed Mirage': 2023,
  'Assassin\'s Creed Shadows': 2025, 'Assassin\'s Creed Valhalla': 2020, 'Astro Bot': 2024, 'Atlas Fallen': 2023, 'Avatar: Frontiers of Pandora': 2023,
  'Banishers: Ghosts of New Eden': 2024, 'Battlefield 2042': 2021, 'Battlefield 6': 2025, 'Cairn': 2026, 'Company of Heroes 3': 2023, 'Cult of the Lamb': 2022,
  'Days Gone Remastered': 2019, 'Destiny 2: The Final Shape': 2024, 'Doom Eternal': 2020, 'Dragon Age: The Veilguard': 2024, 'Dynasty Warriors: Origins': 2025,
  'Enshrouded': 2024, 'Fall Guys': 2020, 'Final Fantasy VII Rebirth': 2024, 'Final Fantasy XVI': 2023, 'Ghost of Tsushima Director\'s Cut': 2020,
  'God of War Ragnarök': 2022, 'Harvestella': 2022, 'Helldivers 2': 2024, 'Hitman World of Assassination': 2023, 'Hogwarts Legacy': 2023,
  'Hollow Knight: Silksong': 2025, 'Kingdom Come: Deliverance': 2018, 'Kingdom Come: Deliverance II': 2025, 'Kingdom Two Crowns': 2018, 'LEGO Worlds': 2017,
  'Mafia: The Old Country': 2025, 'Marvel Rivals': 2024, 'Marvel\'s Midnight Suns': 2022, 'Marvel\'s Spider-Man 2': 2023, 'Marvel\'s Spider-Man Remastered': 2018,
  'Marvel\'s Spider-Man: Miles Morales': 2020, 'Mass Effect Legendary Edition': 2021, 'Max Payne 3': 2012, 'Might & Magic Heroes VII': 2015, 'Neva': 2024,
  'NieR Replicant': 2010, 'NieR: Automata': 2017, 'Nine Sols': 2024, 'Nioh 3': 2026, 'No Man\'s Sky': 2016, 'Octopath Traveler II': 2023,
  'Overcooked! All You Can Eat': 2020, 'Ratchet & Clank: Rift Apart': 2021, 'Rise of the Ronin': 2024, 'RoboCop: Rogue City': 2023, 'Sackboy: A Big Adventure': 2020,
  'Scott Pilgrim vs. the World: The Game': 2010, 'Sid Meier\'s Civilization VII': 2025, 'Sifu': 2022, 'Slay the Spire': 2019, 'SpellForce: Conquest of Eo': 2023,
  'Star Wars Jedi: Fallen Order': 2019, 'Star Wars Jedi: Survivor': 2023, 'Star Wars Outlaws': 2024, 'Star Wars Squadrons': 2020, 'Stellaris': 2016,
  'Terminator: Dark Fate — Defiance': 2024, 'The Expanse: A Telltale Series': 2023, 'The Last of Us Part I': 2022, 'The Nioh Collection': 2021,
  'The Outer Worlds 2': 2025, 'The Riftbreaker': 2021, 'Vampire Survivors': 2022, 'Visions of Mana': 2024, 'Warframe': 2013, 'Warhammer 40,000: Battlesector': 2021,
  'Warhammer 40,000: Gladius — Relics of War': 2018, 'Warhammer 40,000: Inquisitor — Martyr': 2018, 'Warhammer 40,000: Space Marine 2': 2024, 'Wo Long: Fallen Dynasty': 2023,
  'Hades II': 2025, 'Songs of Conquest': 2024, 'Stranded: Alien Dawn': 2023, 'Foundation': 2025, 'The Blood of Dawnwalker': 2026,
};

// Public platforms for titles whose rows name none. Antonio states them in his own public review on Notes, so they are public facts, not vault entries. Applied only when the record has no platforms.
const publicPlatforms: Record<string, string[]> = {
  'Crimson Desert': ['PS5'],
};

// Hours kept as the source's own point figure when it also gives a range.
const hoursOverrides: Record<string, { value: number; display: string }> = {
  'League of Legends': { value: 8000, display: '~6,000–9,000h' },
};

// Playing now, from the vault's October 2026 notes. Only names and status are copied; the script checks both are still mentioned.
const manual: { title: string; mention: string; platforms: string[]; builtByMe?: boolean; href?: string }[] = [
  { title: 'Dune: Awakening', mention: 'Dune: Awakening', platforms: ['Steam'] },
  { title: 'Uplift', mention: 'Uplift', platforms: ['Browser'], builtByMe: true, href: 'https://uplifttowergame.com' },
];
for (const entry of manual) if (!inventory.includes(entry.mention)) throw new Error('Expected the inventory to mention ' + entry.mention + '.');
const nowPlayingOrder = ['Warhammer 40,000: Rogue Trader', 'Control Resonant', 'Dune: Awakening', 'Uplift'];
const lookingForwardOrder = ['The Last of Us Part II'];

// ---------------------------------------------------------------- parsing helpers
/** Removes a trailing parenthetical, returning the year when the parenthetical is only a year. */
function tidy(raw: string) {
  return raw.replace(/\*\*/g, '').replace(/\s*\.\.\.$/, '').replace(/\s*\((?:19|20)\d\d\)\s*$/, '').replace(/\s*\([^)]*\)\s*$/, '').trim();
}
const yearInParens = (raw: string) => Number(raw.match(/\(((?:19|20)\d\d)\)\s*$/)?.[1]) || null;

function parseHours(cell: string | undefined): { value: number | null; display: string; confidence: HoursConfidence } | null {
  const text = (cell ?? '').replace(/\*\*/g, '').trim();
  if (!text || text === '—' || text === '?' || text === '-') return null;
  const range = text.match(/^(~)?([\d,]+)\s*[–-]\s*([\d,]+)h$/);
  if (range) return { value: (Number(range[2].replace(/,/g, '')) + Number(range[3].replace(/,/g, ''))) / 2, display: text, confidence: range[1] ? 'estimate' : 'tracked' };
  const full = text.match(/^(~)?([\d,]+)h(?:\s*(\d+)m)?(\+)?$/);
  if (full) {
    const value = Number(full[2].replace(/,/g, '')) + (full[3] ? Number(full[3]) / 60 : 0);
    return { value: Math.round(value * 100) / 100, display: text, confidence: full[1] ? 'estimate' : full[4] ? 'floor' : 'tracked' };
  }
  const minutes = text.match(/^(\d+)m$/);
  if (minutes) return { value: Math.round((Number(minutes[1]) / 60) * 100) / 100, display: text, confidence: 'tracked' };
  throw new Error('Unrecognised hours form: ' + text);
}
const parseProgress = (cell: string | undefined) => { const match = (cell ?? '').match(/(\d+)%/); return match ? Number(match[1]) : null; };
const storeNames: Record<string, string> = { steam: 'Steam', gog: 'GOG', origin: 'Origin', 'ubisoft connect': 'Ubisoft Connect', xbox: 'Xbox', psn: 'PSN', pc: 'PC', ps5: 'PS5' };
const parsePlatforms = (cell: string | undefined) => (cell ?? '').split(',').map(name => storeNames[name.trim().toLowerCase()]).filter(Boolean) as string[];
/** Public label for a counter. Fixed labels only, so file paths and notes cannot leak. */
function galaxySource(platforms: string[]) {
  if (platforms.length !== 1) return 'GOG Galaxy';
  return platforms[0] === 'GOG' ? 'GOG Galaxy' : platforms[0] + ' via GOG Galaxy';
}
function tableSource(text: string) {
  const galaxy = text.match(/GOG Galaxy\s*←\s*(Steam|Xbox|PSN|Origin|Ubisoft Connect)/);
  if (galaxy) return galaxy[1] + ' via GOG Galaxy';
  if (/in-game counter/i.test(text)) return 'In-game counter';
  return null;
}

// ---------------------------------------------------------------- observations
interface Observation {
  raw: string;
  where: string;
  status?: SourceStatus;
  year?: number | null;
  decade?: number | null;
  platforms?: string[];
  genre?: string | null;
  hours?: GameHours | null;
  progress?: number | null;
}
const observations: Observation[] = [];

// Backlog: only the PC and PS5 checklists. Link targets, notes columns, quotes and the posts sections are never read.
{
  let list: 'PC' | 'PS5' | null = null;
  let decade: number | null = null;
  let genre: string | null = null;
  for (const line of backlog.split('\n')) {
    const heading = line.match(/^(#{1,6}) (.*)$/);
    if (heading) {
      const [, marks, text] = heading;
      if (marks.length === 2) { list = text.startsWith('PC source') ? 'PC' : text.startsWith('PS5 source') ? 'PS5' : null; decade = null; genre = null; continue; }
      if (!list) continue;
      const clean = text.replace(/^[^\p{L}\p{N}]+/u, '').trim();
      if (marks.length === 3 && list === 'PC') { decade = Number(clean.match(/^(\d{4})s/)?.[1]) || null; genre = null; }
      else if (marks.length === 3 && list === 'PS5') genre = clean;
      else if (marks.length === 4 && list === 'PC') genre = clean;
      continue;
    }
    if (!list) continue;
    const item = line.match(/^- \[( |x)\] (?:\*\*)?\[(.+?)\]\([^)]*\)(.*)$/);
    if (!item) continue;
    const [, box, raw, rest] = item;
    const yearText = rest.match(/^\s*\(((?:19|20)\d\d)/)?.[1];
    let status: SourceStatus;
    if (list === 'PC') status = box === 'x' ? 'played' : 'backlog';
    else {
      const mark = rest.match(/status:\s*([a-z-]+)/)?.[1];
      if (mark === 'completed') status = 'finished';
      else if (mark === 'in-progress' || mark === 'playing') status = 'started';
      else if (mark === 'quit') status = 'played';
      else if (mark === 'todo') status = box === 'x' ? 'played' : 'backlog';
      else throw new Error('Unknown PS5 status "' + mark + '" for ' + raw);
    }
    observations.push({ raw: tidy(raw), where: 'backlog ' + list, status, year: yearInParens(raw) ?? (yearText ? Number(yearText) : null), decade: list === 'PC' ? decade : null, platforms: [list], genre });
  }
}

// Inventory: an explicit allowlist of sections. Every other heading switches parsing off, and callouts (lines starting ">") are never read.
type Section = 'overview' | 'rotation' | 'category' | 'galaxy' | 'save' | 'done' | 'looking';
const allowedSections: [string, Section][] = [
  ['Overview', 'overview'], ['Recorded rotation', 'rotation'], ['MOBA', 'category'], ['MMORPG', 'category'], ['Single-player and other', 'category'],
  ['Tracked playtime, ≥20h', 'galaxy'], ['Notable progress without', 'galaxy'], ['Already named in this file', 'save'], ['Not previously named in this file', 'save'],
  ['Done playing', 'done'], ['Looking forward to', 'looking'],
];
let lifetime: GamesSnapshot['lifetime'] | null = null;
let trackedFloorHours: number | null = null;
{
  let section: Section | null = null;
  let label = '';
  let columns: Record<string, number> | null = null;
  let inTable = false;
  for (const line of inventory.split('\n')) {
    const heading = line.match(/^(#{1,6}) (.*)$/);
    if (heading) {
      const found = allowedSections.find(([prefix]) => heading[2].startsWith(prefix));
      section = found ? found[1] : null;
      label = 'inventory ' + (found ? found[0] : '');
      inTable = false;
      continue;
    }
    if (!section) continue;
    if (line.startsWith('|')) {
      const cells = line.split('|').slice(1, -1).map(cell => cell.replace(/\*\*/g, '').trim());
      if (cells.every(cell => /^:?-+:?$/.test(cell))) continue;
      if (!inTable) { inTable = true; columns = Object.fromEntries(cells.map((cell, index) => [cell.toLowerCase(), index])); continue; }
      const col = (name: string) => cells[columns![name] ?? -1];
      const title = cells[0];
      if (section === 'overview') {
        if (title === 'Total lifetime hours') {
          const range = cells[1].match(/^~?([\d,]+)\s*[–-]\s*([\d,]+)$/);
          if (!range) throw new Error('Could not read the lifetime hours range: ' + cells[1]);
          lifetime = { low: Number(range[1].replace(/,/g, '')), high: Number(range[2].replace(/,/g, '')), confidence: 'estimate' };
        }
        if (title.startsWith('Hours from tracked sources')) {
          const floor = cells[1].match(/^([\d,]+)h\+?$/);
          if (!floor) throw new Error('Could not read the tracked floor: ' + cells[1]);
          trackedFloorHours = Number(floor[1].replace(/,/g, ''));
        }
        continue;
      }
      if (isExcluded(title)) { console.error('Skipped an excluded row.'); continue; }
      const raw = tidy(title);
      const year = yearInParens(title);
      if (section === 'rotation') {
        const hours = parseHours(col('hours'));
        const source = tableSource(col('confidence') ?? '');
        observations.push({ raw, where: label, status: 'playing', year, platforms: parsePlatforms(col('platform')), hours: hours && { ...hours, source } });
      } else if (section === 'category') {
        const hours = parseHours(col('hours'));
        const stated = (col('confidence') ?? '').toLowerCase();
        if (hours && stated && !stated.startsWith(hours.confidence)) throw new Error('Hours form and confidence disagree for ' + title + ': ' + hours.display + ' vs ' + stated);
        observations.push({ raw, where: label, status: 'played', year, hours: hours && { ...hours, source: tableSource(col('source') ?? '') } });
      } else if (section === 'galaxy') {
        const platforms = parsePlatforms(col('platform(s)'));
        const hours = parseHours(col('hours'));
        const progress = parseProgress(col('progress'));
        observations.push({ raw, where: label, status: progress === 100 ? 'finished' : 'played', year, platforms, hours: hours && { ...hours, source: galaxySource(platforms) }, progress });
      } else if (section === 'save') {
        observations.push({ raw, where: label, status: 'launched', year, platforms: ['PC'] });
      }
      continue;
    }
    inTable = false;
    if (section === 'done') {
      const item = line.match(/^- (.+?)(?: \(|\. )/);
      if (item) observations.push({ raw: tidy(item[1]), where: label, status: 'retired' });
    } else if (section === 'looking') {
      const item = line.match(/^\d+\. (.+)$/);
      if (item) observations.push({ raw: tidy(item[1]), where: label, status: 'wishlist' });
    }
  }
}
if (!lifetime || trackedFloorHours === null) throw new Error('Could not read the lifetime estimate and tracked floor from the inventory overview.');

// ---------------------------------------------------------------- merge
interface Entry extends Omit<Game, 'status'> { status: SourceStatus; seen: { raw: string; where: string }[]; aliased: boolean }
const records = new Map<string, Entry>();
const merges: string[] = [];
const hoursConflicts: string[] = [];
for (const observation of observations) {
  const canonical = aliasMap.get(matchKey(observation.raw));
  const title = canonical ?? observation.raw;
  const key = matchKey(title);
  let record = records.get(key);
  if (!record) {
    record = { id: slug(title), title, year: null, decade: null, platforms: [], genre: null, status: observation.status ?? 'played', hours: null, progress: null, seen: [], aliased: false };
    records.set(key, record);
  } else if (canonical) record.title = canonical;
  if (canonical) record.aliased = true;
  record.seen.push({ raw: observation.raw, where: observation.where });
  if (observation.status && statusRank.indexOf(observation.status) < statusRank.indexOf(record.status)) record.status = observation.status;
  if (observation.year && record.year === null) record.year = observation.year;
  if (observation.decade && record.decade === null) record.decade = observation.decade;
  if (observation.genre && record.genre === null) record.genre = observation.genre;
  for (const platform of observation.platforms ?? []) if (!record.platforms.includes(platform)) record.platforms.push(platform);
  if (observation.hours) {
    if (record.hours === null) record.hours = observation.hours;
    else if (record.hours.display !== observation.hours.display) hoursConflicts.push(record.title + ': kept ' + record.hours.display + ', also saw ' + observation.hours.display + ' in ' + observation.where);
  }
  if (observation.progress !== undefined && observation.progress !== null && record.progress === null) record.progress = observation.progress;
}
// Hand-added current games.
for (const entry of manual) {
  const key = matchKey(entry.title);
  if (records.has(key)) throw new Error('Manual title already present in the sources: ' + entry.title);
  records.set(key, { id: slug(entry.title), title: entry.title, year: null, decade: null, platforms: entry.platforms, genre: null, status: 'playing', hours: null, progress: null, ...(entry.builtByMe ? { builtByMe: true } : {}), ...(entry.href ? { href: entry.href } : {}), seen: [{ raw: entry.title, where: 'manual' }], aliased: false });
}

// Finish each record: overrides, public years, decade fallback, platform order.
const games: Game[] = [];
for (const record of records.values()) {
  const override = hoursOverrides[record.title];
  if (override && record.hours) record.hours = { ...record.hours, value: override.value, display: override.display };
  if (record.year === null && publicReleaseYears[record.title]) record.year = publicReleaseYears[record.title];
  if (record.platforms.length === 0 && publicPlatforms[record.title]) record.platforms = [...publicPlatforms[record.title]];
  // The backlog's decade sections are loose (Elden Ring sits under the 2010s), so a known release year decides the decade.
  if (record.year !== null) record.decade = Math.floor(record.year / 10) * 10;
  if (pcStores.some(store => record.platforms.includes(store))) record.platforms = record.platforms.filter(platform => platform !== 'PC');
  record.platforms.sort((a, b) => platformOrder.indexOf(a) - platformOrder.indexOf(b));
  const distinct = new Set(record.seen.map(entry => entry.where + '|' + entry.raw));
  if (distinct.size > 1) merges.push(record.title + ' <- ' + [...distinct].map(entry => { const [where, raw] = entry.split('|'); return raw + ' [' + where.replace('inventory ', 'inv: ').replace('backlog ', 'backlog ') + ']'; }).join('; '));
  const { seen: _seen, aliased: _aliased, ...game } = record;
  games.push({ id: game.id, title: game.title, year: game.year, decade: game.decade, platforms: game.platforms, genre: game.genre, status: publicStatus[game.status], hours: game.hours, progress: game.progress, ...(game.builtByMe ? { builtByMe: true } : {}), ...(game.href ? { href: game.href } : {}) });
}
games.sort((a, b) => a.title.localeCompare(b.title, 'en', { sensitivity: 'base' }));
const ids = games.map(game => game.id);
const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
if (duplicateIds.length) throw new Error('Duplicate game ids: ' + [...new Set(duplicateIds)].join(', '));
const idOf = (title: string) => { const game = games.find(candidate => candidate.title === title); if (!game) throw new Error('Expected game not found: ' + title); return game.id; };

const snapshot: GamesSnapshot = {
  exportedAt: new Date().toLocaleDateString('en-CA'),
  lifetime,
  trackedFloorHours,
  nowPlaying: nowPlayingOrder.map(idOf),
  lookingForward: lookingForwardOrder.map(idOf),
  games,
};
for (const id of [...snapshot.nowPlaying]) if (games.find(game => game.id === id)?.status !== 'playing') throw new Error('Now-playing game is not marked playing: ' + id);
for (const id of snapshot.lookingForward) if (games.find(game => game.id === id)?.status !== 'up-next') throw new Error('Looking-forward game is not marked up next: ' + id);

// ---------------------------------------------------------------- report
const output = new URL('../src/data/games.json', import.meta.url);
const previous: Game[] = existsSync(output) ? (JSON.parse(readFileSync(output, 'utf8')) as GamesSnapshot).games : [];
const before = new Map(previous.map(game => [game.id, game]));
const after = new Map(games.map(game => [game.id, game]));
const counts: Record<string, number> = {};
for (const game of games) counts[game.status] = (counts[game.status] ?? 0) + 1;
// Near-duplicate hints: one match key starting with another, for human review.
const keys = [...records.keys()].sort();
const near = keys.flatMap(a => keys.filter(b => b !== a && b.startsWith(a + ' ') && a.split(' ').length >= 2).map(b => records.get(a)!.title + '  ~  ' + records.get(b)!.title));
console.log(JSON.stringify({
  total: games.length,
  byStatus: counts,
  added: games.filter(game => !before.has(game.id)).map(game => game.title),
  changed: games.filter(game => before.has(game.id) && JSON.stringify(before.get(game.id)) !== JSON.stringify(game)).map(game => game.title),
  removed: previous.filter(game => !after.has(game.id)).map(game => game.title),
}, null, 2));
if (merges.length) console.log('\nMerged records (' + merges.length + '):\n' + merges.map(line => '  ' + line).join('\n'));
if (hoursConflicts.length) console.log('\nHour figures that disagreed between sections:\n' + hoursConflicts.map(line => '  ' + line).join('\n'));
if (near.length) console.log('\nNear-duplicate titles kept separate (review):\n' + near.map(line => '  ' + line).join('\n'));
console.log('\nNo year recorded: ' + games.filter(game => game.year === null).length + '. No decade: ' + games.filter(game => game.decade === null).length + '.');
if (process.argv.includes('--write')) {
  writeFileSync(output, JSON.stringify(snapshot, null, 2) + '\n');
  console.log('\nWrote src/data/games.json');
} else console.log('\nDry run. Pass --write to save src/data/games.json.');
