// storage/puzzleResults.ts
import { PuzzleResult } from "@/types/puzzle-result";
import {
  savePuzzleResultLocal,
  loadPuzzleResultsLocal,
} from "./puzzle-results.local";
import { getAuth } from "firebase/auth";
import { winHistoryApi, WinRecord } from "@/utils/api";

// Convert PuzzleResult to backend WinRecord format
const puzzleResultToWinRecord = (result: PuzzleResult): Omit<WinRecord, 'date'> => ({
  id: result.id,
  word: result.word,
  attempts: result.guesses,
  edition: result.edition,
  hintIndex: result.hintIndex,
});

/**
 * Save puzzle result to both local storage and backend API
 */
export const savePuzzleResult = async (
  _uid: string | null,
  result: PuzzleResult
) => {
  // Save locally for offline support
  savePuzzleResultLocal(result);

  // Save to backend if user is authenticated and it's a win
  const user = getAuth().currentUser;
  if (user && result.status === "win") {
    try {
      const winRecord = puzzleResultToWinRecord(result);
      await winHistoryApi.saveWin(user, winRecord);
      console.log('✅ Puzzle result saved to backend:', winRecord);
    } catch (error) {
      console.error('❌ Failed to save puzzle result to backend:', error);
      // Don't throw - we want the local save to succeed even if backend fails
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
