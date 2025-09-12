import { WordEntry, WordId } from "../../../types/word";
import wordsData from "../../../data/words.json";

/**
 * ⚠️  FUNCTIONS ONLY: Word data access for server-side operations
 *
 * CLIENT RUNTIME: Words are loaded from CDN via WordDataContext (NOT from this bundle)
 * BUILD SCRIPTS: Use data/words.json directly for CDN deployment
 *
 * This file provides server-side functions access to word data
 * for migrations, seeding, and administrative operations only.
 */

// Available ONLY for server-side functions
export const WORD_DATA: WordEntry[] = wordsData as WordEntry[];

// ⚠️ FUNCTIONS ONLY: Use WordDataContext.getWordEntry for client runtime
export const getWordEntry = (id: WordId): WordEntry => {
  const entry = WORD_DATA.find((word) => word.id === id);
  if (!entry) {
    throw new Error(`Word not found: ${id}`);
  }
  return entry;
};

export { WORD_DATA as default };
