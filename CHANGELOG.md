# Changelog

Notable changes to antoniwan.online. The project uses [Semantic Versioning](https://semver.org/).

## [1.7.0] - 2026-10-07

### Changed

- Pair Chivo headings with IBM Plex Sans body text, monospace details, and electric blue accents on warm cream.
- Add quasicrystal WebGL backgrounds to the header and footer. Limit animation to visible areas and 24 frames per second.
- Add a small amber comet that follows the moving quasicrystal contours and leaves a fading trail.
- Respect reduced motion and data-saving preferences. Provide a static fallback and a persistent animation pause control.
- Keep charcoal dark mode through the device color preference.
- Use one header wordmark and a circular portrait. Remove decorative captions, numbering, and repeated dividers.
- Use consistent essay spacing and typography. Make each essay and resource row a complete link.
- Show arrow indicators on outbound text links only.
- Add CSS illustrations for the picture books and a responsive project grid.
- Keep navigation and social targets at least 44 pixels tall.
- Use two local variable font subsets. Generate responsive AVIF portraits at four widths.
- Add a native Back to top link to every footer.
- Add page descriptions and site references to the structured data.
- Complete social preview metadata and allow large image previews in search results.

### Fixed

- Mark the current navigation link correctly in static builds that use `.html` paths.
- Preserve the refreshed essay layout when the browser loads newer posts.
- Use the correct Open Graph type on each page. Exclude the error page from indexing and structured data.

## [1.6.0] - 2026-10-07

### Added

- Home carries a `WebSite` node (`/#website`): the site's name, "Antonio Rodríguez Martínez", with antoniwan and the unaccented name as alternates. Google can show it above the site's results instead of the bare domain. Its publisher is the Person ID.

## [1.5.0] - 2026-10-07

### Added

- IndexNow: each Vercel production build sends every sitemap URL to IndexNow (Bing and the other IndexNow engines), as Notes does. `src/utils/indexNow.ts` runs after the sitemap is written, only when `VERCEL_ENV` is `production` (or `INDEXNOW_FORCE=1`), and only when the live site already serves the key file `public/ec54ed1f-b3ac-4040-9fe4-0176a9def32b.txt`. It tries `api.indexnow.org`, then `www.bing.com` on a 403. It never fails the build.

## [1.4.1] - 2026-10-07

### Fixed

- Every page's canonical link, `og:url` and `ProfilePage` ID ended in `.html` (`/index.html`, `/about.html`, `/code.html`), an address Vercel redirects. They now match the served URLs (`/`, `/about`, `/code`). The layout strips `.html` and `/index`, because `build.format` is `file`. Found by `~/AI/Work/llms-txt/structured-data.mjs`.

## [1.4.0] - 2026-10-07

### Added

- Structured data names Antonio as one entity that the other sites can point at: the Person has the ID `https://antoniwan.online/#person` (`SITE.personId`).
- The Person lists both spellings of the name (`alternateName`: antoniwan, Antonio Rodriguez Martinez), his home state (Florida) and his birthplace (Puerto Rico). Each place links to its Wikidata entry, so a search engine cannot mistake which Florida or Puerto Rico is meant.
- Home and About are marked as his `ProfilePage`, with the Person as the main entity. Code is not a profile page and carries only the Person.

## [1.3.0] - 2026-10-07

### Changed

- Outbound links open in a new tab. `src/middleware.ts` adds `target="_blank"` and `rel="noopener"` to every link to another site when Astro renders a page, and keeps any `rel` the link already has (such as `me`). The Writing list's browser script does the same for the links it draws. Links within the site and mailto links are unchanged.

## [1.2.0] - 2026-10-07

### Added

- About: an "At work" section on the job at Stanley Black & Decker: product architecture, the platform, design systems, AI prototypes, and people and practice. The areas live in `src/data/work.ts`, and `/llms.txt` lists them too.
- The Writing list on Home refreshes itself. The page fetches `https://notes.antoniwan.online/latest.json` (about 4 KB, Notes 6.31.0) and redraws the list when Notes has published since the last build. The built list stays as the version without JavaScript.

### Changed

- Profiles on Home are icon buttons, not text pills. Each keeps its name for screen readers and as a tooltip. The marks are from Simple Icons (CC0).
- Home: the hero says the job in one line. The Work section comes right after Writing and lists the day job and the company. The separate Consulting link is gone; the hero callout still points there.
- The build reads Notes' small `latest.json`, not the full `feed.json` (over 1 MB).

## [1.1.1] - 2026-10-07

### Changed

- The picture books' source links on the Code page point at Strong-Hands-Soft-Heart, the company's GitHub organization, where their repos moved.

## [1.1.0] - 2026-10-07

### Added

- Vercel Web Analytics through `@vercel/analytics`. The component sits at the end of every page. It counts page views without cookies, and it sends data only while Web Analytics is enabled on the Vercel project.

## [1.0.0] - 2026-10-07

### Added

- The site: Home, About, Code, and a 404 page, in Astro and plain CSS.
- `/llms.txt`, built from the same data as the pages; a sitemap; `robots.txt`.
- A service worker that removes the one the old link page registered.
