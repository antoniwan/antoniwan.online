/**
 * Antonio's own public game reviews, written as essays on Notes (https://notes.antoniwan.online).
 * Hand-kept: add a line when he publishes one. The key is a game id from games.json.
 * The Games page links each one and adds it to that game's structured data.
 * `url` is the canonical page, without `.md`. `datePublished` is the day the essay went up.
 */
export interface GameReview {
  url: string;
  title: string;
  datePublished: string;
}

export const gameReviews: Record<string, GameReview> = {
  'crimson-desert': {
    url: 'https://notes.antoniwan.online/p/my-crimson-desert-review-after-200-hours',
    title: '"Crimson Desert" Game Review',
    datePublished: '2026-04-29',
  },
  'dispatch': {
    url: 'https://notes.antoniwan.online/p/dispatch-game-review',
    title: '"Dispatch" Game Review',
    datePublished: '2026-05-13',
  },
};
