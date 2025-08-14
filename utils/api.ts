import { User } from "firebase/auth";
import { WordEntry } from "@/types/word";
import { DailyPuzzleSeed } from "@/utils/daily-puzzle";

// Production API URL - Cloud Functions v2 (Cloud Run)
const API_BASE_URL = "https://api-2no66svcwq-uc.a.run.app";

export type PuzzleResult = {
  id: string;
  word: string;
  attempts: number;
  date: string;
  status: "win" | "loss";
  edition?: number;
  hintIndex?: number;
};

export type PuzzleHistoryResponse = {
  results: PuzzleResult[];
};

export type WordsResponse = {
  words: WordEntry[];
  count: number;
};

export type WordResponse = {
  word: WordEntry;
};

export type DailyPuzzleResponse = {
  puzzle: DailyPuzzleSeed;
};

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
    puzzleResult: Omit<PuzzleResult, "date">
  ): Promise<void> {
    await makeAuthenticatedRequest(user, "/puzzle-result", {
      method: "POST",
      body: JSON.stringify({
        ...puzzleResult,
        date: new Date().toISOString(),
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
    return response.results;
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
