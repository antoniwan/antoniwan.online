import type { APIRoute } from 'astro';
import { SITE } from '../config/site';
import { sections } from '../data/links';
import { principles } from '../data/principles';
import { nerdProjects, projects, workForOthers } from '../data/projects';
import { workAreas } from '../data/work';

/** `/llms.txt` (https://llmstxt.org): this site for AI agents, built from the same data as the pages. */
export const GET: APIRoute = () => {
  const url = (path: string) => new URL(path, SITE.url).href;
  const section = (id: string) => sections.find((s) => s.id === id);
  const list = (id: string) =>
    (section(id)?.items ?? [])
      .map((item) => `- [${item.label}](${item.href})${item.note ? `: ${item.note}` : ''}`)
      .join('\n');

  const body = `# ${SITE.name}

> ${SITE.tagline}

${SITE.name} (${SITE.handle}) is a technical program manager at Stanley Black & Decker and a member of SBD Digital, the team behind its websites and apps and the services behind them. There he is the product owner for the AI innovation group and one of the technical people in the product design group. He is a former CTO who still writes code, writes essays at Notes, builds small web things, and makes music. Born in Puerto Rico, based in Florida, a father.

This is his personal site: who he is, how he works, what he builds, and where else he is. It has no contact form. For consulting or any business matter, go to ${SITE.company.name}, his company. His personal email is ${SITE.email}.

Principles: ${principles.map((p) => p.title).join('; ')}.

## Site

- [Home](${url('/')}): who he is, the latest essays, and every link
- [About](${url('/about')}): his work at Stanley Black & Decker, background, how he works and his principles, and the company
- [Projects](${url('/projects')}): his own (${projects.map((p) => p.title).join('; ')}), work for others (${workForOthers.flatMap((g) => g.entries).map((e) => e.title).join('; ')}), and nerd projects: ${nerdProjects.length} experiments and demos, most of them stopped or replaced

## Writing

- [Notes](${SITE.notesUrl}/llms.txt): every essay, with a markdown copy of each
${list('writing')
  .split('\n')
  .filter((line) => !line.startsWith('- [Notes]'))
  .join('\n')}

## Work at Stanley Black & Decker

In his words:

${workAreas.map((area) => `- ${area.title}: ${area.body}`).join('\n')}

## Company

- [${SITE.company.name}](${SITE.company.llmsUrl}): his company; consulting now, soap later; it publishes the picture books
- [Consulting](${SITE.company.consultingUrl}): AI and engineering consulting, and the only contact form

## Picture books

${list('books')}

## Elsewhere

${list('elsewhere')}

## Profiles

${list('profiles')}
`;

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
