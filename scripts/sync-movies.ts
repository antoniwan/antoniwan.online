// TypeScript refreshes the public movie list with Node's standard library and shared web data rules.
import { readFileSync, writeFileSync } from 'node:fs';
import { mergeMovies, parseMovieFeed, type MovieSnapshot } from '../src/utils/movies.ts';

const destination = new URL('../src/data/movies.json', import.meta.url);
const saved = JSON.parse(readFileSync(destination, 'utf8')) as MovieSnapshot;
const inputIndex = process.argv.indexOf('--input');
let xml: string;
if (inputIndex >= 0) {
  if (!process.argv[inputIndex + 1]) throw new Error('Provide the RSS file after --input.');
  xml = readFileSync(process.argv[inputIndex + 1], 'utf8');
} else {
  const response = await fetch(saved.rssUrl, { headers: { Accept: 'application/rss+xml', 'User-Agent': 'AntoniwanCollections/1.0 (+https://antoniwan.online/collections/movies)' }, signal: AbortSignal.timeout(12000) });
  if (!response.ok) throw new Error('Letterboxd returned HTTP ' + response.status + '. The saved list remains unchanged.');
  xml = await response.text();
}
const movies = mergeMovies(saved.movies, parseMovieFeed(xml, saved.profileUrl));
const previous = new Map(saved.movies.map(movie => [movie.id, movie]));
console.log(JSON.stringify({ movies: movies.length, watches: movies.reduce((total, movie) => total + movie.watches.length, 0), added: movies.filter(movie => !previous.has(movie.id)).map(movie => movie.title), updated: movies.filter(movie => previous.has(movie.id) && JSON.stringify(previous.get(movie.id)) !== JSON.stringify(movie)).map(movie => movie.title), removed: [] }, null, 2));
if (process.argv.includes('--write')) writeFileSync(destination, JSON.stringify({ ...saved, refreshedAt: new Date().toISOString(), movies }, null, 2) + '\n');
