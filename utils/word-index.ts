// utils/word-index.ts
import { WORD_DATA } from "@/constants/words";
import { WordCategory, WordId } from "@/types/word";

/**
 * CATEGORY_WORDS:
 * { movies: ["PIXAR", "ACTOR", …], literature: ["NOVEL", …], … }
 *
 * Built exactly once when this module is imported.
 */
export const CATEGORY_WORDS: Record<WordCategory, WordId[]> = Object.entries(
  WORD_DATA
).reduce(
  (acc, [id, meta]) => {
    (acc[meta.category] ??= []).push(id as WordId);
    return acc;
  },
  {} as Record<WordCategory, WordId[]>
);
