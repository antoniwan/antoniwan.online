export interface Project {
  title: string;
  href: string;
  repo?: string;
  body: string;
  stack: string;
}

/** My own things that I still run. Work I built and handed over to others is in workForOthers. */
export const projects: Project[] = [
  {
    title: 'Notes',
    href: 'https://notes.antoniwan.online',
    repo: 'https://github.com/antoniwan/notes',
    body: 'My writing site. Essays in English and Spanish, household recipes, and a markdown copy of every post for people and agents. It also charts my own writing: how often I post and what about.',
    stack: 'Astro, TypeScript',
  },
  {
    title: 'Strong Hands, Soft Heart',
    href: 'https://www.stronghandssoftheart.com',
    repo: 'https://github.com/Strong-Hands-Soft-Heart/stronghandssoftheart.com',
    body: "My company's site, built from its own design system. The moving background is drawn from the company's mark.",
    stack: 'Astro, WebGL',
  },
  {
    title: 'Skincare for You',
    href: 'https://skincare.builds.software',
    repo: 'https://github.com/antoniwan/skin-care-for-me-webapp',
    body: "A phone-first app for a skincare routine: your products, morning and evening steps, and a warning when two ingredients don't mix. Spanish first, English too. Your shelf stays in your browser. Early: version 0.1.",
    stack: 'Next.js, React',
  },
  {
    title: 'Panda and Wolf',
    href: 'https://notes.antoniwan.online/p/panda-and-wolf',
    body: 'Two Obsidian vaults kept by agent skills I write from scratch. One rule sits under both: honesty. The vaults are private; the essay explains the system.',
    stack: 'Markdown, agent skills',
  },
  {
    title: 'Mia, the Sun, and the Moon',
    href: 'https://mia-the-sun-and-the-moon-web-book.stronghandssoftheart.com',
    repo: 'https://github.com/Strong-Hands-Soft-Heart/book-sun-and-moon',
    body: 'A bilingual picture book as a web app, written for my daughter and my nephew. Published by Strong Hands, Soft Heart.',
    stack: 'React, Vite',
  },
  {
    title: 'The Bent One',
    href: 'https://the-bent-one-book.stronghandssoftheart.com',
    repo: 'https://github.com/Strong-Hands-Soft-Heart/the-bent-one',
    body: 'A bilingual picture book with animated spreads. Published by Strong Hands, Soft Heart.',
    stack: 'Vite',
  },
  {
    title: 'LinksForest',
    href: 'https://links-forest-phi.vercel.app',
    repo: 'https://github.com/antoniwan/links-forest',
    body: 'A themed link page you can make your own. Fork it, edit one file, ship it. It ran this domain until October 2026.',
    stack: 'Astro',
  },
  {
    title: 'antoniwan.online',
    href: '/',
    repo: 'https://github.com/antoniwan/antoniwan.online',
    body: 'This site, since October 7, 2026. Before it came arod.us in 2022, builds.software in 2025, and a link page on this domain: many names and ideas. This is the one I enjoy, and it keeps changing.',
    stack: 'Astro, plain CSS',
  },
];

export interface WorkPart {
  name: string;
  text: string;
  /** Set for a name in Spanish, so screen readers pronounce it right. */
  lang?: 'es';
  unfinished?: boolean;
}

export interface WorkEntry {
  title: string;
  /** Years, then the main tool, when known. */
  when?: string;
  body: string;
  parts?: WorkPart[];
}

export interface WorkGroup {
  name: string;
  entries: WorkEntry[];
}

/**
 * Work I built for other people and handed over: text only, no links, at a high level.
 * Never name a client, a friend or their business without their permission.
 */
export const workForOthers: WorkGroup[] = [
  {
    name: 'Employers',
    entries: [
      {
        title: 'Stanley Black & Decker',
        when: '2021 to now',
        body: "With SBD Digital, the team behind the brands' websites and apps.",
        parts: [
          {
            name: 'Web platform',
            text: "The brands' websites moved from slow PHP to a fast Next.js platform, with services every brand shares: product search, product registration, and user profiles. I shepherded the move.",
          },
          {
            name: 'AI innovation',
            text: "I'm the product owner for our AI innovation group: prototypes, many of them AI-powered, that test an idea before a team commits to building it.",
          },
          { name: 'Product design', text: "I'm the main technical voice in our product design group." },
          {
            name: 'Plans and boards',
            text: "For all of these, I'm a lead contributor to our Confluence wiki and Jira boards, where the plans, specs, and work live.",
          },
        ],
      },
      {
        title: 'University of Puerto Rico, Río Piedras',
        body: 'I built all of this as a work-study student in DTAA, the campus IT division, while I was still figuring out how to be a college student.',
        parts: [
          { name: 'The campus website', text: 'The website of the Río Piedras campus.' },
          { name: 'MiUPI', text: "The original version of the campus's online portal." },
          { name: 'Consulta al Estudiante', lang: 'es', text: 'The online student consultation from the big strike.' },
          {
            name: 'Transcript checker',
            text: 'It would read your transcript and recommend a path to finish your degree. I was building it when I left DTAA and never finished it; it was hard.',
            unfinished: true,
          },
        ],
      },
    ],
  },
  {
    name: 'Clients',
    entries: [
      {
        title: "A lawyer's website",
        when: '2024 · WordPress',
        body: 'A freelance website for a lawyer. I built it on WordPress and learned a lot about WordPress doing it.',
      },
    ],
  },
  {
    name: 'Friends, family and neighbors',
    entries: [
      {
        title: "My neighbors' gift shop",
        when: '2022 · Shopify',
        body: 'SEO for their Shopify store, for fun, to help out. I set up the sitemap and Search Console and planned the rest.',
      },
      {
        title: 'Favors',
        when: '2018 to 2020',
        body: 'Small sites for friends and family. One was for the first hire at my first agency, a designer and real estate developer.',
      },
    ],
  },
];
