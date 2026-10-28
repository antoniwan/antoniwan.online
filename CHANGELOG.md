# Changelog

## 1.40.1 — 2026-10-28

- Keep "· itch.io" together on The Object's card when its line wraps on a phone, instead of leaving the dot at the end of the line above.

## 1.40.0 — 2026-10-28

- Link The Object on itch.io from its card, beside its source. Its own site stays its home; the structured data names the itch.io page as the same game.
- Give each project in `/llms.txt` its source link and any other place it lives, such as The Object on itch.io.

## 1.39.1 — 2026-10-28

- Link The Object at its new home, the-object.antoniwan.online, on Projects, in the structured data, and in `/llms.txt`.

## 1.39.0 — 2026-10-28

- Feature The Object on Projects and Home: its tile shows a still from the game, the moment it says "you", on its own white in both themes.
- Describe it as a free browser game by me in the Projects structured data, and name it in About and in the opening of `/llms.txt`, beside Uplift and Lifesworn, with a pointer to the game's own llms.txt.
- Show Home's Making tiles three to a row on wide screens, now that there are five.

## 1.38.0 — 2026-10-28

- Add The Object to Projects, under Games & books: an art piece about first contact, a liquid object in the browser that learns how you touch it. It links the game and its public repository, and `/llms.txt` lists it with the other projects. Its own page names me as its author with the same Person id this site uses.

## 1.37.0 — 2026-10-26

- Lead Projects with my games and picture books as big tiles: the games' logos stand in for their titles on a dark stage, and the books show their sun and moon and bent line. Everything else follows as a compact list, and the filter tabs go.
- Take LinksForest off Projects; it is retired.
- Fix Lifesworn's card: the game and its demo are coming to Steam when they are ready, not to itch.io.
- Make Collections a Lately page: Reading now, the latest watches, and Now playing, each with a link to the whole list. Tabs under each collection's intro move between them.
- Give the Now playing cards art: my games' logos, Steam's header image for the rest, initials when there is none.
- Open Books with Reading now, turn the status menu into chips with counts, and give each book one compact row with a status only when it isn't plain Read.
- Fold the game list by letter and give each game one line; Played no longer gets a pill.
- Give each film one row: a small poster, the title opening the diary entry, and the rating as stars.
- Replace Home's Work and Picture books with Making: four small tiles for the games and books, each opening its project. Add "Making things" to About.
- Mark the current page in the header with a filled pill, give posters a fallback when they fail to load, keep small list links at least 24px tall to tap, and use one heading level per book on Books.

## 1.36.0 — 2026-10-26

- Give `/llms.txt` a Projects section: every project with its link and its card's words, by category, and pointers to the llms.txt files of Uplift and Lifesworn. Games there mentions Now playing.
- Fix the Lifesworn card: the game's price is not set, so it no longer says free, and it speaks of your own champion instead of Milak Summir, who is the game's test look, not its hero.

## 1.35.0 — 2026-10-25

- Simplify the Home intro: "I write at Notes".
- Add Dispatch to Games, finished on PC, and link my review of it on Notes.
- Update Now playing: Lifesworn, my own game in development, The Outer Worlds 2, Star Wars: Zero Company, and Star Trek: Voyager – Across the Unknown join the rotation.
- Link "learning to make games" on Home to Projects, filtered to games and books. Projects now opens with a filter from `?category=`, and keeps the address in step when you pick one.

## 1.34.1 — 2026-10-25

- Keep Latest watches current: a daily job reads my Letterboxd feed and publishes only when there is a new watch. Movies had stopped at American Psycho because nothing rebuilt the site after October 20.

## 1.34.0 — 2026-10-25

- Add Lifesworn to Projects: the free 3D action RPG I'm making in Godot, where it stands, and a link to lifesworn.com.
- Show the Uplift and Lifesworn logos small in their cards, beside the title. A logo opens the game's site in a new tab.
- Rewrite the Home intro: by day the same job, the rest of the time learning to make games, Uplift and Lifesworn, and writing essays and devlogs at Notes. The site description and `/llms.txt` say the same.
- Bring the project cards up to date: Uplift is live and free, Strong Hands, Soft Heart has consulting, two books, and soap planned, Notes carries the devlogs, and Cookbook has a kitchen mode.

## 1.33.0 — 2026-10-20

