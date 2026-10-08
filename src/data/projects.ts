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
    name: 'Jobs',
    entries: [
      {
        title: 'Stanley Black & Decker',
        when: '2021 to now',
        body: "On SBD Digital, the team behind the brands' websites and apps and the services behind them. I built the brands' original PHP sites, back when PHP was the right tool, then shepherded their move to a modern Next.js platform with services every brand shares, like product search and product registration. Today I'm also the product owner for our AI innovation group, where the work is automation, and one of the technical people in our product design group.",
      },
      {
        title: 'Agencies and startups',
        when: '2008 to 2021',
        body: "I co-founded a web shop in college, Kolapse Interactive. Nobox, a South Florida marketing agency, bought it to bring our whole team on board; we all moved to Miami and lived together for months, and it was so much fun. I became a partner there, then was director of technology at M8 and CTO of a startup, CarBuckets. The agencies bought ads for companies at scale, and we built the tech around it, including apps used by millions for Sony, PlayStation, Mozilla, Marriott and Copa Airlines. Both Nobox and M8 were bought while I was there, and working on the technology side of each through the sale was very cool. I also pitched, sold add-ons, taught our sales staff how the tech worked, and once went to F8, Facebook's developer conference; working with all those vendors and companies was a blast. At M8, moving to static sites cut operating costs by about 80%.",
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
        body: 'Freelance work for extra income and to learn new things. I called it selling my brain: websites, applications, wired networks (I ran the Cat5e cable and set up the routers), and even a digital signage project. Whatever landed, for fun or for learning.',
        parts: [{ name: "A lawyer's website", text: 'A WordPress site, in 2024. I learned a lot about WordPress doing it.' }],
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
