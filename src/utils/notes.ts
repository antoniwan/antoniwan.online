import { SITE } from '../config/site';

export interface Note {
  title: string;
  url: string;
  date: Date;
  summary: string;
}

/**
 * The latest essays from Notes' small JSON Feed, read at build time. The home
 * page fetches the same file again in the browser, so a new essay shows up
 * without a rebuild of this site. If the feed cannot be read at build time, the
 * page shows a link to Notes instead of a list.
 */
export async function latestNotes(count: number): Promise<Note[]> {
  try {
    const response = await fetch(SITE.notesLatest);
    if (!response.ok) return [];
    const feed = (await response.json()) as {
      items: { title: string; url: string; date_published: string; summary?: string }[];
    };
    return feed.items.slice(0, count).map((item) => ({
      title: item.title,
      url: item.url,
      date: new Date(item.date_published),
      summary: item.summary ?? '',
    }));
  } catch {
    return [];
  }
}

export const formatDate = (date: Date) =>
  date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });
