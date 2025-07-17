import { PuzzleResult } from "@/types/puzzle-result";

const PUZZLE_RESULTS_KEY = "puzzleResults_v1";

export const savePuzzleResultLocal = (result: PuzzleResult) => {
  const existing: PuzzleResult[] = JSON.parse(
    localStorage.getItem(PUZZLE_RESULTS_KEY) ?? "[]"
  );

  const withoutDup = existing.filter((r) => r.id !== result.id);
  localStorage.setItem(
    PUZZLE_RESULTS_KEY,
    JSON.stringify([...withoutDup, result])
  );
};

export const loadPuzzleResultsLocal = (): PuzzleResult[] => {
  return JSON.parse(localStorage.getItem(PUZZLE_RESULTS_KEY) ?? "[]");
};
