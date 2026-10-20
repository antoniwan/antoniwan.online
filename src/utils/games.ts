import type { Game, GameStatus, HoursConfidence } from '../data/games';

/** Decade groups for the timeline and filters. 1990 also holds anything older. */
export const decadeGroups = [2020, 2010, 2000, 1990] as const;

export function decadeLabel(decade: number): string {
  return decade === 1990 ? '1990s and earlier' : `${decade}s`;
}

/** The group a game belongs to, or null when no year is recorded. */
export function decadeGroup(game: Game): number | null {
  if (game.decade === null) return null;
  return Math.max(game.decade, 1990);
}

/** Display order within a group: games I finished or kept playing first. */
const statusRank: Record<GameStatus, number> = { playing: 0, played: 1, 'up-next': 2 };

export function byStatusThenTitle(first: Game, second: Game): number {
  return statusRank[first.status] - statusRank[second.status] || first.title.localeCompare(second.title);
}

export const confidenceHints: Record<HoursConfidence, string> = {
  tracked: 'Counted by a platform or in-game counter',
  estimate: 'My own estimate',
  floor: 'At least this many; the real number is higher',
  unknown: 'Not recorded',
};

export function formatNumber(value: number): string {
  return value.toLocaleString('en-US');
}
