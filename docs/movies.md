# Movies

Added October 17, 2026.

## Public destinations

- `/collections/movies` contains recent watches and the searchable movie list.
- `/collections/movies.json` contains the same public records and source metadata.
- `/collections` links to Books, Movies, and Games.

The initial list contained 50 dated film watches from Antonio's public Letterboxd feed. As of October 20, 2026, it holds 51.

This list is not a complete viewing history. The feed contains recent activity, not the full diary.

## Storage and refresh

The repository stores the list in `src/data/movies.json`. No database service, account, or API key is required.

Each film has a stable Letterboxd slug and an array of recorded watches. Each watch has its date, source link, personal rating, and rewatch label.

The importer ignores undated list activity. It copies no reviews, descriptions, private records, or aggregate ratings.

At build time, the site merges recent public feed entries with the saved list. It performs no browser-side feed request.

If the feed fails, the site uses the dated saved list. The page identifies that fallback.

A build does not write to the repository. Use the refresh command to retain new entries after they leave the feed.

1. Run `node scripts/sync-movies.ts` to preview changes.
2. Review added and updated films.
3. Run `node scripts/sync-movies.ts --write` to save the merged list.
4. Review `src/data/movies.json`.
5. Run `pnpm check`.
6. Run `pnpm build`.
7. Check recent watches, ratings, filters, and source links.
8. Publish the reviewed changes through GitHub.

For a saved RSS fixture, add `--input <file>` to either refresh command.

The merge retains older saved films and watch records. It replaces matching watch records instead of duplicating them.

A rewatch label does not establish the total number of lifetime watches. The interface reports only recorded watches.

The latest rating filter uses the most recent recorded watch. A missing rating remains unrecorded, not zero.

## Scope

The list replaces the Letterboxd component on Notes' About page. Notes keeps its writing and personal biography.

Old Notes `/about#about-watched-heading` links move to `/collections/movies#latest-watches` in the browser.

The current implementation adds no recurring scheduler. New builds check the feed; persisted history requires the explicit refresh command.

## Search and sharing

The page's `dateModified` is the newest recorded watch in the merged list. The sitemap's `lastmod` reads the saved `movies.json`, so it catches up when you run the refresh with `--write`. Never use `refreshedAt` as a page date: a live build sets it to the build time.

The share card `public/og/movies.png` shows the film count and the newest watch from `movies.json`. Run `pnpm og:collections` after a refresh and commit the card.