- Link 40 books to their Wikipedia articles, matched through Wikidata by title and author. Books without a confident match stay unlinked.
- Name each matched film's Wikipedia, IMDb, and Wikidata pages in the Movies structured data, matched exactly through Wikidata's Letterboxd IDs.
- Link my Crimson Desert review on Notes from the game list and the Most hours bar, and mark it as my review in the structured data. List the game on PS5.
- Give my Person data my portrait, the languages I write in, what I work on, and the University of Puerto Rico, Río Piedras.
- Shorten the Games page description so search results show it whole.

## 1.32.1 — 2026-10-20

- Count the books, films, and games in `/llms.txt` from the data, and describe Games' statuses and links there.
- Fail the build when a page in the sitemap has no line in `/llms.txt`.
- Add AGENTS.md: what to keep in step when the site changes.
- Bring the README and the Collections, Movies, and Games guides up to date: the three collections, structured data, share cards, and the Wikipedia and Steam links.

## 1.32.0 — 2026-10-20

- Give Books, Movies, and Games their own share cards, drawn from the site's pattern with a stat from each collection. `pnpm og:collections` redraws them.
- Add breadcrumbs to the structured data for Collections and its three pages, from the same data as the visible breadcrumb.
- Date the collection pages from their own data, in the structured data and the sitemap. Pages without a real date get none.
- Describe my own projects on Projects as works I made: the two picture books as books, Uplift as a game, and the sites as sites.
- Link every matched game to its Wikidata entry as well as Wikipedia and Steam.
- Add American Psycho to Movies from the public Letterboxd diary.

## 1.31.0 — 2026-10-20

- Add Games to Collections: what I'm playing now, the hours I can count, a timeline by decade, and a searchable game list.
- Mark each hour figure as tracked, estimated, or a minimum, so the numbers show how far they can be trusted.
- Sort every game into one of three statuses: playing, played, or up next. Show no ratings.
- Link each title to its Wikipedia article, and to its Steam page when it is sold there. Wikidata confirms both point at the same game.
- Add a section bar that stays at the top while you scroll, with the live game count and A–Z jumps for the list.
- Add a JSON endpoint for the game list, and structured data for the list.
- Add Games to the Collections page and to the site's llms.txt.
- Copy no quotes, notes, or account details into the game records.

## 1.30.1 — 2026-10-20

- Rewrite the Freelance entry, "Selling my brain", to be about freelance work: what I take on, the jobs I've done, and that new work goes through my company.

## 1.30.0 — 2026-10-17

- Add category filters and small category labels to the project cards.
- Keep the original project order and two-column card layout.
- Make work history and experiments expandable while preserving their descriptions.
- Retain the published book anchors and work history link.
- Put the site name above the navigation on phones and small tablets.
- Arrange project filters in two columns on phones.

## 1.29.2 — 2026-10-17

- Remove Crime Log from the university project list.

## 1.29.1 — 2026-10-17

- Credit Nizar for the campus Crime Log.
- Remove the claim that Antonio built every listed university project.

## 1.29.0 — 2026-10-17

- Add Movies to Collections with latest watches, personal ratings, and searchable saved records.
- Keep the movie list in JSON. Merge public Letterboxd updates without deleting older saved watches.
- Read recent public entries at build time. Use the dated snapshot when Letterboxd is unavailable.
- Add an explicit snapshot refresh command, a JSON endpoint, and Movie list structured data.
- Reuse the shared page header and catalogue controls. Do not copy reviews or private notes.

## 1.28.1 — 2026-10-17

- Use one shared page introduction for About, Projects, Collections, and Books.
- Match title sizes, text width, and content spacing across these pages.
- Remove introductory separators. The Books search panel marks the catalogue boundary.

## 1.28.0 — October 17, 2026

- Add Collections and a searchable 133-book reading library.
- Publish a selected JSON snapshot with corrected reading statuses and duplicate handling.
- Keep unknown ownership separate from reading status and omit unverified ratings.
- Add a local, explicit-selection inventory exporter without runtime vault access.
- Add Cookbook to Projects and correct the Notes description.
- Preserve authored-book anchors for the Notes catalogue migration.

