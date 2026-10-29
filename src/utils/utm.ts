import { SITE } from '../config/site';

const ownHost = new URL(SITE.url).host;

/** True for a page on one of Antonio's other sites (not this one), where Web Analytics can read the tag. */
export function isOwnSite(url: URL): boolean {
  if (url.host === ownHost || /\.(txt|json|xml)$/.test(url.pathname)) return false;
  return SITE.ownSites.some((site) => url.hostname === site || url.hostname.endsWith(`.${site}`));
}

/**
 * Adds utm_source=antoniwan.online to a link to Antonio's other sites, so their
 * analytics show the visit came from here. Other links, files such as llms.txt,
 * and links that already name a source come back as they were.
 */
export function withUtm(href: string): string {
  const url = new URL(href);
  if (!isOwnSite(url) || url.searchParams.has('utm_source')) return href;
  url.searchParams.set('utm_source', SITE.domain);
  return url.toString();
}
