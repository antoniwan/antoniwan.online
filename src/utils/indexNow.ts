/**
 * IndexNow: when a production deploy builds, tell Bing and the other IndexNow
 * engines about every page in the sitemap. Same approach as Notes
 * (src/utils/indexNow.ts in antoniwan/notes), in fewer lines.
 *
 * The key file public/<KEY>.txt proves the site is ours; it is public by design.
 * The ping runs only on Vercel production builds (or with INDEXNOW_FORCE=1), and
 * only when the live site already serves the key file. It never fails the build.
 * @see https://www.indexnow.org/documentation
 */
import fs from 'node:fs';
import type { AstroIntegration } from 'astro';

const KEY = 'ec54ed1f-b3ac-4040-9fe4-0176a9def32b';
const ENDPOINTS = ['https://api.indexnow.org/indexnow', 'https://www.bing.com/indexnow'];
const TIMEOUT_MS = 12_000;

export function indexNow(): AstroIntegration {
  let site = '';
  return {
    name: 'indexnow',
    hooks: {
      'astro:config:done': ({ config }) => {
        site = config.site ?? '';
      },
      'astro:build:done': async ({ dir, logger }) => {
        if (process.env.INDEXNOW_FORCE !== '1' && process.env.VERCEL_ENV !== 'production') {
          logger.info('skipped (not a production build)');
          return;
        }
        try {
          const keyLocation = new URL(`/${KEY}.txt`, site).href;
          const signal = AbortSignal.timeout(TIMEOUT_MS);
          const live = await fetch(keyLocation, { signal })
            .then((res) => (res.ok ? res.text() : ''))
            .catch(() => '');
          if (live.trim() !== KEY) {
            logger.info('skipped (the live site does not serve the key file yet)');
            return;
          }
          const xml = fs
            .readdirSync(dir)
            .filter((name) => /^sitemap-\d+\.xml$/.test(name))
            .map((name) => fs.readFileSync(new URL(name, dir), 'utf8'))
            .join('');
          const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
          if (urlList.length === 0) {
            logger.warn('skipped (no URLs in the sitemap)');
            return;
          }
          const body = JSON.stringify({ host: new URL(site).host, key: KEY, keyLocation, urlList });
          for (const endpoint of ENDPOINTS) {
            const res = await fetch(endpoint, {
              method: 'POST',
              headers: { 'content-type': 'application/json; charset=utf-8' },
              body,
              signal,
            });
            if (res.status === 200 || res.status === 202) {
              logger.info(`submitted ${urlList.length} URLs to ${new URL(endpoint).host} (${res.status})`);
              return;
            }
            // 403: the shared endpoint could not verify the key yet; Bing directly often can.
            if (res.status !== 403) {
              logger.warn(`failed (${res.status} from ${new URL(endpoint).host})`);
              return;
            }
          }
          logger.warn('failed (403 from both endpoints)');
        } catch (error) {
          logger.warn(`failed: ${error instanceof Error ? error.message : String(error)}`);
        }
      },
    },
  };
}
