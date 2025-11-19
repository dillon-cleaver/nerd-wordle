import { useState, useEffect } from "react";
import { getTodaysPuzzle, DailyPuzzleSeed } from "@/utils/daily-puzzle";
import { initializeGame } from "@/utils/game";
import { WordCategory, WordId } from "@/types/word";

type GameState = {
  category: string;
  originalCategory: WordCategory;
  answer: WordId;
};

/**
 * Custom hook to load and manage the daily puzzle
 * Handles loading state, game state initialization, and hint index calculation
 *
 * Returns:
 * - dailyPuzzle: The loaded puzzle data (null while loading)
 * - gameState: Processed game state with category and answer
 * - hintIndex: Current hint index for the word
 * - isLoading: Boolean indicating if puzzle is still loading
 * - error: Any error that occurred during loading
 */
export const useDailyPuzzle = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [dailyPuzzle, setDailyPuzzle] = useState<DailyPuzzleSeed | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [gameState, setGameState] = useState<GameState>({
    category: "Loading...",
    originalCategory: "common" as WordCategory,
    answer: "LOADING" as WordId,
  });

  useEffect(() => {
    let mounted = true;

    const loadPuzzle = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const puzzle = await getTodaysPuzzle();

        if (mounted) {
          setDailyPuzzle(puzzle);

          // Initialize game state once puzzle is loaded
          const newGameState = initializeGame(puzzle.word);
          setGameState(newGameState);
        }
      } catch (err) {
        console.error("Failed to load daily puzzle:", err);
        if (mounted) {
          setError(err as Error);
        }
        // getTodaysPuzzle already has built-in fallback, so this shouldn't happen
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadPuzzle();

    return () => {
      mounted = false;
    };
  }, []);

  // Calculate hint index
  const hintIndex =
    dailyPuzzle?.word.category !== "common" && dailyPuzzle?.word.appearance
      ? dailyPuzzle.word.appearance.currentHintIndex
      : 0;

  return {
    dailyPuzzle,
    gameState,
    hintIndex,
    isLoading,
    error,
  };
};
