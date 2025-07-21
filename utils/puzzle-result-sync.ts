import type { PuzzleResult } from "@/types/puzzle-result";

/** TODO: implement actual POST call once the API is ready */
export async function syncPuzzleResultToBackend(
  result: PuzzleResult
): Promise<void> {
  // TODO: Implement Firestore saving logic here
  // Add this log to suppress unused parameter warnings
  console.log(result);
  // await fetch("/api/puzzleResult", { … })
}
