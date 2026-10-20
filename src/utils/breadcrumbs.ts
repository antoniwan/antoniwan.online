export interface Crumb { name: string; href: string }

/** The trail Home › parent › page. PageIntro's visible breadcrumb takes the same `parent`, so the two can't drift. */
export const breadcrumbs = (label: string, href: string, parent?: { label: string; href: string }): Crumb[] => [
  { name: 'Home', href: '/' },
  ...(parent ? [{ name: parent.label, href: parent.href }] : []),
  { name: label, href },
];
