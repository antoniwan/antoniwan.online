/**
 * Umami's click event for a call to action: the event is "cta", with `label`
 * naming the button. Spread it onto the element: <a {...cta('every-post')}>.
 * On a link to another site the middleware adds `to` and `url`, so the click
 * still counts as a click out (it then skips the "outbound" event).
 * Tasteless lists every label beside its page's views, so unused ones show.
 */
export function cta(label: string): Record<string, string> {
  return { 'data-umami-event': 'cta', 'data-umami-event-label': label };
}
