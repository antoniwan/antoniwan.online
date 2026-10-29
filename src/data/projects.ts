export const projectCategories = [
  { id: 'apps-and-tools', title: 'Apps & tools', description: 'Useful things for everyday life and my own workflow.' },
  { id: 'games-and-books', title: 'Games & books', description: 'Things to play, read, and spend a little time with.' },
  { id: 'websites-and-writing', title: 'Websites & writing', description: 'My places on the web, for work and for myself.' },
] as const;

export interface Project {
  category: typeof projectCategories[number]['id'];
  title: string;
  href: string;
  repo?: string;
  /** Other places the same work lives, such as a store page. The project's own `href` stays its canonical home. */
  alsoOn?: { name: string; href: string }[];
  body: string;
  stack: string;
  /** A game's own logo. On a featured tile it stands in for the title. */
  logo?: { src: string; width: number; height: number; pixelated?: boolean };
  /** A still from the work itself, for a featured tile with no logo. Decoration: the title sits under it. */
  still?: { src: string; width: number; height: number };
  /**
   * The games, the desktop app, and the picture books lead Projects as big tiles, and Home shows the same four as small ones.
   * `art` is the logo, a still from the work, or one of the books' CSS illustrations; `line` is one short fact under the text.
   */
  featured?: { id: string; art: 'logo' | 'still' | 'sky' | 'line'; line: string };
}

/**
 * My own things that I still run, newest first within each displayed category.
 * Work I built and handed over to others is in workForOthers.
 */
