import { WORD_DATA } from "@/constants/words";

/** Unified record for a single playable word. */
type WordData = {
  category: WordCategory;
  edition?: number; // Increment if the same word appears in a later release
  hints?: string[]; // Optional: one or more hints (1st is primary)
  summary?: string; // Optional: revealed on puzzle completion
};

/**
 * A fixed set of high‑level categories that every word belongs to.
 * Keep this list in sync with the routes and filtering logic elsewhere in the app.
 */
type WordCategory =
  | "common"
  | "movies"
  | "literature"
  | "fantasyAndSciFi"
  | "science"
  | "videoGames"
  | "animeAndManga"
  | "tabletopAndBoardGames"
  | "techAndInternetCulture"
  | "superheroes";

/**
 * Convenience type representing the string literal union of all words
 * defined in WORD_DATA.
 */

type Word = keyof typeof WORD_DATA;

export { Word, WordCategory, WordData };
