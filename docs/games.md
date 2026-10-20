# Games

Added October 20, 2026.

## Public destinations

- `/collections/games` contains the play log: what I'm playing now, the hours I can count, a timeline by decade, and the searchable game list.
- `/collections/games.json` contains the same public records and source metadata.
- `/collections` links to Books, Movies, and Games.

The snapshot dated October 20, 2026 contains 256 games. By status, that is 4 playing, 249 played, and 3 up next.

Thirty-two games have an hour figure. The tracked floor is 5,907 hours. The lifetime estimate is about 20,000 to 25,000 hours.

The page is a log, not a complete history. Played covers everything from a finished game to one a save folder only proves was opened. Hours and progress tell them apart. The page shows no ratings.

## Sources

Both sources are in Panda, the personal Obsidian vault, under `Areas/Gaming`:

- `Gaming Inventory.md`
- `Gaming Backlog — Recorded Progress.md`

The website reads only `src/data/games.json`. The public site has no runtime connection to Panda, and builds do not need the vault or its filesystem path.

The export script reads only the two files named by its arguments. It never writes to Panda.

Release years come from the vault where it records one. Where neither file records a year, the script uses a public release-year map inside the script. Those are public facts, not vault entries. Twenty games have no year, and their pages show none.

Titles that appear in more than one place become one record. The script merges them through an explicit alias map. Platforms are combined. Hours and progress come from the Galaxy and rotation tables. Year, decade, and genre come from the backlog.

## What may be public

The export copies only these fields:

- title, release year, and decade
- platform and store names
- genre heading
- status
- hours, with their confidence and a public source label
- completion percent
- the lifetime estimate and the tracked floor

## What stays private

The export never copies:

- quotes from posts written at the time, or anything under those sections
- the bodies of Panda callouts
- quotes from chats, direct messages, or posts
- account names, profile links, ranks, and levels
- file paths, drive letters, save-folder sizes, and app IDs
- rows the script's exclusion list names
- review-aggregator links
- build guides and walkthrough files
- notes columns
- personality or psychology readings

Only the sections on the allowlist are read. Anything outside them is skipped.

## Status mapping

| Source | Status |
| --- | --- |
| Recorded rotation table, and two titles noted as in play in October 2026 | Playing |
| Done playing list, PS5 tracker (completed, in progress, checked), checked PC backlog rows, Galaxy rows, save-folder tables | Played |
| Unchecked PC backlog and PS5 to-do rows, Looking forward to list | Up next |

The sources record finer statuses (finished, retired, started, launched, and more). The script uses them to decide which record wins a merge, in the order playing, retired, finished, started, played, launched, backlog, looking forward to. It then folds them into the three public statuses.

## Hours and confidence

Each hour figure carries one of these labels:

- **Tracked**: from a platform or in-game counter. Platform counters count idle time as well.
- **Estimate**: my rough figure, shown as a range. The bar uses the midpoint.
- **At least**: a floor, shown with a plus sign.
- **Unknown**: no usable figure. The game has no hours bar.

The lifetime number is an estimate. It is not a measurement.

## Refresh the snapshot

Warning: this repository is public. Review the export before publishing it.

1. Set `GAMES_INVENTORY` to the local path of `Gaming Inventory.md`.
2. Set `GAMES_BACKLOG` to the local path of `Gaming Backlog — Recorded Progress.md`.
3. Run `node scripts/export-games.ts --inventory "$GAMES_INVENTORY" --backlog "$GAMES_BACKLOG"`. This is a dry run.
4. Review the printed total, counts by status, and the added, changed, and removed titles.
5. Review the merged titles, hour figures that disagree between sections, and near-duplicate titles the script kept separate. Resolve each one before continuing.
6. Run the same command with `--write` to save `src/data/games.json`.
7. Review the JSON diff. Check that no private field, quote, or path appears.
8. Run `pnpm check`.
9. Run `pnpm build`.
10. Check the page, filters, empty state, the JSON endpoint, and the small-screen layout.
11. Publish the reviewed snapshot with the repository's normal release process.

The script has no default paths. It requires both flags. It stops on duplicate ids and on any title it cannot read.

Fix aliases and release years in the script, not in the JSON. A later `--write` replaces the JSON.

A title that leaves both sources is listed as removed. It disappears from the public records on the next write.

Do not store the vault path in deployment settings. Only the local export command needs it.
