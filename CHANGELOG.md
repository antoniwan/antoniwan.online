# Changelog

Notable changes to antoniwan.online. The project uses [Semantic Versioning](https://semver.org/).

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
