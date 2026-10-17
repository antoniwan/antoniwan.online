import saved from './movies.json';
import { loadMovieCollection, type MovieSnapshot } from '../utils/movies';

let pending: Promise<{ snapshot: MovieSnapshot; source: 'live' | 'saved' }> | undefined;

export function getMovieCollection() {
  pending ??= loadMovieCollection(saved as MovieSnapshot);
  return pending;
}
