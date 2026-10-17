import snapshot from './books.json';

export const books = snapshot;
export const readingStatusLabels: Record<string, string> = { reading: 'Reading', read: 'Read', 'to-read': 'To read', abandoned: 'Abandoned', unknown: 'Not recorded' };
