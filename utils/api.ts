import { User } from "firebase/auth";
import { WordEntry } from "@/types/word";
import { DailyPuzzleSeed } from "@/utils/daily-puzzle";
import {
  PuzzleHistoryResponse,
  WordsResponse,
  WordResponse,
  DailyPuzzleResponse,
} from "@/types/api-types";
import { PuzzleResult } from "@/types/puzzle-result";
import { isDebugLoggingEnabled } from "./dev-flags";
import { fromBackendLetterGuess, toBackendLetterGuess } from "./api-conversion";

// Environment detection - use explicit dev mode flag
const isDevelopment = process.env.EXPO_PUBLIC_DEV_MODE === "true";

// API URLs - configurable via environment variables
const PRODUCTION_API_URL = "https://api-2no66svcwq-uc.a.run.app";
const DEVELOPMENT_API_URL =
  "http://127.0.0.1:5001/nerd-word-cfda3/us-central1/api";

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  (isDevelopment ? DEVELOPMENT_API_URL : PRODUCTION_API_URL);

// Debug logging - only when debug logs are enabled
if (isDebugLoggingEnabled()) {
  console.log(`🔧 API Configuration:`, {
    isDevelopment,
    NODE_ENV: process.env.NODE_ENV,
    EXPO_PUBLIC_DEV_MODE: process.env.EXPO_PUBLIC_DEV_MODE,
    EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
    API_BASE_URL,
  });
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function makeAuthenticatedRequest<T>(
  user: User,
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    // Get fresh Firebase ID token
    const token = await user.getIdToken(true);

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new ApiError(
        response.status,
        `API Error: ${response.status} - ${errorText}`
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new Error(
      `Network error: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

async function makePublicRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new ApiError(
        response.status,
        `API Error: ${response.status} - ${errorText}`
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new Error(
      `Network error: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

export const puzzleHistoryApi = {
  /**
   * Save a puzzle result to the backend
   */
  async savePuzzleResult(
    user: User,
    puzzleResult: PuzzleResult
  ): Promise<void> {
    // Convert frontend PuzzleResult to API format
    // Note: Server will override the date with its own timestamp
    const apiPuzzleResult = {
      id: puzzleResult.id,
      word: puzzleResult.word,
      guesses: puzzleResult.guesses,
      attempts: puzzleResult.attempts,
      status:
        puzzleResult.status === "fail"
          ? ("loss" as const)
          : puzzleResult.status,
      edition: puzzleResult.edition,
      hintIndex: puzzleResult.hintIndex,
      letterTracking: puzzleResult.letterTracking.map(toBackendLetterGuess),
    };

    await makeAuthenticatedRequest(user, "/puzzle-result", {
      method: "POST",
      body: JSON.stringify({
        ...apiPuzzleResult,
        date: new Date().toISOString(), // Server-authoritative timestamp
      }),
    });
  },

  /**
   * Get all puzzle results for the authenticated user
   */
  async getPuzzleHistory(user: User): Promise<PuzzleResult[]> {
    const response = await makeAuthenticatedRequest<PuzzleHistoryResponse>(
      user,
      "/puzzle-history",
      {
        method: "GET",
      }
    );

    // Convert API results to frontend format
    return response.results.map((apiResult) => ({
      id: apiResult.id,
      word: apiResult.word as any, // WordId type
      edition: apiResult.edition || 0,
      date: new Date(apiResult.date),
      guesses: apiResult.guesses,
      attempts: apiResult.attempts,
      hintIndex: apiResult.hintIndex || 0,
      status:
        apiResult.status === "loss" ? ("fail" as const) : apiResult.status,
      letterTracking: apiResult.letterTracking.map(fromBackendLetterGuess),
    }));
  },
};

export const wordsApi = {
  /**
   * Get all words from the backend
   */
  async getAllWords(): Promise<WordEntry[]> {
    const response = await makePublicRequest<WordsResponse>("/words", {
      method: "GET",
    });
    return response.words;
  },

  /**
   * Get a specific word by ID
   */
  async getWord(wordId: string): Promise<WordEntry> {
    const response = await makePublicRequest<WordResponse>(`/words/${wordId}`, {
      method: "GET",
    });
    return response.word;
  },
};

export const dailyPuzzleApi = {
  /**
   * Get today's daily puzzle
   */
  async getTodaysPuzzle(): Promise<DailyPuzzleSeed> {
    const response = await makePublicRequest<DailyPuzzleResponse>(
      "/daily-puzzle/today",
      {
        method: "GET",
      }
    );
    return response.puzzle;
  },

  /**
   * Get puzzle for a specific date
   */
  async getPuzzleForDate(date: string): Promise<DailyPuzzleSeed> {
    const response = await makePublicRequest<DailyPuzzleResponse>(
      `/daily-puzzle/${date}`,
      {
        method: "GET",
      }
    );
    return response.puzzle;
  },

  /**
   * Manually schedule a daily puzzle (requires authentication)
   */
  async schedulePuzzle(
    user: User,
    date: string,
    wordId: string
  ): Promise<void> {
    await makeAuthenticatedRequest(user, "/daily-puzzle", {
      method: "POST",
      body: JSON.stringify({ date, wordId }),
    });
  },
};
