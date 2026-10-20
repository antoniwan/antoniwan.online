import games from '../data/games.json';
import saved from '../data/movies.json';

// Real content dates for the collection pages. Shared by the pages' dateModified and the sitemap's lastmod.
// Books carry no date in their data, so they have none.
type Watched = { watches: { watchedOn: string }[] }[];
/** Newest watch date in the diary: a real date from the content, not a fetch time. */
export const moviesModified = (movies: Watched = saved.movies) => movies.flatMap(movie => movie.watches.map(watch => watch.watchedOn)).sort().pop();
export const gamesModified = games.exportedAt;
/** Newest of the dated collections, for the /collections index. */
export const collectionsModified = (movies?: Watched) => [gamesModified, moviesModified(movies)].filter((date): date is string => Boolean(date)).sort().pop();
