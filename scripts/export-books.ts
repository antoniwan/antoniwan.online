// TypeScript creates a selected public book snapshot from Markdown with Node's standard library.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const selection = JSON.parse(readFileSync(new URL('../src/data/book-selection.json', import.meta.url), 'utf8')) as { title: string; author: string; subjects: string[]; aliases: string[]; statusResolution?: string }[];
const inventoryIndex = process.argv.indexOf('--inventory');
if (inventoryIndex === -1 || !process.argv[inventoryIndex + 1]) throw new Error('Provide --inventory with the local Book Library Inventory Markdown path.');
const inventory = readFileSync(process.argv[inventoryIndex + 1], 'utf8');
const normalize = (value: string) => value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const statuses: Record<string, string> = { 'Currently Reading': 'reading', Abandoned: 'abandoned', Read: 'read', 'To Read': 'to-read' };
const found = new Map<string, Set<string>>();
let status: string | undefined;
for (const line of inventory.split('\n')) {
  const heading = line.match(/^### (.+)$/);
  if (heading) status = statuses[heading[1].trim()];
  if (line.startsWith('## ') && !line.startsWith('### ')) status = undefined;
  if (!status) continue;
  const title = line.startsWith('|') ? line.split('|')[1]?.trim() : line.match(/^- (.+)$/)?.[1].split(' - ')[0].replace(/\s*⭐.*$/, '').trim();
  if (!title) continue;
  const normalized = normalize(title);
  for (const book of selection) {
    const matches = [book.title, ...book.aliases].some(candidate => normalized === normalize(candidate));
    if (!matches) continue;
    const values = found.get(book.title) ?? new Set<string>();
    values.add(status);
    found.set(book.title, values);
  }
}
const books = selection.map(book => {
  const values = found.get(book.title);
  if (!values?.size) throw new Error('Selected public title not found in inventory: ' + book.title);
  if (values.size > 1 && (!book.statusResolution || !values.has(book.statusResolution))) throw new Error('Resolve conflicting reading statuses: ' + book.title);
  const readingStatus = values.size === 1 ? [...values][0] : book.statusResolution!;
  return { id: normalize(book.title + ' ' + book.author).replace(/ /g, '-'), title: book.title, author: book.author, subjects: book.subjects, readingStatus, ownership: 'unknown', referenceUse: null };
});
if (new Set(books.map(book => book.id)).size !== books.length) throw new Error('Duplicate public book identifiers.');
const output = new URL('../src/data/books.json', import.meta.url);
const previous = existsSync(output) ? JSON.parse(readFileSync(output, 'utf8')) : [];
const before = new Map(previous.map((book: { id: string }) => [book.id, book]));
const after = new Map(books.map(book => [book.id, book]));
const changes = { added: books.filter(book => !before.has(book.id)).map(book => book.title), changed: books.filter(book => before.has(book.id) && JSON.stringify(before.get(book.id)) !== JSON.stringify(book)).map(book => book.title), removed: previous.filter((book: { id: string }) => !after.has(book.id)).map((book: { title: string }) => book.title) };
if (process.argv.includes('--json')) console.log(JSON.stringify(books, null, 2));
else console.log(JSON.stringify({ count: books.length, ...changes }, null, 2));
if (process.argv.includes('--write')) writeFileSync(output, JSON.stringify(books, null, 2) + '\n');
