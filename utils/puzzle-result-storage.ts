import { PuzzleResult } from "@/types/backend";

const PUZZLE_RESULTS_KEY = "puzzleResults";

export function savePuzzleResultsLocally(result: PuzzleResult) {
  try {
    const existing: PuzzleResult[] = JSON.parse(
      localStorage.getItem(PUZZLE_RESULTS_KEY) || "[]"
    );

    const updated = [...existing.filter((r) => r.id !== result.id), result];

    localStorage.setItem(PUZZLE_RESULTS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error(err);
  }
}

export function getPuzzleResults(): PuzzleResult[] {
  try {
    const stored = localStorage.getItem(PUZZLE_RESULTS_KEY) || "[]";
    return JSON.parse(stored) as PuzzleResult[];
  } catch (err) {
    console.error(err);
    return [];
  }
}
