# Collections

Added October 17, 2026.

## Public destinations

- /collections introduces the personal collections.
- /collections/books contains the reading library.
- /collections/books.json exposes the same selected records as JSON.
- /collections/movies contains recent watches and the saved movie list.
- /collections/movies.json exposes the public movie records.
- /collections/games contains the play log: current games, hours, a timeline, and the searchable game list.
- /collections/games.json exposes the public game records.
- /projects contains authored books and Cookbook as separate projects.

The library contains 133 distinct books from the existing public Notes catalogue. The original catalogue had 137 rows.

Duplicate placements and two known title variants account for the difference. The selection file preserves title aliases and subject labels.

Panda's later corrections determine reading status. The snapshot records 77 read, six reading, 48 to read, and two abandoned.

Ownership remains unknown. To-read does not mean owned or reference use.

The export omits personal ratings and unverified external averages. It does not copy private notes, headnotes, local paths, or unselected inventory entries.

## Sources

The existing public catalogue defines the initial publication selection in src/data/book-selection.json.

The selected inventory snapshot lives in src/data/books.json. The website reads only this snapshot.

The public website and deployment have no runtime connection to Panda. Builds do not need the vault or its filesystem path.

Movies use the public Letterboxd feed, not Panda. The refresh procedure is in [movies.md](movies.md).

Games use two Panda files, not a public feed. The snapshot, what stays private, and the refresh procedure are in [games.md](games.md).

The export script reads only the supplied Book Library Inventory Markdown file. It never writes to Panda.

Known historical conflicts for Adult Children of Emotionally Immature Parents and Bringing Up Girls use Panda's recorded read correction.

The Yoga Sutras duplicate uses the Integral Yoga edition. Bring Up Girls is an alias of Bringing Up Girls.

Beyond Good and Evil and Thus Spake Zarathustra are abandoned. Recovery from Gaslighting and Mark Ryden. Pinxit are read.

## Refresh the snapshot

Warning: this repository is public. Review the selection before adding a title or publishing new fields.

1. Set BOOK_INVENTORY to the local inventory Markdown path.
2. Run node scripts/export-books.ts --inventory "$BOOK_INVENTORY".
3. Review the added, changed, and removed records.
4. Resolve any missing title or conflicting status before continuing.
5. Run node scripts/export-books.ts --inventory "$BOOK_INVENTORY" --write.
6. Review the generated JSON diff.
7. Run pnpm check.
8. Run pnpm build.
9. Check the book count, filters, empty state, URLs, and small-screen layout.
10. Publish the reviewed snapshot with the repository's normal release process.

The script stops on unknown selected titles and unreviewed status conflicts. It does not automatically publish new inventory entries.

Selection removals remove public records on the next export. They do not delete the inventory source.

Do not store credentials or a private vault path in deployment settings. Only the local export command needs the inventory path.

## Wikipedia links

A book's title links to its English Wikipedia article when it has one. The page's structured data adds the Wikipedia article and the Wikidata item to that book's `sameAs`. A book with a Wikidata item but no article keeps its local link and gets only the Wikidata `sameAs`.

`scripts/link-books.ts` matches each book to a Wikidata item and writes `src/data/book-links.json`, apart from `books.json`, so an export does not erase the links. A candidate must be a written work (literary work, book, written work, or non-fiction work, or a subclass of one), and an edition item counts only when no work item exists. Its author (P50) must match the book's author after normalizing names, so "Jr.", middle initials, and co-authors listed as "A and B" do not matter. Its title must match a label or alias, and a subtitle may differ ("12 Rules for Life" and "12 Rules for Life: An Antidote to Chaos"). A book with no confident match has no entry and no link. An unlinked title is better than a wrong one. Self-help titles often have no Wikidata item, and some items have no English article.

As of October 20, 2026, 49 of the 133 books are matched: 40 with a Wikipedia article and 9 with only a Wikidata item. 84 are left unlinked. The matches need no overrides. Each article's REST summary was read to confirm it describes the book, not its author or a film adaptation.

1. After an export adds books, run `node scripts/link-books.ts`. This is a dry run.
2. Review the matched, ambiguous, and unmatched lists.
3. Fix wrong or missing matches in the script's overrides map (book id to Wikidata QID, or `null` to leave a book unlinked). `--why <id,id>` explains what the search found.
4. Run it again with `--write`.
5. Run `pnpm check` and `pnpm build`.

The script caches Wikimedia responses in `node_modules/.cache/link-books/`. Delete that folder to fetch fresh data.

## URL continuity

Notes /library and /library/books redirect here after the destination is live.

Legacy status=in-progress becomes reading in the browser. The shelf query parameter remains accepted as an alias of subject.

Notes /books redirects to /projects. The original authored-book fragment identifiers remain on their project entries.

Reading-library entries receive stable title-and-author identifiers. Filters work with bookmarkable query parameters and do not require a backend.

## Search and sharing

Each collection page has a visible breadcrumb and the same trail as a BreadcrumbList in its structured data. Both come from one `parent` value in the page.

Books has no snapshot date in its data, so its page carries no `dateModified` and its sitemap entry no `lastmod`. Movies and Games do (see their guides). `/collections` takes the newest of them.

Each collection has a share card in `public/og/`, drawn by `pnpm og:collections` from the data. Rerun it and commit the cards after any snapshot changes.
