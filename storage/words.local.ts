/**
 * Optimized word storage using browser cache first:
 * - Browser cache for the full dataset (leverages HTTP caching)
 * - localStorage for version tracking only
 * - Much smaller memory footprint
 */

import { WordEntry } from "@/types/word";
import {
  isDebugLoggingEnabled,
  shouldClearLocalStorageOnStart,
} from "@/utils/dev-flags";

// Import words statically for development mode
import localWordsData from "../data/words.json";

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
        `✅ Saved words metadata (${metadata.version}, ${metadata.totalWords} words)`
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
 * Get the current dictionary version from CDN with timeout and fallback
 */
export async function getCurrentVersion(): Promise<string> {
  try {
    const response = await Promise.race([
      fetch(`https://nerd-word-cfda3.web.app/dict/current-version.json`, {
        cache: "no-cache", // Always get the latest version info
        mode: "cors",
      }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Version fetch timeout")), 5000)
      ),
    ]);

    if (!response.ok) {
      throw new Error(
        `Version fetch failed: ${response.status} ${response.statusText}`
      );
    }

    const versionInfo = await response.json();

    if (!versionInfo.version) {
      throw new Error("Invalid version info received");
    }

    return versionInfo.version;
  } catch (error) {
    console.warn("Failed to get current version, falling back to v7:", error);
    return "v7"; // Fallback to known working version
  }
}

/**
 * Fetch words from CDN with proper cache headers and error handling
 * Browser cache handles the heavy lifting with HTTP caching
 */
export async function fetchWordsFromCDN(
  version?: string
): Promise<WordEntry[]> {
  try {
    // Get current version if not specified
    const actualVersion = version || (await getCurrentVersion());
    const url = `https://nerd-word-cfda3.web.app/dict/${actualVersion}/words.json`;

    if (isDebugLoggingEnabled()) {
      console.log(`🔄 Fetching words from CDN: ${url}`);
    }

    const response = await fetch(url, {
      cache: "force-cache", // Use browser cache aggressively
      mode: "cors",
    });

    if (!response.ok) {
      throw new Error(
        `CDN fetch failed: ${response.status} ${response.statusText}`
      );
    }

    const words = await response.json();

    if (!Array.isArray(words) || words.length === 0) {
      throw new Error("Invalid words data received from CDN");
    }

    // Save metadata only (not the full word data)
    saveWordsMetadata({
      version: actualVersion,
      lastUpdated: new Date().toISOString(),
      totalWords: words.length,
    });

    if (isDebugLoggingEnabled()) {
      console.log(`✅ Loaded ${words.length} words from CDN (browser cache)`);
    }

    return words;
  } catch (error) {
    if (isDebugLoggingEnabled()) {
      console.error("❌ CDN fetch error:", error);
    }
    throw error;
  }
}

/**
 * Main word loading function with robust fallback strategy
 * 1. Development: Try local file first, then CDN
 * 2. Production: Try CDN with timeout, then fallback strategies
 */
export async function loadWords(): Promise<WordEntry[]> {
  console.log("🔄 loadWords() called - starting word loading process");

  try {
    // Auto-clear cache if dev flag is enabled
    clearWordsCacheIfNeeded();

    const isDevelopment = process.env.EXPO_PUBLIC_DEV_MODE === "true";
    console.log(`🔧 Development mode: ${isDevelopment}`);

    if (isDevelopment) {
      // In development: try local file first
      try {
        console.log(
          "🔄 Attempting to load words from local data/words.json (dev mode)"
        );

        // Use static import for development mode
        const localWords = localWordsData as WordEntry[];

        console.log(
          `✅ Successfully loaded ${localWords.length} words from local file`
        );

        return localWords;
      } catch (localError) {
        console.warn(
          "⚠️ Failed to load local words, falling back to CDN:",
          localError
        );
        // Fall through to CDN loading
      }
    }

    // Try CDN loading with timeout
    console.log("🔄 Attempting to load words from CDN...");

    const words = await Promise.race([
      fetchWordsFromCDN(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("CDN request timeout")), 10000)
      ),
    ]);

    console.log(`✅ Successfully loaded ${words.length} words from CDN`);

    return words;
  } catch (error) {
    console.error("❌ Failed to load words from all sources:", error);

    // Final fallback: try to load previous version from cache or return minimal dataset
    const metadata = loadWordsMetadata();
    if (metadata) {
      console.warn(`⚠️ Attempting to load cached version ${metadata.version}`);
      try {
        const fallbackWords = await fetchWordsFromCDN(metadata.version);
        console.log(
          `✅ Loaded ${fallbackWords.length} words from cached version`
        );
        return fallbackWords;
      } catch (fallbackError) {
        console.error("❌ Failed to load fallback version:", fallbackError);
      }
    }

    // If all else fails, throw the error
    throw new Error(
      "Unable to load words from any source. Please check your internet connection and try again."
    );
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

/**
 * Clear words cache if dev flag is enabled
 * Useful for development when you want fresh data on each app start
 */
export const clearWordsCacheIfNeeded = (): void => {
  if (shouldClearLocalStorageOnStart()) {
    clearWordsCache();
    if (isDebugLoggingEnabled()) {
      console.log("🧹 Auto-cleared words cache (dev mode)");
    }
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
