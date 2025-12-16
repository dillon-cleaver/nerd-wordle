import AsyncStorage from "@react-native-async-storage/async-storage";
import { WordEntry } from "@/types/word";
import { dailyPuzzleApi } from "@/utils/api";
import { getTodayDateString } from "@/utils/time";

type DailyPuzzleSeed = {
  date: string; // ISO (YYYY-MM-DD)
  word: WordEntry; // The word includes its own appearance data
};

type CachedDailyPuzzle = {
  date: string;
  puzzle: DailyPuzzleSeed;
  cachedAt: string;
};

const DAILY_PUZZLE_CACHE_KEY = "daily_puzzle_cache_v1";

async function loadCachedPuzzleForDate(
  date: string
): Promise<DailyPuzzleSeed | null> {
  try {
    const rawCache = await AsyncStorage.getItem(DAILY_PUZZLE_CACHE_KEY);
    if (!rawCache) return null;

    const cached: CachedDailyPuzzle = JSON.parse(rawCache);
    if (!cached?.puzzle?.word || cached.date !== date) {
      return null;
    }

    return cached.puzzle;
  } catch (error) {
    console.warn("Failed to load cached daily puzzle", error);
    return null;
  }
}

async function savePuzzleToCache(puzzle: DailyPuzzleSeed): Promise<void> {
  try {
    const cachePayload: CachedDailyPuzzle = {
      date: puzzle.date,
      puzzle,
      cachedAt: new Date().toISOString(),
    };

    await AsyncStorage.setItem(
      DAILY_PUZZLE_CACHE_KEY,
      JSON.stringify(cachePayload)
    );
  } catch (error) {
    console.warn("Failed to cache daily puzzle", error);
  }
}

/**
 * ---------------------------------------------------------------------------
 * DAILY PUZZLE SEED
 * ------------------------------------------------------------
 * This now fetches the daily puzzle from Firebase backend so that
 * **every player sees the same puzzle on the same calendar date**.
 *
 * • `date` → ISO string that identifies the puzzle day.
 * • `word` → The correct answer for that day, including its appearance data.
 *
 * The word's `appearance.currentHintIndex` tells us which hint to show.
 */

/**
 * Get today's daily puzzle from the backend
 * Falls back to a default word if API is unavailable (for development)
 */
async function getTodaysPuzzle(): Promise<DailyPuzzleSeed> {
  try {
    const puzzle = await dailyPuzzleApi.getTodaysPuzzle();
    // Cache for faster subsequent loads today
    savePuzzleToCache(puzzle);
    return puzzle;
  } catch (error) {
    console.warn(
      "Failed to fetch today's puzzle from backend, using fallback:",
      error
    );

    // TODO: ALPHA ONLY - Hardcoded fallback for development
    // Production should have proper error handling and retry logic
    const today = getTodayDateString();
    const fallback: DailyPuzzleSeed = {
      date: today,
      word: {
        id: "ZELDA",
        category: "videoGames",
        edition: 5,
        summary: "Princess of Hyrule in Nintendo's adventure series",
        hints: [
          "This princess is often rescued in Nintendo games",
          "She rules the kingdom of Hyrule",
          "Link is her loyal protector",
        ],
        wikipediaUrl: "https://en.wikipedia.org/wiki/The_Legend_of_Zelda",
        appearance: {
          timesShown: 1,
          firstShownDate: new Date(),
          currentHintIndex: 0,
          lastHintRotation: new Date(),
        },
      },
    };

    savePuzzleToCache(fallback);
    return fallback;
  }
}

/**
 * Get puzzle for a specific date
 */
async function getPuzzleForDate(date: string): Promise<DailyPuzzleSeed> {
  try {
    return await dailyPuzzleApi.getPuzzleForDate(date);
  } catch (error) {
    console.error(`Failed to fetch puzzle for date ${date}:`, error);
    throw error;
  }
}

export {
  DailyPuzzleSeed,
  getTodaysPuzzle,
  getPuzzleForDate,
  loadCachedPuzzleForDate,
};
