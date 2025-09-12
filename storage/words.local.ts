/**
 * Optimized word storage using browser cache first:
 * - Browser cache for the full dataset (leverages HTTP caching)
 * - localStorage for version tracking only
 * - Much smaller memory footprint
 */

import { WordEntry } from "@/types/word";
import { isDebugLoggingEnabled } from "@/utils/dev-flags";

// Minimal metadata storage in localStorage
type WordMetadata = {
  version: string;
  lastUpdated: string;
  totalWords: number;
};

// Legacy types for backward compatibility
export type CachedWords = {
  words: WordEntry[];
  timestamp: number;
  count: number;
};

const WORDS_METADATA_KEY = "words_metadata_v3";
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Save just the metadata to localStorage (not the full word data)
 */
export function saveWordsMetadata(metadata: WordMetadata): void {
  try {
    localStorage.setItem(WORDS_METADATA_KEY, JSON.stringify(metadata));
    if (isDebugLoggingEnabled()) {
      console.log(
        `✅ Saved words metadata (v${metadata.version}, ${metadata.totalWords} words)`
      );
    }
  } catch (error) {
    console.warn("Failed to save words metadata:", error);
  }
}

/**
 * Load metadata from localStorage
 */
export function loadWordsMetadata(): WordMetadata | null {
  try {
    const stored = localStorage.getItem(WORDS_METADATA_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.warn("Failed to load words metadata:", error);
    return null;
  }
}

/**
 * Check if we need to refresh from CDN
 */
export function shouldRefreshWords(): boolean {
  const metadata = loadWordsMetadata();
  if (!metadata) return true;

  const lastUpdated = new Date(metadata.lastUpdated);
  const now = new Date();
  const isExpired = now.getTime() - lastUpdated.getTime() > CACHE_DURATION_MS;

  return isExpired;
}

/**
 * Fetch words from CDN with proper cache headers
 * Browser cache handles the heavy lifting with HTTP caching
 */
export async function fetchWordsFromCDN(
  version: string = "v6"
): Promise<WordEntry[]> {
  const url = `https://nerd-wordle.web.app/dict/${version}/words.json`;

  if (isDebugLoggingEnabled()) {
    console.log(`🔄 Fetching words from CDN: ${url}`);
  }

  // Let browser cache handle this with proper headers
  const response = await fetch(url, {
    cache: "force-cache", // Use browser cache aggressively
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch words: ${response.statusText}`);
  }

  const words = await response.json();

  // Save metadata only (not the full word data)
  saveWordsMetadata({
    version,
    lastUpdated: new Date().toISOString(),
    totalWords: words.length,
  });

  if (isDebugLoggingEnabled()) {
    console.log(`✅ Loaded ${words.length} words from CDN (browser cache)`);
  }

  return words;
}

/**
 * Main word loading function - browser cache first, then CDN
 * This replaces the old localStorage caching approach
 */
export async function loadWords(): Promise<WordEntry[]> {
  try {
    // Always try browser cache first (fastest)
    const words = await fetchWordsFromCDN();
    return words;
  } catch (error) {
    console.error("Failed to load words:", error);
    throw error;
  }
}

// Legacy function implementations for backward compatibility
export const saveWordsLocal = (words: WordEntry[]): void => {
  // Convert to new metadata format
  saveWordsMetadata({
    version: "v3",
    lastUpdated: new Date().toISOString(),
    totalWords: words.length,
  });
};

export const loadWordsLocal = (): CachedWords | null => {
  // Return null to force CDN loading
  // The browser cache will handle the actual caching
  return null;
};

export const isWordsCacheValid = (
  _cacheData: CachedWords,
  _ttlMs: number = 24 * 60 * 60 * 1000
): boolean => {
  // Always return false to force CDN loading
  // Browser cache handles validity
  return false;
};

export const clearWordsCache = (): void => {
  try {
    localStorage.removeItem(WORDS_METADATA_KEY);
    // Also clear old cache keys
    localStorage.removeItem("nerd-wordle-words_v1");
    localStorage.removeItem("words_v3");
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
  const metadata = loadWordsMetadata();
  if (!metadata) {
    return { exists: false };
  }

  const age = Date.now() - new Date(metadata.lastUpdated).getTime();
  return {
    exists: true,
    age,
    count: metadata.totalWords,
  };
};
