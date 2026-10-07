/** The facts about this site. Pages and llms.txt read from here; edit here. */
export const SITE = {
  name: 'Antonio Rodríguez Martínez',
  handle: 'antoniwan',
  tagline: 'Builder. Father. Boricua 🇵🇷',
  url: 'https://antoniwan.online',
  email: 'antonio@builds.software',
  description:
    'Antonio Rodríguez Martínez (antoniwan): technical program manager, builder of small web things, essayist at Notes, and father. From Puerto Rico, in Florida.',
  notesUrl: 'https://notes.antoniwan.online',
  /** The newest posts, small enough for the browser to fetch. See utils/notes.ts. */
  notesLatest: 'https://notes.antoniwan.online/latest.json',
  repo: 'https://github.com/antoniwan/antoniwan.online',
  company: {
    name: 'Strong Hands, Soft Heart',
    url: 'https://www.stronghandssoftheart.com',
    consultingUrl: 'https://www.stronghandssoftheart.com/consulting',
    llmsUrl: 'https://www.stronghandssoftheart.com/llms.txt',
  },
} as const;

export const NAV = [
  { label: 'About', href: '/about' },
  { label: 'Code', href: '/code' },
  { label: 'Notes', href: SITE.notesUrl },
] as const;
