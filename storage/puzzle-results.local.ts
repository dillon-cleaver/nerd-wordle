import AsyncStorage from "@react-native-async-storage/async-storage";
import { PuzzleResult } from "@/types/puzzle-result";

const PUZZLE_RESULTS_KEY = "puzzleResults_v1";

export const savePuzzleResultLocal = async (
  result: PuzzleResult
): Promise<void> => {
  try {
    const existingJson = await AsyncStorage.getItem(PUZZLE_RESULTS_KEY);
    const existing: PuzzleResult[] = existingJson
      ? JSON.parse(existingJson)
      : [];
    const withoutDup = existing.filter((r) => r.id !== result.id);
    await AsyncStorage.setItem(
      PUZZLE_RESULTS_KEY,
      JSON.stringify([...withoutDup, result])
    );
  } catch (error) {
    console.error("Failed to save puzzle result to AsyncStorage:", error);
    // Optionally clear corrupted data and try again
    await AsyncStorage.removeItem(PUZZLE_RESULTS_KEY);
    await AsyncStorage.setItem(PUZZLE_RESULTS_KEY, JSON.stringify([result]));
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
