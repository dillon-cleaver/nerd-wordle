// storage/puzzleResults.ts
import { PuzzleResult } from "@/types/puzzle-result";
import {
  savePuzzleResultLocal,
  loadPuzzleResultsLocal,
} from "./puzzle-results.local";
import { getAuth } from "firebase/auth";
import { puzzleHistoryApi } from "@/utils/api";
import { isDebugLoggingEnabled } from "@/utils/dev-flags";

// Convert PuzzleResult to backend API format
const puzzleResultToApiFormat = (result: PuzzleResult) => ({
  id: result.id,
  word: result.word,
  guesses: result.guesses, // Number of guesses in this game session
  attempts: result.attempts, // Number of times this puzzle has been attempted
  status: result.status === "fail" ? ("loss" as const) : result.status,
  edition: result.edition,
  hintIndex: result.hintIndex,
  letterTracking: result.letterTracking.map((guess) => ({
    ...guess,
    timestamp: guess.timestamp.toISOString(), // Convert Date to string for API
  })),
});

/**
 * Save puzzle result to both local storage and backend API
 *
 * Backend API behavior:
 * - Functions emulator running: Saves to local Firestore emulator
 * - Functions emulator stopped: API calls fail (localhost not available)
 * - Production: Will need to update API_BASE_URL in utils/api.ts
 */
export const savePuzzleResult = async (
  _uid: string | null,
  result: PuzzleResult
) => {
  // TODO: Replace console.log with proper logging service (e.g., Firebase Analytics, Sentry)
  if (isDebugLoggingEnabled()) {
    console.log("🔄 Starting to save puzzle result:", result);
  }

  // Save locally for offline support
  savePuzzleResultLocal(result);
  if (isDebugLoggingEnabled()) {
    console.log("✅ Saved to local storage");
  }

  // Save to backend if user is authenticated (both wins and losses)
  const user = getAuth().currentUser;
  if (isDebugLoggingEnabled()) {
    console.log(
      "👤 Current user:",
      user ? `${user.email} (${user.uid})` : "Not authenticated"
    );
  }

  if (user) {
    try {
      const apiResult = puzzleResultToApiFormat(result);
      if (isDebugLoggingEnabled()) {
        console.log("📤 Sending to backend API:", apiResult);
      }

      await puzzleHistoryApi.savePuzzleResult(user, apiResult);
      if (isDebugLoggingEnabled()) {
        console.log("✅ Puzzle result saved to backend:", apiResult);
      }
    } catch (error) {
      // TODO: Replace console.error with proper error tracking service (e.g., Sentry, Crashlytics)
      if (isDebugLoggingEnabled()) {
        console.error("❌ Failed to save puzzle result to backend:", error);
        console.error(
          "Error details:",
          error instanceof Error ? error.message : error
        );
      }
      // Don't throw - we want the local save to succeed even if backend fails
    }
  } else {
    if (isDebugLoggingEnabled()) {
      console.log("⚠️ User not authenticated, skipping backend save");
    }
  }
};

export const loadPuzzleResults = async (
  _uid: string | null
): Promise<PuzzleResult[]> => {
  // TODO: Implement loading from backend and merging with local results
  // For now, just return local results
  return loadPuzzleResultsLocal();
};
