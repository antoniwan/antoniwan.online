# antoniwan.online — agent guide

Antonio's personal site. Astro and plain CSS, pnpm, Node 24, deployed by Vercel from `main`. Read `README.md` first. This file says what to keep in step when you change the site.

This repository is public. Anything you commit is published.

## Where things live

- `src/config/site.ts`: facts about the site and Antonio. `src/data/`: links, projects, principles, and the collection snapshots. Edit data, not pages.
- `src/layouts/Base.astro`: every page's head, Open Graph tags, and the shared JSON-LD graph (WebSite, page node, BreadcrumbList, Person).
- `src/pages/llms.txt.ts`: `/llms.txt`, built from the same data as the pages.
- `docs/`: one guide per collection (`collections.md` for Books, `movies.md`, `games.md`), and `analytics.md` for Vercel Web Analytics and Umami.
- `scripts/`: data exports, the Wikidata link matchers (`link-books`, `link-movies`, `link-games`), share-card drawing, and the `/llms.txt` check. After a snapshot refresh adds entries, run the matching `link-*` script.

## When you change the site

Go through this list before you call a change done.

1. **`/llms.txt`.** A new or renamed page needs its line in the Site section of `src/pages/llms.txt.ts`. Counts and project lists come from data; prose lines do not. `pnpm build` runs `scripts/check-llms.mjs` afterwards and fails when a sitemap page has no line, but it cannot tell when a line's description has gone stale. Read the built `dist/llms.txt` and fix what no longer matches.
2. **Structured data.** A new page passes `title`, `description`, and, where they apply, `collection`, `mainEntity`, `breadcrumbs`, `dateModified`, and `card` to `Base`. Use real dates only (see `src/utils/lastmod.ts`). Never stamp build time. Collection lists add their own `ItemList` script.
3. **Sitemap.** `astro.config.mjs` sets `lastmod` for pages with a real data date. Add a new dated page there.
4. **Share cards.** After the books, movies, or games data changes, run `pnpm og:collections` and commit the PNGs. A new collection gets a card in `scripts/build-og-collections.mjs`.
5. **Docs.** Update `README.md` and the matching guide in `docs/`. Numbers in docs are dated snapshots. Say "as of" or update them.
6. **Changelog and version.** Add a newest-first entry to `CHANGELOG.md` and bump `package.json`, Semantic Versioning, in the voice of the entries already there.
7. **Verify.** `pnpm check` and `pnpm build` both pass. Look at the page on a phone width and in both themes.

## Private sources

Books and Games are exported from Antonio's personal notes by scripts that take file paths as arguments. The scripts read only an allowlist of sections and never write to the notes. Before you commit an export, read the JSON diff. Commit no quotes, notes, account names, local paths, or ratings from the notes. (Movie ratings come from the public Letterboxd feed.) `docs/collections.md` and `docs/games.md` list what may be public.

## Release

Work on a branch. Antonio reviews and says when to ship. Then fast-forward `main` and push; Vercel deploys `main`.
