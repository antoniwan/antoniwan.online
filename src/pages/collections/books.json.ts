import { books } from '../../data/books';
export function GET() {
  return new Response(JSON.stringify({ version: 1, url: 'https://antoniwan.online/collections/books', count: books.length, books }, null, 2), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
}
