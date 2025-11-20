/**
 * Active puzzle state storage for mitigating casual refresh-based reset exploits.
 *
 * Stores incremental game progress (letter tracking) immediately after each valid guess
 * to help prevent users from accidentally refreshing the browser to reset their attempts
 * on the same puzzle.
 *
 * Note: This mechanism relies on client-side AsyncStorage, which can be manually cleared
 * or manipulated by users.
 *
 * It does not provide strong anti-cheat protection against intentional tampering. For
 * robust security, use server-side validation.
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { LetterGuess } from "@/types/letter-tracking";
import { PuzzleId } from "@/types/puzzle-result";
import { isDebugLoggingEnabled } from "@/utils/dev-flags";

type ActivePuzzleState = {
  puzzleId: PuzzleId;
  puzzleDate: string;
  letterGuesses: LetterGuess[];
  lastUpdated: Date; // Consistent with LetterGuess.timestamp and PuzzleResult.date using Date objects
  refreshAttempts: number; // Track number of refresh attempts for analytics
};

const ACTIVE_PUZZLE_KEY = "activePuzzle_v1";

/**
 * Save the current active puzzle state after each valid guess
 */
export async function saveActivePuzzleState(
  puzzleId: PuzzleId,
  puzzleDate: string,
  letterGuesses: LetterGuess[]
): Promise<void> {
  try {
    const existing = await loadActivePuzzleState();

    // If this is a different puzzle, reset attempts counter
    const refreshAttempts =
      existing && existing.puzzleId === puzzleId ? existing.refreshAttempts : 0;

    const state: ActivePuzzleState = {
      puzzleId,
      puzzleDate,
      letterGuesses,
      lastUpdated: new Date(),
      refreshAttempts,
    };

    await AsyncStorage.setItem(ACTIVE_PUZZLE_KEY, JSON.stringify(state));

    if (isDebugLoggingEnabled()) {
      console.log("Saved active puzzle state:", {
        puzzleId,
        guessCount: letterGuesses.length,
        rows: Math.ceil(letterGuesses.length / 5),
        refreshAttempts,
      });
    }
  } catch (error) {
    console.warn("Failed to save active puzzle state:", error);
  }
}

/**
 * Load the current active puzzle state
 */
export async function loadActivePuzzleState(): Promise<ActivePuzzleState | null> {
  try {
    const stored = await AsyncStorage.getItem(ACTIVE_PUZZLE_KEY);
    if (!stored) return null;

    const state = JSON.parse(stored) as ActivePuzzleState;

    // Convert date strings back to Date objects (both for lastUpdated and letter guess timestamps)
    return {
      ...state,
      lastUpdated: state.lastUpdated ? new Date(state.lastUpdated) : new Date(),
      letterGuesses: state.letterGuesses.map((guess) => ({
        ...guess,
        timestamp: guess.timestamp ? new Date(guess.timestamp) : new Date(),
      })),
    };
  } catch (error) {
    console.warn("Failed to load active puzzle state:", error);
    return null;
  }
}

/**
 * Check if there's an active puzzle for the given puzzle ID
 */
export async function hasActivePuzzle(puzzleId: PuzzleId): Promise<boolean> {
  const state = await loadActivePuzzleState();
  return state?.puzzleId === puzzleId;
}

/**
 * Get letter guesses for a specific puzzle ID
 */
export async function getActivePuzzleLetterGuesses(
  puzzleId: PuzzleId
): Promise<LetterGuess[]> {
  const state = await loadActivePuzzleState();
  if (!state || state.puzzleId !== puzzleId) {
    return [];
  }
  return state.letterGuesses;
}

/**
 * Clear the active puzzle state (called when puzzle is completed)
 */
export async function clearActivePuzzleState(): Promise<void> {
  try {
    await AsyncStorage.removeItem(ACTIVE_PUZZLE_KEY);
    if (isDebugLoggingEnabled()) {
      console.log("Cleared active puzzle state");
    }
  } catch (error) {
    console.warn("Failed to clear active puzzle state:", error);
  }
}

/**
 * Track refresh attempts for analytics (increment when user refreshes mid-game)
 */
export async function incrementRefreshAttempts(
  puzzleId: PuzzleId
): Promise<number> {
  const state = await loadActivePuzzleState();
  if (!state || state.puzzleId !== puzzleId) {
    return 1;
  }

  const newAttempts = state.refreshAttempts + 1;

  // Update the attempts counter
  const updatedState: ActivePuzzleState = {
    ...state,
    refreshAttempts: newAttempts,
    lastUpdated: new Date(),
  };

  await AsyncStorage.setItem(ACTIVE_PUZZLE_KEY, JSON.stringify(updatedState));

  if (isDebugLoggingEnabled()) {
    console.log(`Refresh attempt #${newAttempts} for puzzle ${puzzleId}`);
  }

  return newAttempts;
}

/**
 * Get debug info about the active puzzle state
 */
export async function getActivePuzzleDebugInfo(): Promise<{
  exists: boolean;
  puzzleId?: PuzzleId;
  guessCount?: number;
  rows?: number;
  refreshAttempts?: number;
  age?: number;
}> {
  const state = await loadActivePuzzleState();
  if (!state) {
    return { exists: false };
  }

  const age = Date.now() - state.lastUpdated.getTime();
  const rows = Math.ceil(state.letterGuesses.length / 5);

  return {
    exists: true,
    puzzleId: state.puzzleId,
    guessCount: state.letterGuesses.length,
    rows,
    refreshAttempts: state.refreshAttempts,
    age,
  };
}
