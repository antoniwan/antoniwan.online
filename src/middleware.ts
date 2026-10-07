import { defineMiddleware } from 'astro:middleware';
import { SITE } from './config/site';

const ownHost = new URL(SITE.url).host;

/**
 * Outbound links open in a new tab. Astro runs this on every page at build time
 * (and in dev), so each <a> that points at another site gets target="_blank"
 * and rel="noopener", next to any rel it already has (such as "me"). Links on
 * this site, mailto links, and links that set their own target stay as written.
 * NoteList's browser script does the same for the links it draws.
 */
export const onRequest = defineMiddleware(async (_context, next) => {
  const response = await next();
  if (!response.headers.get('content-type')?.includes('text/html')) return response;

  const html = (await response.text()).replace(/<a\b([^>]*)>/g, (tag, attrs: string) => {
    const href = attrs.match(/\shref="(https?:\/\/[^"]+)"/)?.[1];
    if (!href || new URL(href).host === ownHost || /\starget=/.test(attrs)) return tag;
    const withRel = /\srel="/.test(attrs)
      ? attrs.replace(/\srel="([^"]*)"/, ' rel="$1 noopener"')
      : `${attrs} rel="noopener"`;
    return `<a${withRel} target="_blank">`;
  });

  return new Response(html, response);
});
