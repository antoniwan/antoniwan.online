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

## Run it

```bash
pnpm install
pnpm dev
```

`pnpm og` rebuilds `public/og.png` and `public/apple-touch-icon.png` from the portrait (`src/portrait-2026-10.avif`). The social card's URL carries a hash of the file, so link previews refresh after a redraw.
