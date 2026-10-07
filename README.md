# antoniwan.online

The personal site of Antonio Rodríguez Martínez: who he is, how he works, what he builds, and where else he is. It replaced the LinksForest link page and builds.software on October 7, 2026.

- Astro, plain CSS, no framework on the client. One font file family (Fraunces) for headings; the system stack for text.
- Vercel Web Analytics (`@vercel/analytics`) counts page views without cookies. It sends data only while Web Analytics is enabled on the `antoniwan-online` Vercel project.
- `src/config/site.ts` holds the facts about the site. `src/data/` holds the links, projects, and principles. Edit those, not the pages.
- The latest essays come from `https://notes.antoniwan.online/feed.json` at build time.
- `/llms.txt` is generated from the same data as the pages.
- Business goes to [Strong Hands, Soft Heart](https://www.stronghandssoftheart.com). This site has no contact form on purpose.

## Run it

```bash
pnpm install
pnpm dev
```

`pnpm og` rebuilds `public/og.png` and `public/apple-touch-icon.png` from the profile picture.
