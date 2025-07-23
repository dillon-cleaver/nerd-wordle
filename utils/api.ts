import { User } from "firebase/auth";

// API base URL - DEVELOPMENT ONLY
// TODO: Update this for production deployment
// Current behavior:
// - When Firebase Functions emulator is running: API calls work (localhost)
// - When emulator is stopped: API calls FAIL (localhost not available)
// - For production: Change to deployed Functions URL
const API_BASE_URL = "http://127.0.0.1:5001/nerd-word-cfda3/us-central1/api";

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
