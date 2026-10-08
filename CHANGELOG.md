# Changelog

Notable changes to antoniwan.online. The project uses [Semantic Versioning](https://semver.org/).

## [1.11.1] - 2026-10-08

### Fixed

- Show the new portrait to visitors who had the old one cached. Astro names image files from the source's path and size, not its content, so the new photo kept the old URLs, which browsers keep for a year. The source is now `src/portrait-2026-10.avif`; a new portrait gets a new name.
- Add a short hash of `og.png` to its URL in the social and structured-data tags, so link previews fetch the redrawn card.

### Removed

- Remove the photo from About. The portrait stays on Home.

## [1.11.0] - 2026-10-08

### Changed

- Make strawberry the site's color: the macOS crayon #ff2f92. It colors the shader pattern, text selection and the favicon.
- Give the main button white text on #df047b, the brightest strawberry of the same hue that keeps 4.5:1 with white. The greeting uses the same color in light mode. Links and labels use a deeper strawberry (#c7006f light, #ff5ca8 dark) that keeps 4.5:1 on the paper.
- Put the header wordmark and links on paper-colored pills, so the moving pattern never sits directly behind them.
- Draw every neuron with a solid black head and a golden trail. In dark mode the head is white and the trail golden-white.
- Raise contrast: near-white paper (#fdfcfa) and near-black ink (#101216) in light mode; a darker paper (#0f1013) and brighter text in dark mode.
- Redraw `og.png` and the Apple touch icon in the new colors.
- New portrait, unedited apart from crop and format. The AVIF source carries no camera or location data.
- Describe the portrait in its alt text on Home and About (`SITE.portraitAlt`).

### Added

- Show the whole photo on About: square with soft corners beside "Who I am", and under the introduction on phones.

## [1.10.0] - 2026-10-08

### Added

- Divide the sections with a seam: a thin slice of the header's pattern at the header's scale, faded at both ends, with one neuron in it. Consecutive seams take turns with amber, teal, and violet.
- Without WebGL, with reduced motion, or with Data Saver, each seam shows a faded hairline.

### Changed

- Greet visitors on the home page: "Hi! I'm" above the name. The introduction now starts "On most of the internet I'm antoniwan."
- Say "a member of SBD Digital" instead of "a founding member" on About and in llms.txt.
- Say "I shepherded the move" instead of "I led the move" in the platform work.
- Rename the company's GitHub link to "Company GitHub".

## [1.9.0] - 2026-10-08

### Added

- Add amber, teal, and violet neuron bursts in three separate areas of each backdrop.
- Stagger the bursts and vary their speeds. Adapt each color to light and dark mode.

### Changed

- Draw all signal trails in small areas. Keep one canvas per backdrop and the existing motion controls.

## [1.8.1] - 2026-10-08

### Fixed

- Restart the seed on a visible contour when its moving curve carries it toward the edge. Fade between seed positions.
- Add a small glow and stronger trails. Start the first burst sooner and keep pulses visible longer.

## [1.8.0] - 2026-10-08

### Added

- The amber pixel sends brief pulses in both directions along the quasicrystal curves. Each pulse leaves a fading trail.
- Keep a quiet interval between bursts. Reuse the existing canvas and restrict extra drawing to each pulse's small area.

### Fixed

- Keep a separate animation clock for each backdrop. The comet resumes smoothly when its backdrop returns onscreen.
- Match the contour calculation to the displayed canvas size when the drawing buffer is scaled down.

## [1.7.4] - 2026-10-07

### Changed

- Redraw the social preview image (`og.png`) in the refreshed design: the antoniwan.online wordmark, the name in Chivo, the tagline in IBM Plex Sans, and the circular portrait on warm cream.
- `pnpm og` draws the card with headless Chrome, because sharp cannot load the site's WOFF2 fonts. The script stops Chrome after the screenshot is written, because Chrome does not always exit on macOS. Set `CHROME` if the browser is not at the usual macOS path.
- Describe the portrait and the address in the preview image's alt text.

## [1.7.3] - 2026-10-07

### Removed

- Remove the tagline from the home hero. The introduction below it already says builder, father and Boricua. The tagline stays in llms.txt.

## [1.7.2] - 2026-10-07

### Changed

- Replace the favicon with a cream "a" on an electric blue tile, to match the refreshed design. The letter is drawn as shapes, so it does not depend on a font.
- Make the Apple touch icon a full square at 180 pixels. iOS rounds the corners itself.

## [1.7.1] - 2026-10-07

### Changed

- Show the address antoniwan.online as the header and footer wordmark, so visitors see the domain they typed. On screens narrower than 24rem, the header shows antoniwan only.

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
