import { PuzzleResult } from "@/types/puzzle-result";

const PUZZLE_RESULTS_KEY = "puzzleResults_v1";

export const savePuzzleResultLocal = (result: PuzzleResult) => {
  try {
    const existing: PuzzleResult[] = JSON.parse(
      localStorage.getItem(PUZZLE_RESULTS_KEY) ?? "[]"
    );

    const withoutDup = existing.filter((r) => r.id !== result.id);
    localStorage.setItem(
      PUZZLE_RESULTS_KEY,
      JSON.stringify([...withoutDup, result])
    );
  } catch (error) {
    console.error("Failed to save puzzle result to localStorage:", error);
    // Optionally clear corrupted data and try again
    localStorage.removeItem(PUZZLE_RESULTS_KEY);
    localStorage.setItem(PUZZLE_RESULTS_KEY, JSON.stringify([result]));
  }
};

export const loadPuzzleResultsLocal = (): PuzzleResult[] => {
  try {
    return JSON.parse(localStorage.getItem(PUZZLE_RESULTS_KEY) ?? "[]");
  } catch (error) {
    console.error("Failed to parse puzzle results from localStorage:", error);
    return [];
  }
};
