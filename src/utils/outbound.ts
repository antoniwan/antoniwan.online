/**
 * Umami's click event for a link to another site: the event is "outbound", with
 * `to` (the host) and `url` (the address without its query, so the utm tag and
 * any tracking junk on someone else's link stay out of the reports). Returned as
 * attributes to append to an <a>.
 */
export function outboundEvent(href: string): string {
  const url = new URL(href);
  const escape = (value: string) => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;');
  return ` data-umami-event="outbound" data-umami-event-to="${escape(url.hostname)}" data-umami-event-url="${escape(url.origin + url.pathname)}"`;
}
