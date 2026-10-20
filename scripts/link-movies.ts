// TypeScript matches every film in src/data/movies.json to its Wikidata item with Node's standard library, then writes src/data/movie-links.json.
// Dry run by default. Pass --write to save the file. The links live apart from movies.json because the Letterboxd refresh rewrites that file.
// The match is exact, never a title search: Wikidata's "Letterboxd film ID" property (P6127) holds the same slug that movies.json uses as its id.
// A film links to English Wikipedia (enwiki sitelink) and to IMDb (P345). Both come from the same Wikidata item, so they describe the same film.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import type { MovieSnapshot } from '../src/utils/movies.ts';

const userAgent = 'antoniwan.online-movie-links/1.0 (https://antoniwan.online)';
const endpoint = 'https://query.wikidata.org/sparql';
const delayMs = 1000;
const batchSize = 40;
const cacheDir = new URL('../node_modules/.cache/link-movies/', import.meta.url);
mkdirSync(cacheDir, { recursive: true });

// ---------------------------------------------------------------- overrides
// Letterboxd slug -> Wikidata QID, used only when a slug maps to more than one item. The QID must be one of the items P6127 returned.
// Add an entry after checking the candidates by hand (label, year, director). Leave a slug out to keep it unlinked.
const overrides: Record<string, string> = {};

// ---------------------------------------------------------------- cached, polite fetching
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
async function sparql(text: string): Promise<any> {
  const url = endpoint + '?' + new URLSearchParams({ format: 'json', query: text }).toString();
  const file = new URL(createHash('sha256').update(url).digest('hex').slice(0, 24) + '.json', cacheDir);
  if (existsSync(file)) return JSON.parse(readFileSync(file, 'utf8'));
  for (let attempt = 1; attempt <= 5; attempt++) {
    await sleep(delayMs * attempt);
    const response = await fetch(url, { headers: { 'User-Agent': userAgent, 'Accept': 'application/sparql-results+json' } });
    // 429 and 5xx cover "too busy" and timeouts. Honour Retry-After when the server sends it.
    if (response.status === 429 || response.status >= 500) {
      const wait = Number(response.headers.get('retry-after')) || 3 * attempt;
      await sleep(wait * 1000);
      continue;
    }
    if (!response.ok) throw new Error(response.status + ' for the SPARQL query');
    const body = await response.json();
    // Only a real result set is cached. Anything else (an error body with a 200) is retried and never written.
    if (!Array.isArray(body?.results?.bindings)) { await sleep(3000 * attempt); continue; }
    writeFileSync(file, JSON.stringify(body));
    return body;
  }
  throw new Error('Gave up on a SPARQL batch');
}

// ---------------------------------------------------------------- wikidata reading
interface Item { qid: string; wikipedia: string | null; imdb: string[] }
const quote = (slug: string) => '"' + slug.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';
const wikipediaUrl = (article: string) => article.replace(/^http:/, 'https:');

/** slug -> items carrying that slug in P6127. More than one item means the slug is ambiguous. */
async function lookup(slugs: string[]) {
  const found = new Map<string, Map<string, Item>>();
  for (let index = 0; index < slugs.length; index += batchSize) {
    const batch = slugs.slice(index, index + batchSize);
    const text = `SELECT ?slug ?item ?article ?imdb WHERE {
  VALUES ?slug { ${batch.map(quote).join(' ')} }
  ?item wdt:P6127 ?slug .
  OPTIONAL { ?article schema:about ?item ; schema:isPartOf <https://en.wikipedia.org/> . }
  OPTIONAL { ?item wdt:P345 ?imdb . }
}`;
    const body = await sparql(text);
    for (const row of body.results.bindings) {
      const slug = row.slug.value as string;
      const qid = String(row.item.value).split('/').pop()!;
      const items = found.get(slug) ?? new Map<string, Item>();
      const item = items.get(qid) ?? { qid, wikipedia: null, imdb: [] };
      if (row.article?.value) item.wikipedia = wikipediaUrl(row.article.value);
      // P345 also holds person, company and character ids. Only title ids (tt...) describe a film.
      if (row.imdb?.value && /^tt\d+$/.test(row.imdb.value) && !item.imdb.includes(row.imdb.value)) item.imdb.push(row.imdb.value);
      items.set(qid, item);
      found.set(slug, items);
    }
  }
  return found;
}

