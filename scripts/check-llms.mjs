// Runs after every build (postbuild, on Vercel too). Fails the build when a page in the sitemap has no
// line in /llms.txt, so a new page cannot ship without telling AI agents about it.
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(`../dist/${path}`, import.meta.url), 'utf8');
const pages = [...read('sitemap-0.xml').matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
const llms = read('llms.txt');
const missing = pages.filter((page) => !llms.includes(`](${page})`));
if (missing.length) {
  console.error(`/llms.txt has no line for: ${missing.join(', ')}\nAdd each one to the Site section of src/pages/llms.txt.ts.`);
  process.exit(1);
}
console.log(`/llms.txt lists all ${pages.length} sitemap pages.`);
