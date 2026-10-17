# Collections

Added October 17, 2026.

## Public destinations

- /collections introduces the personal collections.
- /collections/books contains the reading library.
- /collections/books.json exposes the same selected records as JSON.
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

## URL continuity

Notes /library and /library/books redirect here after the destination is live.

Legacy status=in-progress becomes reading in the browser. The shelf query parameter remains accepted as an alias of subject.

Notes /books redirects to /projects. The original authored-book fragment identifiers remain on their project entries.

Reading-library entries receive stable title-and-author identifiers. Filters work with bookmarkable query parameters and do not require a backend.