export const projects: Project[] = [
  {
    title: 'Unblinking',
    category: 'apps-and-tools',
    href: 'https://github.com/antoniwan/unblinking-desktop',
    repo: 'https://github.com/antoniwan/unblinking-desktop',
    body: 'A small magical eye that lives on your desktop. It finds your face through your webcam and watches: it locks on when you sit down, hunts when you leave, flinches at a bang, and whispers, in nine moods drawn from schools of magic. It runs entirely on your computer and never goes online. I rewrote it from Electron in Rust: one 27 MB exe, at under a third of the memory.',
    stack: 'Rust, wgpu, on-device face tracking',
    still: { src: '/projects/unblinking.webp', width: 320, height: 320 },
    featured: { id: 'unblinking', art: 'still', line: 'Open source · Windows' },
  },
  {
    title: 'The Object',
    category: 'games-and-books',
    href: 'https://the-object.antoniwan.online',
    repo: 'https://github.com/antoniwan/the-object',
    alsoOn: [{ name: 'itch.io', href: 'https://antoniwan.itch.io/the-object' }],
    body: "An art piece about first contact: a liquid object in your browser that you can touch. It never says what it is. The longer you stay, the more it learns how you touch it, and one day it may reach back. Written in Rust and compiled to WebAssembly, with one shader for the liquid.",
    stack: 'Rust, WebAssembly, WebGL2',
    still: { src: '/projects/the-object.webp', width: 640, height: 420 },
    featured: { id: 'the-object', art: 'still', line: 'Free in your browser' },
  },
  {
    title: 'Cookbook',
    category: 'apps-and-tools',
    href: 'https://cookbook.antoniwan.online',
    repo: 'https://github.com/antoniwan/cookbook',
    body: 'Our family recipes, in English and Spanish. A practical kitchen notebook with adjustable quantities, ingredient checklists, a kitchen mode, printing, and a garlic bulb and strawberry keeping watch.',
    stack: 'Astro, TypeScript',
  },
  {
    title: 'Lifesworn',
    category: 'games-and-books',
    href: 'https://lifesworn.com',
    body: "A 3D action RPG, and the game I've been dreaming about for years. You make your own champion and live their life. I make it alone, in Godot. The game and a demo for Windows, Mac, and Linux are coming to Steam when they are ready. Next up: the first region, built to play from start to finish.",
    stack: 'Godot, GDScript',
    logo: { src: '/projects/lifesworn-logo.svg', width: 170, height: 54 },
    featured: { id: 'lifesworn', art: 'logo', line: 'Coming to Steam, demo too' },
  },
  {
    title: 'Uplift',
    category: 'games-and-books',
    href: 'https://uplifttowergame.com',
    body: 'My take on SimTower: build a tower floor by floor and keep the elevators moving. Live three days after it started, free, in your browser on a computer or a tablet. Still early, and every note from players shapes it. Published by Strong Hands, Soft Heart.',
    stack: 'TypeScript, PixiJS, SolidJS',
    logo: { src: '/projects/uplift-logo.png', width: 100, height: 88, pixelated: true },
    featured: { id: 'uplift', art: 'logo', line: 'Free to play in your browser' },
  },
  {
    title: 'antoniwan.online',
    category: 'websites-and-writing',
    href: '/',
    repo: 'https://github.com/antoniwan/antoniwan.online',
    body: 'This site, since October 7, 2026. Before it came arod.us in 2022, builds.software in 2025, and a link page on this domain: many names and ideas. This is the one I enjoy, and it keeps changing.',
    stack: 'Astro, plain CSS',
  },
  {
    title: 'Strong Hands, Soft Heart',
    category: 'websites-and-writing',
    href: 'https://www.stronghandssoftheart.com',
    repo: 'https://github.com/Strong-Hands-Soft-Heart/stronghandssoftheart.com',
    body: "My company's site: consulting now, two picture books, and soap planned for late 2026. Built from its own design system; the moving background is drawn from the company's mark.",
    stack: 'Astro, WebGL',
  },
  {
    title: 'Panda and Wolf',
    category: 'apps-and-tools',
    href: 'https://notes.antoniwan.online/p/panda-and-wolf',
    body: 'Two Obsidian vaults kept by agent skills I write from scratch. One rule sits under both: honesty. The vaults are private; the essay explains the system.',
    stack: 'Markdown, agent skills',
  },
  {
    title: 'The Bent One',
    category: 'games-and-books',
    href: 'https://the-bent-one-book.stronghandssoftheart.com',
    repo: 'https://github.com/Strong-Hands-Soft-Heart/the-bent-one',
    body: 'A bilingual picture book with animated spreads. Published by Strong Hands, Soft Heart.',
    stack: 'Vite',
    featured: { id: 'the-bent-one', art: 'line', line: 'English and Spanish · Read it online' },
  },
  {
    title: 'Notes',
    category: 'websites-and-writing',
    href: 'https://notes.antoniwan.online',
    repo: 'https://github.com/antoniwan/notes',
    body: 'My public notebook. Essays in English and Spanish, and the devlogs for Uplift and Lifesworn, with a markdown copy of every post for people and agents. It also charts my own writing: how often I post and what about.',
    stack: 'Astro, TypeScript',
  },
  {
    title: 'Mia, the Sun, and the Moon',
    category: 'games-and-books',
    href: 'https://mia-the-sun-and-the-moon-web-book.stronghandssoftheart.com',
    repo: 'https://github.com/Strong-Hands-Soft-Heart/book-sun-and-moon',
    body: 'A bilingual picture book as a web app, written for my daughter and my nephew. Published by Strong Hands, Soft Heart.',
    stack: 'React, Vite',
    featured: { id: 'mia-the-sun-and-the-moon', art: 'sky', line: 'English and Spanish · Free to read' },
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
  description: string;
  entries: WorkEntry[];
}

/**
 * Work I built for other people and handed over, then my own side projects ("Nerd projects", described, never named).
 * Text only, no links, at a high level. Never name a client, a friend or their business without their permission.
 */
export const workForOthers: WorkGroup[] = [
  {
    name: 'Jobs',
    description: 'Stanley Black & Decker, agencies, startups, and university work.',
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
        body: 'I was a work-study student in DTAA, the campus IT division, while I was still figuring out how to be a college student.',
        parts: [
          { name: 'The campus website', text: 'A WordPress site that others built. I mostly added to it.' },
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
    name: 'Freelance',
    description: 'Websites, applications, and networks, for people who bring a problem.',
    entries: [
      {
        title: 'Selling my brain',
        when: 'On the side',
        body: "Freelance work, by the project. I call it selling my brain: you bring the problem, I bring the thinking and the hands. I've built websites (WordPress among them) and applications, ran the Cat5e cable and set up the routers for a wired network, and delivered a digital signage project. I take work that pays and teaches me something. New freelance work goes through my company.",
      },
    ],
  },
  {
    name: 'Friends, family and neighbors',
    description: 'Small sites, front ends, and help for people I know.',
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
    description: 'Experiments, prototypes, and things I built to learn.',
    entries: [
      {
        title: 'Experiments and demos',
        when: '2022 to now',
        body: 'Built for fun or to learn. Most I stopped, or replaced with the next one.',
        parts: [
          { text: 'An agent that files my day into my notes every night.' },
          { text: 'A start page and music tools that run on my own Mac (Python).' },
          { text: 'A private app for my daughter and me to share messages and drawings (React Native).' },
          { text: 'A skincare routine app, Spanish first, until ChatGPT did the job (Next.js).' },
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

