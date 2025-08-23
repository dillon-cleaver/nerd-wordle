// storage/puzzleResults.ts
import { PuzzleResult } from "@/types/puzzle-result";
import {
  savePuzzleResultLocal,
  loadPuzzleResultsLocal,
} from "./puzzle-results.local";
import { getAuth } from "firebase/auth";
import { puzzleHistoryApi } from "@/utils/api";

// Convert PuzzleResult to backend API format
// TODO: Fix type inconsistency - Frontend uses 'guesses', API uses 'attempts' for same data
const puzzleResultToApiFormat = (result: PuzzleResult) => ({
  id: result.id,
  word: result.word,
  attempts: result.guesses, // Converting frontend 'guesses' to API 'attempts'
  status: result.status === "fail" ? ("loss" as const) : result.status,
  edition: result.edition,
  hintIndex: result.hintIndex,
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
  console.log("🔄 Starting to save puzzle result:", result);

  // Save locally for offline support
  savePuzzleResultLocal(result);
  console.log("✅ Saved to local storage");

  // Save to backend if user is authenticated (both wins and losses)
  const user = getAuth().currentUser;
  console.log(
    "👤 Current user:",
    user ? `${user.email} (${user.uid})` : "Not authenticated"
  );

  if (user) {
    try {
      const apiResult = puzzleResultToApiFormat(result);
      console.log("📤 Sending to backend API:", apiResult);

      await puzzleHistoryApi.savePuzzleResult(user, apiResult);
      console.log("✅ Puzzle result saved to backend:", apiResult);
    } catch (error) {
      // TODO: Replace console.error with proper error tracking service (e.g., Sentry, Crashlytics)
      console.error("❌ Failed to save puzzle result to backend:", error);
      console.error(
        "Error details:",
        error instanceof Error ? error.message : error
      );
      // Don't throw - we want the local save to succeed even if backend fails
    }
  } else {
    console.log("⚠️ User not authenticated, skipping backend save");
  }
};

export const loadPuzzleResults = async (
  _uid: string | null
): Promise<PuzzleResult[]> => {
  // TODO: Implement loading from backend and merging with local results
  // For now, just return local results
  return loadPuzzleResultsLocal();
};
