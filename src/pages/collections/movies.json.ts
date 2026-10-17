import { getMovieCollection } from '../../data/movies';

export async function GET() {
  const { snapshot, source } = await getMovieCollection();
  return new Response(JSON.stringify({ ...snapshot, source, url: 'https://antoniwan.online/collections/movies', count: snapshot.movies.length }, null, 2), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
}
