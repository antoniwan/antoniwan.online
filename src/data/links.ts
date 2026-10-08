import type { IconName } from './icons';

export interface LinkItem {
  label: string;
  href: string;
  note?: string;
  /** rel="me" marks a profile that is mine, for IndieWeb and verification. */
  me?: boolean;
  /** The icon shown in the "icons" layout. */
  icon?: IconName;
}

export interface LinkSection {
  id: string;
  title: string;
  /** "list" shows notes under each link; "icons" shows an icon per link, with the label for screen readers. */
  layout: 'list' | 'icons';
  items: LinkItem[];
}

export const sections: LinkSection[] = [
  {
    id: 'writing',
    title: 'Writing',
    layout: 'list',
    items: [
      {
        label: 'Notes',
        href: 'https://notes.antoniwan.online',
        note: 'Essays on fatherhood, philosophy, culture and work, and the recipes we cook at home. Every post is also served as markdown.',
      },
      {
        label: 'Medium',
        href: 'https://medium.com/@wizards777',
        note: 'Older essays, from before Notes existed.',
      },
    ],
  },
  {
    id: 'work',
    title: 'Work',
    layout: 'list',
    items: [
      {
        label: 'Stanley Black & Decker',
        href: '/about#work',
        note: "My day job since 2021, on SBD Digital: the brands' web platform and the services and data behind it, AI innovation, product design, and mentoring.",
      },
      {
        label: 'Strong Hands, Soft Heart',
        href: 'https://www.stronghandssoftheart.com',
        note: 'My company. AI and engineering consulting now, soap later. It publishes the picture books.',
      },
    ],
  },
  {
    id: 'books',
    title: 'Picture books',
    layout: 'list',
    items: [
      {
        label: 'Mia, the Sun, and the Moon',
        href: 'https://mia-the-sun-and-the-moon-web-book.stronghandssoftheart.com',
        note: 'A bilingual picture book about a curious girl, the sun, and the moon. Free to read, in English or Spanish.',
      },
      {
        label: 'The Bent One',
        href: 'https://the-bent-one-book.stronghandssoftheart.com',
        note: 'A short red line with a bend, and the shapes a line can take depending on where it stands and who it is with.',
      },
    ],
  },
  {
    id: 'elsewhere',
    title: 'Elsewhere',
    layout: 'list',
    items: [
      { label: 'GitHub', href: 'https://github.com/antoniwan', note: 'Code and open source.', me: true },
      {
        label: 'Company GitHub',
        href: 'https://github.com/Strong-Hands-Soft-Heart',
        note: 'Strong Hands, Soft Heart repositories.',
      },
      { label: 'CodePen', href: 'https://codepen.io/antoniwan', note: 'UI experiments.' },
      { label: 'Goodreads', href: 'https://www.goodreads.com/antoniwan', note: 'What I read.' },
      { label: 'Patreon', href: 'https://patreon.com/antoniwan', note: 'Back the builder.' },
    ],
  },
  {
    id: 'profiles',
    title: 'Profiles',
    layout: 'icons',
    items: [
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/antoniwan', me: true, icon: 'linkedin' },
      { label: 'Bluesky', href: 'https://bsky.app/profile/antoniwan.online', me: true, icon: 'bluesky' },
      { label: 'X', href: 'https://x.com/antoniwan', me: true, icon: 'x' },
      { label: 'Instagram', href: 'https://www.instagram.com/_antoniwan', me: true, icon: 'instagram' },
      { label: 'Threads', href: 'https://www.threads.com/@_antoniwan', me: true, icon: 'threads' },
      { label: 'Facebook', href: 'https://www.facebook.com/antoniwan', me: true, icon: 'facebook' },
      { label: 'Spotify', href: 'https://open.spotify.com/user/antoniwan', icon: 'spotify' },
      { label: 'Last.fm', href: 'https://www.last.fm/user/antoniwan', icon: 'lastfm' },
      { label: 'Email', href: 'mailto:antonio@builds.software', icon: 'email' },
    ],
  },
];
