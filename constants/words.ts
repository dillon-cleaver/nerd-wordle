import { WordEntry, WordId } from "../types/word";
import wordsData from "./words.json";

/**
 * Central source of truth for all playable words.
 * Data is stored in words.json for better performance and maintainability.
 */

// Import and type the word data from JSON
export const WORD_DATA: WordEntry[] = wordsData as WordEntry[];

export const getWordEntry = (id: WordId): WordEntry => {
  const entry = WORD_DATA.find((word) => word.id === id);
  if (!entry) {
    throw new Error(`Word not found: ${id}`);
  }
  return entry;
};

export { WORD_DATA as default };
