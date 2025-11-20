import AsyncStorage from "@react-native-async-storage/async-storage";
import { PuzzleResult } from "@/types/puzzle-result";

const PUZZLE_RESULTS_KEY = "puzzleResults_v1";
const MAX_LOCAL_RESULTS = 500; // Keep last 500 games locally

export const savePuzzleResultLocal = async (
  result: PuzzleResult
): Promise<void> => {
  try {
    const existingJson = await AsyncStorage.getItem(PUZZLE_RESULTS_KEY);
    const existing: PuzzleResult[] = existingJson
      ? JSON.parse(existingJson)
      : [];
    const withoutDup = existing.filter((r) => r.id !== result.id);
    const allResults = [...withoutDup, result];

    // Sort by date (newest first) and keep only MAX_LOCAL_RESULTS
    const trimmed = allResults
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, MAX_LOCAL_RESULTS);

    await AsyncStorage.setItem(PUZZLE_RESULTS_KEY, JSON.stringify(trimmed));
  } catch (error) {
    console.error("Failed to save puzzle result to AsyncStorage:", error);
    // Optionally clear corrupted data and try again
    try {
      await AsyncStorage.removeItem(PUZZLE_RESULTS_KEY);
      await AsyncStorage.setItem(PUZZLE_RESULTS_KEY, JSON.stringify([result]));
    } catch (retryError) {
      console.error("Failed to recover from save error:", retryError);
      // Data is lost at this point - backend sync will be the source of truth
    }
  }
};

export const loadPuzzleResultsLocal = async (): Promise<PuzzleResult[]> => {
  try {
    const json = await AsyncStorage.getItem(PUZZLE_RESULTS_KEY);
    return json ? JSON.parse(json) : [];
  } catch (error) {
    console.error("Failed to parse puzzle results from AsyncStorage:", error);
    return [];
  }
};
