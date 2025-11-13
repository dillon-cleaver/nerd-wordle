// storage/puzzleResults.ts
import { PuzzleResult } from "@/types/puzzle-result";
import {
  savePuzzleResultLocal,
  loadPuzzleResultsLocal,
} from "./puzzle-results.local";
import { getAuthInstance } from "@/firebase/firebaseConfig";
import { puzzleHistoryApi } from "@/utils/api";
import { isDebugLoggingEnabled } from "@/utils/dev-flags";

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
  const user = getAuthInstance().currentUser;
  if (isDebugLoggingEnabled()) {
    console.log(
      "👤 Current user:",
      user ? `${user.email} (${user.uid})` : "Not authenticated"
    );
  }

  if (user) {
    try {
      if (isDebugLoggingEnabled()) {
        console.log("📤 Sending to backend API:", result);
      }

      // Note: API will override the client date with server timestamp for security/consistency
      await puzzleHistoryApi.savePuzzleResult(user, result);
      if (isDebugLoggingEnabled()) {
        console.log("✅ Puzzle result saved to backend");
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
