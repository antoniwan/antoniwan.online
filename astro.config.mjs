// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { indexNow } from './src/utils/indexNow';

export default defineConfig({
  site: 'https://antoniwan.online',
  trailingSlash: 'never',
  build: { format: 'file' },
  integrations: [sitemap({ filter: (page) => !page.endsWith('/404') }), indexNow()],
});
