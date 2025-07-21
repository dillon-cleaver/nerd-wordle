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
  // TODO: Implement Firestore saving logic here
  // Add this log to suppress unused parameter warnings
  console.log(uid);
  // today ignore uid and just go local
  savePuzzleResultLocal(result);
};

export const loadPuzzleResults = async (
  uid: string | null
): Promise<PuzzleResult[]> => {
  // TODO: Implement Firestore saving logic here
  // Add this log to suppress unused parameter warnings
  console.log(uid);
  return loadPuzzleResultsLocal();
};
