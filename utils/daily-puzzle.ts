import { Word } from "@/types/word";

type DailyPuzzleSeed = {
  date: string; // ISO (YYYY-MM-DD)
  word: Word;
  edition: number;
  hintIndex: number;
};

/**
 * ------------------------------------------------------------
 * DAILY PUZZLE SEED (TEMP STUB)
 * ------------------------------------------------------------
 * In the finished app this object will be hydrated from Firestore
 * (or another backend endpoint) so that **every player sees the
 * same puzzle on the same calendar date**.
 *
 * • `date`      →  ISO string that identifies the puzzle day.
 * • `word`      →  The correct answer for that day.
 * • `edition`   →  The “print run” number that belongs to the *word itself* (think collector‑card edition).
 * • `hintIndex` →  Which hint to display from WORD_DATA[word].hints[].
 *
 * During local‑only development the game still picks the word at
 * random inside `initializeGame()`, so for now we only *use*
 * `hintIndex` (defaults to 0) and ignore the other fields.
 *
 * When the backend is ready, simply replace this static constant with
 * a fetch/helper that returns the real daily seed—and delete these
 * “ignored” comments.
 */
const TODAY_PUZZLE: DailyPuzzleSeed = {
  date: "2025-07-17",
  word: "ZELDA",
  edition: 1,
  hintIndex: 0,
};

export { DailyPuzzleSeed, TODAY_PUZZLE };
