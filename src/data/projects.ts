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
  /** Left out for side projects, which are described, never named. */
  name?: string;
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
 * Work I built for other people and handed over, then my own side projects ("Nerd projects", described, never named).
 * Text only, no links, at a high level. Never name a client, a friend or their business without their permission.
 */
export const workForOthers: WorkGroup[] = [
  {
    name: 'Jobs',
    entries: [
      {
        title: 'Stanley Black & Decker',
        when: '2021 to now',
        body: "I've been part of the brands' web platform from the original PHP sites to today's Next.js platform and the services every brand shares, like product search and registration. I also support our AI innovation group as its product owner, and our product design group as one of its technical people.",
      },
      {
        title: 'Agencies and startups',
        when: '2008 to 2021',
        body: "I co-founded a web shop in college, Kolapse Interactive. Nobox, a South Florida marketing agency, bought it to bring our team on board, and we all moved to Miami and lived together for months; it was so much fun. I became a partner there, then director of technology at M8, then CTO of a startup, CarBuckets. The agencies bought ads at scale and we built the tech around them, including apps used by millions for Sony, PlayStation, Mozilla, Marriott, and Copa Airlines. I pitched, sold add-ons, taught our sales team the tech, went to F8, Facebook's developer conference, and worked on the technology side of both agencies when they were sold. At M8, moving to static sites cut operating costs by about 80%.",
      },
      {
        title: 'University of Puerto Rico, Río Piedras',
        when: '2004 to 2010',
        body: 'I did all of this as a work-study student in DTAA, the campus IT division, while I was still figuring out how to be a college student.',
        parts: [
          { name: 'The campus website', text: 'A WordPress site that others built. I mostly added to it.' },
          { name: 'MiUPI', text: "The original version of the campus's online portal." },
          { name: 'Consulta al Estudiante', lang: 'es', text: 'The online student consultation from the big strike.' },
          { name: 'Crime Log', text: "The campus's crime log, online." },
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
    name: 'Freelance',
    entries: [
      {
        title: 'Selling my brain',
        when: 'On the side',
        body: 'Freelance work for extra income and to learn new things. I called it selling my brain: websites (WordPress among them), applications, wired networks (I ran the Cat5e cable and set up the routers), and even a digital signage project. Whatever landed, for fun or for learning.',
      },
    ],
  },
  {
    name: 'Friends, family and neighbors',
    entries: [
      {
        title: 'Favors',
        when: 'Over the years',
        body: 'Small sites, front ends, and SEO help for friends, family, neighbors, and their small businesses, for fun or to help out. One site was for the first hire at my first agency, a designer and real estate developer.',
      },
    ],
  },
  {
    name: 'Nerd projects',
    entries: [
      {
        title: 'Experiments and demos',
        when: '2022 to now',
        body: 'Built for fun or to learn. Most I stopped, or replaced with the next one.',
        parts: [
          { text: 'An agent that files my day into my notes every night.' },
          { text: 'A start page and music tools that run on my own Mac (Python).' },
          { text: 'A private app for my daughter and me to share messages and drawings (React Native).' },
          { text: 'A network of absurd niche sites on shared code (Astro).' },
          { text: 'A library of AI prompts, replaced by agent skills.' },
          { text: 'A lab for custom React hooks.' },
          { text: 'A tool that turned my ChatGPT history into a searchable database (Go).' },
          { text: 'A countdown to the end of the workday.' },
          { text: 'A self-hosted archive for my guitar riffs and beats (Python).' },
          { text: 'A Bluesky tool that follows top accounts by topic (Go).' },
          { text: 'A family messaging app (Next.js).' },
          { text: 'Profile pages you could export as Markdown or HTML.' },
          { text: 'A basketball site.' },
          { text: 'An index of tattoos and what they mean.' },
          { text: 'A starter template for new apps (Next.js, KeystoneJS).' },
          { text: 'An earlier personal site (Gatsby).' },
          { text: 'An app for organizing online protests, concept only.' },
          { text: 'And many quick prototypes to test ideas.' },
        ],
      },
    ],
  },
];

