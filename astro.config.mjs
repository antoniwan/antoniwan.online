// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { indexNow } from './src/utils/indexNow';
import { collectionsModified, gamesModified, moviesModified } from './src/utils/lastmod';

// Real content dates only. Pages without one (Home, About, Projects, Books) get no lastmod, never the build time.
/** @type {Record<string, string | undefined>} */
const lastmods = { '/collections': collectionsModified(), '/collections/games': gamesModified, '/collections/movies': moviesModified() };

export default defineConfig({
  site: 'https://antoniwan.online',
  trailingSlash: 'never',
  build: { format: 'file' },
  integrations: [sitemap({
      filter: (page) => !page.endsWith('/404'),
      serialize: (item) => { const lastmod = lastmods[new URL(item.url).pathname.replace(/(.)\/$/, '$1')]; return lastmod ? { ...item, lastmod } : item; },
    }), indexNow()],
});
