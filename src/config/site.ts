/** The facts about this site. Pages and llms.txt read from here; edit here. */
export const SITE = {
  name: 'Antonio Rodríguez Martínez',
  handle: 'antoniwan',
  /** The name as most people type it, without accents. Notes spells it this way. */
  plainName: 'Antonio Rodriguez Martinez',
  /** The portrait's alt text on Home and About. The photo is unedited apart from crop and format. */
  portraitAlt: 'Antonio Rodríguez Martínez, smiling, in glasses and a dark T-shirt, against a gray wall',
  /** The plain portrait, 800×800, for the Person in structured data. Made from src/portrait-2026-10.avif; give a new one a new name. */
  portraitImage: '/portrait-2026-10.jpg',
  /** For the Person in structured data. Each fact is on the site: About, the work areas, and Notes (essays in English and Spanish). */
  languages: ['en', 'es'],
  knowsAbout: ['Technical program management', 'Product architecture', 'Web platforms', 'Design systems', 'AI and automation', 'Prototyping'],
  alumniOf: { name: 'University of Puerto Rico, Río Piedras', wikidata: 'https://www.wikidata.org/wiki/Q7896167' },
  /** The one ID for Antonio in structured data. Notes, the company site and the books point here. */
  personId: 'https://antoniwan.online/#person',
  tagline: 'Builder. Father. Boricua 🇵🇷',
  url: 'https://antoniwan.online',
  /** The wordmark in the header and footer, so a visitor always sees the address. */
  domain: 'antoniwan.online',
  email: 'antonio@builds.software',
  description:
    'Antonio Rodríguez Martínez (antoniwan): technical program manager, maker of two small games and other web things, essayist at Notes, and father. From Puerto Rico, in Florida.',
  notesUrl: 'https://notes.antoniwan.online',
  /** The newest posts, small enough for the browser to fetch. See utils/notes.ts. */
  notesLatest: 'https://notes.antoniwan.online/latest.json',
  /** Antonio's other sites, subdomains included. Links to them carry ?utm_source= with this site's domain (see utils/utm.ts), so their Web Analytics can count the visits that came from here. */
  ownSites: ['antoniwan.online', 'lifesworn.com', 'uplifttowergame.com', 'stronghandssoftheart.com'],
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
  { label: 'Projects', href: '/projects' },
  { label: 'Collections', href: '/collections' },
  { label: 'Notes', href: SITE.notesUrl },
] as const;
