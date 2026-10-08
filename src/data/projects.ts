export interface Project {
  title: string;
  href: string;
  repo?: string;
  body: string;
  stack: string;
}

/** Everything I built and still keep running. Client work is listed with the company, not here. */
export const projects: Project[] = [
  {
    title: 'Notes',
    href: 'https://notes.antoniwan.online',
    repo: 'https://github.com/antoniwan/notes',
    body: 'My writing site. Essays in English and Spanish, household recipes, and a markdown copy of every post for people and agents.',
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
    body: 'This site. It replaced a link page and a separate portfolio on October 7, 2026.',
    stack: 'Astro, plain CSS',
  },
];