// ---------------------------------------------------------------- run
type Link = { wikidata: string; wikipedia: string | null; imdb: string | null };
const snapshot = JSON.parse(readFileSync(new URL('../src/data/movies.json', import.meta.url), 'utf8')) as MovieSnapshot;
const found = await lookup(snapshot.movies.map(movie => movie.id));
const links: Record<string, Link> = {};
const matched: string[] = [];
const ambiguous: string[] = [];
const unmatched: string[] = [];
const notes: string[] = [];

for (const movie of snapshot.movies) {
  const tag = movie.title + ' (' + (movie.year ?? 'no year') + ') [' + movie.id + ']';
  const items = [...(found.get(movie.id)?.values() ?? [])];
  if (items.length === 0) { unmatched.push(tag); continue; }
  const override = overrides[movie.id];
  const chosen = items.length === 1 ? items[0] : items.find(item => item.qid === override);
  if (!chosen) {
    ambiguous.push(tag + '\n' + items.map(item => '      ' + item.qid + ' ' + (item.wikipedia ?? 'no enwiki') + ' ' + (item.imdb.join('/') || 'no imdb')).join('\n'));
    continue;
  }
  if (override && !items.some(item => item.qid === override)) notes.push('Override for ' + movie.id + ' (' + override + ') is not among the items P6127 returned');
  const imdb = [...chosen.imdb].sort()[0];
  if (chosen.imdb.length > 1) notes.push(movie.id + ' has several IMDb ids (' + chosen.imdb.join(', ') + '); using ' + imdb);
  links[movie.id] = { wikidata: chosen.qid, wikipedia: chosen.wikipedia, imdb: imdb ? 'https://www.imdb.com/title/' + imdb + '/' : null };
  matched.push(tag + '  ->  ' + chosen.qid + (override === chosen.qid ? '  [override]' : ''));
}

const generatedAt = new Date().toLocaleDateString('en-CA');
const sortedLinks = Object.fromEntries(Object.entries(links).sort(([a], [b]) => a.localeCompare(b)));
console.log(JSON.stringify({ films: snapshot.movies.length, matched: matched.length, withWikipedia: Object.values(links).filter(link => link.wikipedia).length, withImdb: Object.values(links).filter(link => link.imdb).length, ambiguous: ambiguous.length, unmatched: unmatched.length }, null, 2));
console.log('\nMatched (' + matched.length + '):\n' + matched.map(line => '  ' + line).join('\n'));
console.log('\nAmbiguous (' + ambiguous.length + '), not written unless overridden:\n' + ambiguous.map(line => '  ' + line).join('\n'));
console.log('\nUnmatched (' + unmatched.length + '), no P6127 item:\n' + unmatched.map(line => '  ' + line).join('\n'));
if (notes.length) console.log('\nNotes:\n' + notes.map(line => '  ' + line).join('\n'));
const withoutWikipedia = Object.entries(sortedLinks).filter(([, link]) => !link.wikipedia).map(([id]) => id);
if (withoutWikipedia.length) console.log('\nMatched but no English Wikipedia article: ' + withoutWikipedia.join(', '));
const withoutImdb = Object.entries(sortedLinks).filter(([, link]) => !link.imdb).map(([id]) => id);
if (withoutImdb.length) console.log('\nMatched but no IMDb id: ' + withoutImdb.join(', '));

if (process.argv.includes('--write')) {
  writeFileSync(new URL('../src/data/movie-links.json', import.meta.url), JSON.stringify({ generatedAt, links: sortedLinks }, null, 2) + '\n');
  console.log('\nWrote src/data/movie-links.json');
} else console.log('\nDry run. Pass --write to save src/data/movie-links.json.');
