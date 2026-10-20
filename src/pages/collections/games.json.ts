import { games } from '../../data/games';
export function GET() {
  return new Response(JSON.stringify({ version: 1, url: 'https://antoniwan.online/collections/games', count: games.games.length, ...games }, null, 2), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
}
