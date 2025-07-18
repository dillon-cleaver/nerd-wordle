// storage/puzzleResults.ts
import { PuzzleResult } from "@/types/puzzle-result";
import {
  savePuzzleResultLocal,
  loadPuzzleResultsLocal,
} from "./puzzle-results.local";

/**
 * In the future, swap these implementations for Firestore;
 * keep the function names & signatures the same.
 */
export const savePuzzleResult = async (
  uid: string | null,
  result: PuzzleResult
) => {
  // today ignore uid and just go local
  savePuzzleResultLocal(result);
};

export const loadPuzzleResults = async (
  uid: string | null
): Promise<PuzzleResult[]> => {
  return loadPuzzleResultsLocal();
};
