import { WordEntry, WordId } from "../types/word";
import wordsData from "./words.json";

/**
 * ⚠️  BUILD-TIME ONLY: Word data access for server-side operations
 *
 * CLIENT RUNTIME: Words are loaded from CDN via WordDataContext (NOT from this bundle)
 * This eliminates the 490KB bundle size since words.json is excluded from client build
 *
 * BUILD SCRIPTS & FUNCTIONS: This file provides build-time access to word data
 * for migrations, seeding, and administrative operations only.
 */

// Available ONLY for build scripts and server-side operations
export const WORD_DATA: WordEntry[] = wordsData as WordEntry[];

// ⚠️ BUILD-TIME ONLY: Use WordDataContext.getWordEntry for client runtime
export const getWordEntry = (id: WordId): WordEntry => {
  const entry = WORD_DATA.find((word) => word.id === id);
  if (!entry) {
    throw new Error(`Word not found: ${id}`);
  }
  return entry;
};

export { WORD_DATA as default };