Notable changes to antoniwan.online. The project uses [Semantic Versioning](https://semver.org/).

## [1.27.3] - 2026-10-14

### Changed

- About: "write code", in the opening line, links to Projects.

## [1.27.2] - 2026-10-14

### Changed

- Projects: my own projects run newest first, by when each started, like the rest of the page: Uplift, this site, the company site, Panda and Wolf, The Bent One, LinksForest, Notes, and Mia, the Sun, and the Moon. The page description follows the same order and names Uplift.

## [1.27.1] - 2026-10-14

### Changed

- Projects: the game's card reads "Uplift, Tower Game".

## [1.27.0] - 2026-10-14

### Added

- Projects: Uplift, a tower-building game that plays in your browser, in playtest at uplifttowergame.com. Published by Strong Hands, Soft Heart. The repository is private, so the entry links the game only. `/llms.txt` lists it with the other projects.

## [1.26.2] - 2026-10-08

### Changed

- Projects: Skincare for You is retired. It leaves my own projects and joins the experiments as one line, with no link. ChatGPT does the job now.

## [1.26.1] - 2026-10-08

### Fixed

- The portrait hover on About: the avatar's frame stretched to fill its grid column, so the tongue-out photo spread into a wide oval beside the title. The frame now shrinks to the photo.

## [1.26.0] - 2026-10-08

### Changed

- The tongue-out surprise moves from the back-to-top button to the portrait, on Home and About: hover the photo and the same shot from the same sitting sticks its tongue out, with a smooth crossfade and a small springy wobble. Only where the device can hover; under reduced motion it fades without the wobble. The photo is full-frame, like the portrait, so the face changes in place.
- The back-to-top button is the arrow and its circling neuron again.

## [1.25.0] - 2026-10-08

### Added

- A surprise on the back-to-top button: on hover, or on keyboard focus, my face pops in with my tongue out, with a quick springy scale and twist, and the arrow shrinks away. Only on devices that can hover, so it never sticks on phones. Under reduced motion it swaps without the spring. The photo is a tight crop only, 48 and 96 pixels, loaded with the page.

## [1.24.0] - 2026-10-08

### Added

- A neuron circles the back-to-top button, like the ones in the backdrops: a black head with a gold trail by day, white and golden-white at night. CSS only. It stops while the button is hidden, follows the footer's "Pause animation", and is not shown under reduced motion.

### Changed

- The shader script marks the page with `data-motion="paused"` or `"on"`, so CSS motion follows the same pause switch.

## [1.23.3] - 2026-10-08

### Changed

- Nerd projects is a group under Favors in the same column, built like the other entries: one entry, "Experiments and demos, 2022 to now", with the projects as unnamed parts. The section heading is now "For others, and for fun". The separate section and its seam are gone.

## [1.23.2] - 2026-10-08

### Changed

- Nerd projects takes the row style of "For others": hairline rows, the sentence as the row, and the year and tech in the right-hand column.

## [1.23.1] - 2026-10-08

### Changed

- Nerd projects uses the same rows as "For others": one sentence per project as the row, no product names, and the year with the tech (where it matters) on the right, under one line that says these are experiments and demos, most stopped or replaced. No per-item status.

## [1.23.0] - 2026-10-08

### Added

- "Nerd projects" on Projects, after "For others": my own side projects by honest status, Running, Paused, and Stopped, from Panda's notes and my GitHub. Private ones are described, not linked.
- A round "back to top" button that appears a screen down every page. It works by keyboard, skips smooth scrolling under reduced motion, and stays visible without JavaScript.

### Changed

- The footer's text sits on paper panels over the moving pattern, like the header's pills.
- "For others" and "Nerd projects" share one `Ledger` component.

### Removed

- The "Back to top" link in the footer; the button replaces it.

## [1.22.0] - 2026-10-08

### Changed

- Editorial pass on About: no lesson lines or rank. "I go where the team needs me" replaces "the work goes where the most important problem is". "I've learned that good technical work needs a team where people feel safe to speak up" replaces the "Along the way I came to one belief" line and its jargon. Daily ends plainly about the divorce and being present. The company "handles" consulting; no "door".
- Background lists the real path: work-study web apps at UPR, a web shop with a friend that an agency bought, then partner, director of technology, CTO, product owner, and technical program manager. "Engineering manager" was never a title, so it is gone.
- Projects: the SBD and agencies entries are about a third shorter, with the same facts.

## [1.21.2] - 2026-10-08

### Changed

- Favors covers small sites, front ends, and SEO help for friends, family, neighbors, and their small businesses. The neighbors' shop is no longer its own entry.
- Selling my brain no longer singles out the lawyer's website; "websites (WordPress among them)" keeps the learning without pointing at a client.

## [1.21.1] - 2026-10-08

### Removed

- Product identification from the shared services on About and Projects. It is not public yet, so it does not belong on this site.

## [1.21.0] - 2026-10-08

### Added

- Prototyping in About's "At work": what I love most at work; I help our teams use AI tools to prototype ideas quickly. No tool names. Home's Work line mentions it too.

## [1.20.1] - 2026-10-08

### Changed

- Platform, on About and Projects: I've been part of the brands' web platform since the original PHP sites, through the move to Next.js and the shared services. It no longer says I built or shepherded them.

## [1.20.0] - 2026-10-08

### Changed

- About's "At work" says how I support the teams: the design systems team (front-end systems, Figma libraries, design to code) and a big AI team as the AI innovation product owner (ideas, user stories, sometimes code). People and practice adds interviewing, lunch-and-learn talks, and internal blog posts.
- A new shared service joined the list on About and Projects (removed again in 1.21.1).

### Added

- A line on About: I enjoy this work; our team is truly diverse and respectful, toward each other and the work, and I'm proud of what we do.

## [1.19.2] - 2026-10-08

### Changed

- Humility pass. No word ranks me above other people:
  - "the main technical voice in our product design group" is now "one of the technical people" (Projects, About, llms.txt, LinkedIn copy, GitHub README).
  - "guiding the technology side of each through the sale" is now "working on the technology side" (Projects).
  - "I hold the shape of a product" is now "I help keep a product's shape clear" (About, llms.txt, LinkedIn copy).
- Job titles, the AI innovation product owner role, and the reach of the apps stay: they are facts about the work, not rankings.

## [1.19.1] - 2026-10-08

### Changed

- Agencies and startups: Nobox bought Kolapse to bring our whole team on board, and we all moved to Miami and lived together for months. The paragraph is tightened around it.

## [1.19.0] - 2026-10-08

### Changed

- Stanley Black & Decker on Projects is one short paragraph: the original PHP sites, the move to Next.js with shared services like product search, and my roles in AI innovation and product design.

- Agencies and startups: the agencies (not Nobox alone) bought ads at scale, and both Nobox and M8 were bought while I was there; I guided the technology side of each through the sale.

### Removed

- Internal detail about SBD that is not mine to publish: how the platform is built inside, what the team is planning next, and how the team is organized. Removed from Projects, About, Home and llms.txt, and from the matching changelog entries above.

## [1.18.4] - 2026-10-08

### Fixed

- 1.18.3 did not build: an apostrophe ended a string in `projects.ts`. The entry is now double-quoted, and production stayed on 1.18.2 until this fix.
- Selling my brain: the networking work reads as one job, "wired networks (I ran the Cat5e cable and set up the routers)", not as a list of items.

## [1.18.3] - 2026-10-08

### Changed

- Agencies and startups: Nobox bought ads for companies at scale and we built the tech around it; I pitched, sold add-ons, taught our sales staff how everything worked, and once went to F8.

## [1.18.2] - 2026-10-08

### Changed

- Condense "Companies I helped build" into one paragraph entry, "Agencies and startups, 2008 to 2021", under the first group between SBD and UPR. The group is now "Jobs", since it includes companies I co-founded.

## [1.18.1] - 2026-10-08

### Changed

- "Clients" becomes "Freelance": one entry, "Selling my brain", for the side work I took on for extra income and to learn (websites, applications, physical networks, a digital signage project). The lawyer's WordPress site is one example under it.

## [1.18.0] - 2026-10-08

### Added

- "Companies I helped build" in "For others", between Employers and Clients: CarBuckets (CTO), M8 (Director of Technology), Nobox (partner), and Kolapse Interactive (co-founder and CTO), from my LinkedIn profile, in plain words.
- UPR Río Piedras gets its years (2004 to 2010) and the Crime Log.

## [1.17.2] - 2026-10-08

### Changed

- AI at SBD is about automation: everyday workflows, and testing across the front end and the back end, end to end. On Projects, on About ("AI and automation", formerly "AI and prototypes"), in llms.txt, and in the LinkedIn copy.

## [1.17.1] - 2026-10-08

### Changed

- More detail on the SBD web platform entry (removed again in 1.19.0).

## [1.17.0] - 2026-10-08

### Changed

- Make Home, About, Projects and llms.txt tell the same SBD story. About's "At work" names the roles: product owner for the AI innovation group and main technical voice in the product design group. Home's Work line summarizes the same areas. llms.txt says the same.

### Added

- A "What I built there" link from About's "At work" to "For others" on Projects.

## [1.16.6] - 2026-10-08

### Fixed

- The UPR Río Piedras campus website was a WordPress site that others built; I mostly added to it. The entry now says "I did all of this", not "I built".

## [1.16.5] - 2026-10-08

### Changed

- More detail on the SBD web platform entry (removed again in 1.19.0).

## [1.16.4] - 2026-10-08

### Changed

- Stanley Black & Decker: I built the brands' original PHP sites, back when PHP was the right tool, before shepherding the move to Next.js. The same line changes on About, in llms.txt, and in the LinkedIn copy.
- More detail on the SBD team on Projects (removed again in 1.19.0).

## [1.16.3] - 2026-10-08

### Fixed

- Product design at Stanley Black & Decker: I'm the main technical voice in that group, not its product owner.

## [1.16.2] - 2026-10-08

### Changed

- The UPR Río Piedras entry says I built all of it as a work-study student in DTAA, while I was still figuring out how to be a college student.

## [1.16.1] - 2026-10-08

### Changed

- Stanley Black & Decker under "For others" lists its parts (condensed again in 1.19.0).

## [1.16.0] - 2026-10-08

### Changed

- Rebuild "For others" on Projects as plain rows grouped by who the work was for: Employers, Clients, and Friends, family and neighbors. Each row has its years and main tool when known; the UPR Río Piedras work sits under one entry, with the unfinished transcript checker tagged. No cards and no links, so it reads apart from "My own".
- The lawyer's website is dated 2024.
- The Notes card mentions its writing charts; the antoniwan.online card tells how the site got here.

### Added

- My neighbors' gift shop (2022): Shopify SEO, done for fun.
- Favors for friends and family (2018 to 2020).
- About's Background starts with my first HTML, around age nine, on a WebTV.

## [1.15.1] - 2026-10-08

### Fixed

- Daily on About: I'm a hands-on parent to three kids, not two.

## [1.15.0] - 2026-10-08

### Added

- Add my work for the University of Puerto Rico, Río Piedras, to "For others": the campus website, the original MiUPI, Consulta al Estudiante from the big strike, and the transcript checker I never finished.
- Mark Spanish titles with `lang="es"`.

## [1.14.1] - 2026-10-08

### Fixed

- Separate project titles with semicolons in llms.txt, because some titles contain commas.

## [1.14.0] - 2026-10-08

### Added

- Add "For others" to Projects: text entries, without links, for work I built for other people. The first two are the Stanley Black & Decker web platform and a freelance WordPress site for a lawyer. Clients are never named without their permission.

### Changed

- Retitle Projects "Things I've built", because I hand most things off once they are built. The introduction says so, and the two lists are "My own" and "For others".

## [1.13.0] - 2026-10-08

### Changed

- Rename Code to Projects (`/projects`); `/code` redirects there (308). The page lists everything I built and still keep running.
- Compress "How I work": the paragraph keeps the process, and six principles become four in the same words: Systems over shortcuts, Deliberate over rushed, Clear code, Humans over hype. Two columns, so none sits alone.

### Added

- List the company site and Skincare for You on Projects.
- Add running to Daily on About: I move every day, and running comes first.

### Removed

- Remove "Small things" and the word game from Projects.
- Remove the "Projects" heading above the list; the page title already says it.

## [1.12.1] - 2026-10-08

### Changed

- Put the principles inside "How I work" on About, under its paragraph, without their own heading or section. `#principles` still points at the list.

## [1.12.0] - 2026-10-08

### Added

- Show the portrait on About as a small circle floating beside "Who I am": 80px on phones, 112px from 48rem, like the home hero on a phone.

## [1.11.1] - 2026-10-08

### Fixed

- Show the new portrait to visitors who had the old one cached. Astro names image files from the source's path and size, not its content, so the new photo kept the old URLs, which browsers keep for a year. The source is now `src/portrait-2026-10.avif`; a new portrait gets a new name.
- Add a short hash of `og.png` to its URL in the social and structured-data tags, so link previews fetch the redrawn card.

### Removed

- Remove the photo from About. The portrait stays on Home.

## [1.11.0] - 2026-10-08

### Changed

- Make strawberry the site's color: the macOS crayon #ff2f92. It colors the shader pattern, text selection and the favicon.
- Give the main button white text on #df047b, the brightest strawberry of the same hue that keeps 4.5:1 with white. The greeting uses the same color in light mode. Links and labels use a deeper strawberry (#c7006f light, #ff5ca8 dark) that keeps 4.5:1 on the paper.
- Put the header wordmark and links on paper-colored pills, so the moving pattern never sits directly behind them.
- Draw every neuron with a solid black head and a golden trail. In dark mode the head is white and the trail golden-white.
- Raise contrast: near-white paper (#fdfcfa) and near-black ink (#101216) in light mode; a darker paper (#0f1013) and brighter text in dark mode.
- Redraw `og.png` and the Apple touch icon in the new colors.
- New portrait, unedited apart from crop and format. The AVIF source carries no camera or location data.
- Describe the portrait in its alt text on Home and About (`SITE.portraitAlt`).

### Added

- Show the whole photo on About: square with soft corners beside "Who I am", and under the introduction on phones.

## [1.10.0] - 2026-10-08

### Added

- Divide the sections with a seam: a thin slice of the header's pattern at the header's scale, faded at both ends, with one neuron in it. Consecutive seams take turns with amber, teal, and violet.
- Without WebGL, with reduced motion, or with Data Saver, each seam shows a faded hairline.

### Changed

- Greet visitors on the home page: "Hi! I'm" above the name. The introduction now starts "On most of the internet I'm antoniwan."
- Say "a member of SBD Digital" instead of "a founding member" on About and in llms.txt.
- Say "I shepherded the move" instead of "I led the move" in the platform work.
- Rename the company's GitHub link to "Company GitHub".

## [1.9.0] - 2026-10-08

### Added

- Add amber, teal, and violet neuron bursts in three separate areas of each backdrop.
- Stagger the bursts and vary their speeds. Adapt each color to light and dark mode.

### Changed

- Draw all signal trails in small areas. Keep one canvas per backdrop and the existing motion controls.

## [1.8.1] - 2026-10-08

### Fixed

- Restart the seed on a visible contour when its moving curve carries it toward the edge. Fade between seed positions.
- Add a small glow and stronger trails. Start the first burst sooner and keep pulses visible longer.

## [1.8.0] - 2026-10-08

### Added

- The amber pixel sends brief pulses in both directions along the quasicrystal curves. Each pulse leaves a fading trail.
- Keep a quiet interval between bursts. Reuse the existing canvas and restrict extra drawing to each pulse's small area.

### Fixed

- Keep a separate animation clock for each backdrop. The comet resumes smoothly when its backdrop returns onscreen.
- Match the contour calculation to the displayed canvas size when the drawing buffer is scaled down.

## [1.7.4] - 2026-10-07

### Changed

- Redraw the social preview image (`og.png`) in the refreshed design: the antoniwan.online wordmark, the name in Chivo, the tagline in IBM Plex Sans, and the circular portrait on warm cream.
- `pnpm og` draws the card with headless Chrome, because sharp cannot load the site's WOFF2 fonts. The script stops Chrome after the screenshot is written, because Chrome does not always exit on macOS. Set `CHROME` if the browser is not at the usual macOS path.
- Describe the portrait and the address in the preview image's alt text.

## [1.7.3] - 2026-10-07

### Removed

- Remove the tagline from the home hero. The introduction below it already says builder, father and Boricua. The tagline stays in llms.txt.

## [1.7.2] - 2026-10-07

### Changed

- Replace the favicon with a cream "a" on an electric blue tile, to match the refreshed design. The letter is drawn as shapes, so it does not depend on a font.
- Make the Apple touch icon a full square at 180 pixels. iOS rounds the corners itself.

## [1.7.1] - 2026-10-07

### Changed

- Show the address antoniwan.online as the header and footer wordmark, so visitors see the domain they typed. On screens narrower than 24rem, the header shows antoniwan only.

## [1.7.0] - 2026-10-07

### Changed

- Pair Chivo headings with IBM Plex Sans body text, monospace details, and electric blue accents on warm cream.
- Add quasicrystal WebGL backgrounds to the header and footer. Limit animation to visible areas and 24 frames per second.
- Add a small amber comet that follows the moving quasicrystal contours and leaves a fading trail.
- Respect reduced motion and data-saving preferences. Provide a static fallback and a persistent animation pause control.
- Keep charcoal dark mode through the device color preference.
- Use one header wordmark and a circular portrait. Remove decorative captions, numbering, and repeated dividers.
- Use consistent essay spacing and typography. Make each essay and resource row a complete link.
- Show arrow indicators on outbound text links only.
- Add CSS illustrations for the picture books and a responsive project grid.
- Keep navigation and social targets at least 44 pixels tall.
- Use two local variable font subsets. Generate responsive AVIF portraits at four widths.
- Add a native Back to top link to every footer.
- Add page descriptions and site references to the structured data.
- Complete social preview metadata and allow large image previews in search results.

### Fixed

- Mark the current navigation link correctly in static builds that use `.html` paths.
- Preserve the refreshed essay layout when the browser loads newer posts.
- Use the correct Open Graph type on each page. Exclude the error page from indexing and structured data.

## [1.6.0] - 2026-10-07

### Added

- Home carries a `WebSite` node (`/#website`): the site's name, "Antonio Rodríguez Martínez", with antoniwan and the unaccented name as alternates. Google can show it above the site's results instead of the bare domain. Its publisher is the Person ID.

## [1.5.0] - 2026-10-07

### Added

- IndexNow: each Vercel production build sends every sitemap URL to IndexNow (Bing and the other IndexNow engines), as Notes does. `src/utils/indexNow.ts` runs after the sitemap is written, only when `VERCEL_ENV` is `production` (or `INDEXNOW_FORCE=1`), and only when the live site already serves the key file `public/ec54ed1f-b3ac-4040-9fe4-0176a9def32b.txt`. It tries `api.indexnow.org`, then `www.bing.com` on a 403. It never fails the build.

## [1.4.1] - 2026-10-07

### Fixed

- Every page's canonical link, `og:url` and `ProfilePage` ID ended in `.html` (`/index.html`, `/about.html`, `/code.html`), an address Vercel redirects. They now match the served URLs (`/`, `/about`, `/code`). The layout strips `.html` and `/index`, because `build.format` is `file`. Found by `~/AI/Work/llms-txt/structured-data.mjs`.

## [1.4.0] - 2026-10-07

### Added

- Structured data names Antonio as one entity that the other sites can point at: the Person has the ID `https://antoniwan.online/#person` (`SITE.personId`).
- The Person lists both spellings of the name (`alternateName`: antoniwan, Antonio Rodriguez Martinez), his home state (Florida) and his birthplace (Puerto Rico). Each place links to its Wikidata entry, so a search engine cannot mistake which Florida or Puerto Rico is meant.
- Home and About are marked as his `ProfilePage`, with the Person as the main entity. Code is not a profile page and carries only the Person.

## [1.3.0] - 2026-10-07

### Changed

- Outbound links open in a new tab. `src/middleware.ts` adds `target="_blank"` and `rel="noopener"` to every link to another site when Astro renders a page, and keeps any `rel` the link already has (such as `me`). The Writing list's browser script does the same for the links it draws. Links within the site and mailto links are unchanged.

## [1.2.0] - 2026-10-07

### Added

- About: an "At work" section on the job at Stanley Black & Decker: product architecture, the platform, design systems, AI prototypes, and people and practice. The areas live in `src/data/work.ts`, and `/llms.txt` lists them too.
- The Writing list on Home refreshes itself. The page fetches `https://notes.antoniwan.online/latest.json` (about 4 KB, Notes 6.31.0) and redraws the list when Notes has published since the last build. The built list stays as the version without JavaScript.

### Changed

- Profiles on Home are icon buttons, not text pills. Each keeps its name for screen readers and as a tooltip. The marks are from Simple Icons (CC0).
- Home: the hero says the job in one line. The Work section comes right after Writing and lists the day job and the company. The separate Consulting link is gone; the hero callout still points there.
- The build reads Notes' small `latest.json`, not the full `feed.json` (over 1 MB).

## [1.1.1] - 2026-10-07

### Changed

- The picture books' source links on the Code page point at Strong-Hands-Soft-Heart, the company's GitHub organization, where their repos moved.

## [1.1.0] - 2026-10-07

### Added

- Vercel Web Analytics through `@vercel/analytics`. The component sits at the end of every page. It counts page views without cookies, and it sends data only while Web Analytics is enabled on the Vercel project.

## [1.0.0] - 2026-10-07

### Added

- The site: Home, About, Code, and a 404 page, in Astro and plain CSS.
- `/llms.txt`, built from the same data as the pages; a sitemap; `robots.txt`.
- A service worker that removes the one the old link page registered.
