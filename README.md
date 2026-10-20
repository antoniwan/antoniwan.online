# antoniwan.online

The personal site of Antonio Rodríguez Martínez: who he is, how he works, what he builds, and where else he is. It replaced the LinksForest link page and builds.software on October 7, 2026.

- Astro and plain CSS. The client uses no UI framework. Local Chivo headings pair with IBM Plex Sans body text. Monospace details use system fonts.
- Quasicrystal shaders appear behind the header and footer. A thin slice of the same pattern, with one neuron in it, divides the sections (`src/components/Seam.astro`). They pause offscreen, respect reduced motion, and have a footer pause control.
- The layout starts with one column on phones. Wider screens use two columns. The portrait is a circle on Home and a small circle beside the title on About, as responsive AVIF images. Give a new portrait a new file name: image URLs are hashed from the path and size, not the content, and browsers keep them for a year.
- Vercel Web Analytics (`@vercel/analytics`) counts page views without cookies. It sends data only while Web Analytics is enabled on the `antoniwan-online` Vercel project.
- `src/config/site.ts` holds the facts about the site. `src/data/` holds the links, projects, and principles. Edit those, not the pages.
- The latest essays come from `https://notes.antoniwan.online/latest.json` at build time. The home page fetches the same file in the browser and redraws the list if Notes has published since, so the list needs no rebuild.
- `/llms.txt` is generated from the same data as the pages.
- Business goes to [Strong Hands, Soft Heart](https://www.stronghandssoftheart.com). This site has no contact form on purpose.

## Collections

`/collections` holds three personal catalogues. Each has a page, a public JSON copy, and a guide:

| Collection | Page | Data | Source | Guide |
| --- | --- | --- | --- | --- |
| Books | `/collections/books` | `/collections/books.json` | Antonio's book inventory, exported by `scripts/export-books.ts` | [docs/collections.md](docs/collections.md) |
| Movies | `/collections/movies` | `/collections/movies.json` | His public Letterboxd feed, saved by `scripts/sync-movies.ts` | [docs/movies.md](docs/movies.md) |
| Games | `/collections/games` | `/collections/games.json` | His gaming notes, exported by `scripts/export-games.ts`; Wikipedia and Steam links from `scripts/link-games.ts` | [docs/games.md](docs/games.md) |

The site reads only the saved snapshots in `src/data/`. Builds never need the private notes. The export scripts read the files named on their command line and never write to them.

Cookbook has its own entry in Projects. Authored picture books remain in Projects, not the reading library.

## Search and sharing

- `src/layouts/Base.astro` writes one JSON-LD graph per page: the WebSite (on Home), the page itself, a BreadcrumbList where the page has a parent, and the Person. Collection pages and Projects add an `ItemList` of their entries: books, films, games (with Wikipedia, Steam, and Wikidata links), and the things Antonio made.
- Collection pages carry `dateModified` from their own data, and the sitemap gives them the same `lastmod`. Pages without a real date get none.
- Books, Movies, and Games have their own share cards in `public/og/`. Every other page uses the portrait card.
- `/llms.txt` is generated from the same data as the pages. After every build, `scripts/check-llms.mjs` fails the build if a sitemap page has no line there.
- Vercel production builds ping IndexNow with every sitemap page (`src/utils/indexNow.ts`). The ping never fails the build.

## Run it

```bash
pnpm install
pnpm dev
```

`pnpm check` type-checks. `pnpm build` builds to `dist/` and then runs the `/llms.txt` check.

`pnpm og` rebuilds `public/og.png` and `public/apple-touch-icon.png` from the portrait (`src/portrait-2026-10.avif`). The social card's URL carries a hash of the file, so link previews refresh after a redraw. This script still assumes macOS paths and Chrome at the macOS location; on Windows it needs fixing before it will run.

`pnpm og:collections` rebuilds the share cards for the three collection pages (`public/og/books.png`, `movies.png`, `games.png`). Each one draws a frozen frame of the site's quasicrystal pattern behind the page title and a stat line computed from `src/data/*.json`, so rerun it and commit the PNGs after the books, movies, or games data changes. It finds Chrome or Edge on Windows and Chrome on macOS; set `CHROME` to the browser binary if it does not.

Agents: read [AGENTS.md](AGENTS.md) for what to keep in step when the site changes.
