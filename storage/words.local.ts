import { WordEntry } from "@/types/word";
import { isDebugLoggingEnabled } from "@/utils/dev-flags";

const WORDS_KEY = "nerd-wordle-words_v1";

export type CachedWords = {
  words: WordEntry[];
  timestamp: number;
  count: number;
};

export const saveWordsLocal = (words: WordEntry[]): void => {
  try {
    const cachedData: CachedWords = {
      words,
      timestamp: Date.now(),
      count: words.length,
    };

    localStorage.setItem(WORDS_KEY, JSON.stringify(cachedData));
    if (isDebugLoggingEnabled()) {
      console.log(`✅ Cached ${words.length} words to localStorage`);
    }
  } catch (error) {
    console.error("Failed to save words to localStorage:", error);
    // Optionally clear corrupted data and try again
    localStorage.removeItem(WORDS_KEY);
    try {
      localStorage.setItem(
        WORDS_KEY,
        JSON.stringify({
          words,
          timestamp: Date.now(),
          count: words.length,
        })
      );
    } catch (retryError) {
      console.error("Failed to save words on retry:", retryError);
    }
  }
};

export const loadWordsLocal = (): CachedWords | null => {
  try {
    const stored = localStorage.getItem(WORDS_KEY);
    if (!stored) {
      return null;
    }

    const parsed = JSON.parse(stored) as CachedWords;

    // Validate the structure
    if (!parsed.words || !Array.isArray(parsed.words) || !parsed.timestamp) {
      console.warn("Invalid cached words structure, clearing cache");
      localStorage.removeItem(WORDS_KEY);
      return null;
    }

    return parsed;
  } catch (error) {
    console.error("Failed to parse words from localStorage:", error);
    // Clear corrupted data
    localStorage.removeItem(WORDS_KEY);
    return null;
  }
};

export const isWordsCacheValid = (
  cacheData: CachedWords,
  ttlMs: number = 24 * 60 * 60 * 1000
): boolean => {
  const age = Date.now() - cacheData.timestamp;
  return age < ttlMs;
};

export const clearWordsCache = (): void => {
  try {
    localStorage.removeItem(WORDS_KEY);
    if (isDebugLoggingEnabled()) {
      console.log("✅ Words cache cleared");
    }
  } catch (error) {
    console.error("Failed to clear words cache:", error);
  }
};

export const getWordsCacheInfo = (): {
  exists: boolean;
  age?: number;
  count?: number;
} => {
  const cached = loadWordsLocal();
  if (!cached) {
    return { exists: false };
  }

  const age = Date.now() - cached.timestamp;
  return {
    exists: true,
    age,
    count: cached.count,
  };
};
