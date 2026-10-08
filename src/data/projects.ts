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
];

/**
 * My own side projects, by honest status. Sources: Panda's Digital Work notes and the GitHub inventory.
 * Private ones are described, never linked. Never name my kids or show private data.
 */
export const nerdProjects: WorkGroup[] = [
  {
    name: 'Running',
    entries: [
      {
        title: "Panda's nightly digestion",
        when: '2026',
        body: 'Every night at 10, an agent reads what I said that day and files it into my notes, with a receipt for each filing.',
      },
      { title: 'Home hub', when: '2026', body: 'A start page and music tools that run on my own Mac.' },
      { title: 'Prototypes', when: 'Always', body: 'Lots of small, mostly private prototypes, each built in a day or two to test an idea.' },
    ],
  },
  {
    name: 'Paused',
    entries: [
      {
        title: 'Nido',
        when: '2026',
        body: 'A private app for my daughter and me to share messages, voice notes, drawings, games, and memories. Paused after the first build: the app shell and the parent login.',
      },
      {
        title: 'ChatGPT Autopsy',
        when: '2025',
        body: 'A private tool that turned my ChatGPT history into a database I could search and read. I used it for a while, then paused it.',
      },
      {
        title: 'SoundCraft',
        when: '2025',
        body: 'A self-hosted system to archive and publish my music: guitar riffs, beats, short songs, and videos. Quiet since June 2025.',
      },
    ],
  },
  {
    name: 'Stopped',
    entries: [
      {
        title: 'The Turnip Content Factory',
        when: '2026',
        body: 'A network of small, absurd niche sites on shared code. It stalled on tooling and never published a site.',
      },
      { title: 'My Prompt Library', when: '2025 to 2026', body: 'My AI prompts in one place. Retired when prompts moved into agent skills.' },
      { title: 'my-react-hooks', when: '2026', body: 'A lab for custom React hooks. Abandoned.' },
      { title: 'Work Clock', when: '2025', body: 'A small web app that counts down to the end of the workday. Retired.' },
      { title: 'Bluesky follower', when: '2025', body: 'A small tool that follows top Bluesky accounts by topic, at a polite pace.' },
      { title: 'CloseNet', when: '2025', body: 'A family messaging app that stopped at the design stage.' },
      { title: 'FlexProfiles', when: '2024', body: 'Profile pages you could lay out and export as Markdown or HTML. Stopped early.' },
      { title: 'HOOPCHAMP', when: '2023', body: 'A basketball web experiment that never got past its first pages.' },
      { title: 'TattooDex', when: '2023', body: 'An index of tattoos, their meanings, and the artists behind them. Stopped early.' },
      { title: 'Frontend template', when: '2022', body: 'A starter for new apps on Next.js and KeystoneJS, with light and dark mode. Login never got built.' },
      { title: 'arod.us', when: '2022', body: 'An earlier personal site, on Gatsby.' },
      {
        title: 'Protest web app',
        body: 'An open-source idea for organizing online protests in rooms, with no ads or trackers. Concept only.',
      },
    ],
  },
];
