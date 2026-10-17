export interface MovieWatch {
  id: string;
  href: string;
  watchedOn: string;
  rating: number | null;
  rewatch: boolean;
}

export interface Movie {
  id: string;
  title: string;
  year: number | null;
  posterUrl: string | null;
  watches: MovieWatch[];
}

export interface MovieSnapshot {
  version: number;
  profileUrl: string;
  rssUrl: string;
  refreshedAt: string | null;
  movies: Movie[];
}

function decodeXml(value: string): string {
  const named: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" };
  return value.replace(/&(#x[\da-f]+|#\d+|amp|lt|gt|quot|apos);/gi, (entity, code: string) => {
    if (!code.startsWith('#')) return named[code.toLowerCase()] ?? entity;
    const point = code[1].toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
    return point > 0 && point <= 0x10ffff && !(point >= 0xd800 && point <= 0xdfff) ? String.fromCodePoint(point) : entity;
  });
}

function tag(block: string, name: string): string {
  const value = block.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${name}>`, 'i'))?.[1] ?? '';
  return decodeXml(value.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim());
}

export function parseMovieFeed(xml: string, profileUrl: string): Movie[] {
  if (!/<rss\b/i.test(xml)) throw new Error('Expected a Letterboxd RSS feed.');
  const profile = new URL(profileUrl);
  const movies: Movie[] = [];
  for (const match of xml.matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/gi)) {
    const block = match[1];
    const watchedOn = tag(block, 'letterboxd:watchedDate');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(watchedOn)) continue;
    const date = new Date(watchedOn + 'T12:00:00Z');
    if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== watchedOn) continue;
    const title = tag(block, 'letterboxd:filmTitle');
    if (!title) continue;
    let href: URL;
    try { href = new URL(tag(block, 'link')); } catch { continue; }
    if (href.protocol !== 'https:' || href.hostname !== 'letterboxd.com' || href.username || href.password || !href.pathname.startsWith(profile.pathname.replace(/\/$/, '') + '/film/')) continue;
    const id = href.pathname.split('/').filter(Boolean)[2];
    if (!id) continue;
    href.search = '';
    href.hash = '';
    const year = Number(tag(block, 'letterboxd:filmYear'));
    const rawRating = tag(block, 'letterboxd:memberRating');
    const rating = Number(rawRating);
    const image = tag(block, 'description').match(/<img\b[^>]*\bsrc=["']([^"']+)["']/i)?.[1];
    let posterUrl: string | null = null;
    if (image) {
      try {
        const poster = new URL(decodeXml(image));
        if (poster.protocol === 'https:' && poster.hostname === 'a.ltrbxd.com' && poster.pathname.startsWith('/resized/')) posterUrl = poster.href;
      } catch {}
    }
    movies.push({ id, title, year: year >= 1800 && year <= 2100 ? year : null, posterUrl, watches: [{ id: tag(block, 'guid') || href.href + ':' + watchedOn, href: href.href, watchedOn, rating: rawRating && rating >= 0 && rating <= 5 && Number.isInteger(rating * 2) ? rating : null, rewatch: tag(block, 'letterboxd:rewatch').toLowerCase() === 'yes' }] });
  }
  if (!movies.length) throw new Error('No dated film watches found. The saved list remains unchanged.');
  return movies;
}

export function mergeMovies(saved: Movie[], incoming: Movie[]): Movie[] {
  const merged = new Map(saved.map(movie => [movie.id, { ...movie, watches: movie.watches.map(watch => ({ ...watch })) }]));
  for (const movie of incoming) {
    const previous = merged.get(movie.id);
    const watches = previous?.watches ?? [];
    for (const watch of movie.watches) {
      const index = watches.findIndex(existing => existing.id === watch.id || (existing.href === watch.href && existing.watchedOn === watch.watchedOn));
      if (index >= 0) watches[index] = { ...watch };
      else watches.push({ ...watch });
    }
    watches.sort((first, second) => second.watchedOn.localeCompare(first.watchedOn) || first.id.localeCompare(second.id));
    merged.set(movie.id, { ...movie, posterUrl: movie.posterUrl ?? previous?.posterUrl ?? null, watches });
  }
  return [...merged.values()].sort((first, second) => first.title.localeCompare(second.title) || first.id.localeCompare(second.id));
}

export function recentWatches(movies: Movie[], limit = 6) {
  return movies.flatMap(movie => movie.watches.map(watch => ({ movie, watch }))).sort((first, second) => second.watch.watchedOn.localeCompare(first.watch.watchedOn) || first.watch.id.localeCompare(second.watch.id)).slice(0, limit);
}

export function watchDate(date: string): string {
  return new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(date + 'T12:00:00Z'));
}

export async function loadMovieCollection(snapshot: MovieSnapshot, fetcher: typeof fetch = fetch) {
  try {
    const response = await fetcher(snapshot.rssUrl, { headers: { Accept: 'application/rss+xml', 'User-Agent': 'AntoniwanCollections/1.0 (+https://antoniwan.online/collections/movies)' }, signal: AbortSignal.timeout(12000) });
    if (!response.ok) throw new Error('HTTP ' + response.status);
    const movies = mergeMovies(snapshot.movies, parseMovieFeed(await response.text(), snapshot.profileUrl));
    return { snapshot: { ...snapshot, refreshedAt: new Date().toISOString(), movies }, source: 'live' as const };
  } catch {
    console.warn('[movies] Letterboxd unavailable. Using the dated saved movie list.');
    return { snapshot, source: 'saved' as const };
  }
}
