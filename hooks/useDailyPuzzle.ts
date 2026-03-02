import { useState, useEffect } from "react";
import {
  getTodaysPuzzle,
  DailyPuzzleSeed,
  loadCachedPuzzleForDate,
} from "@/utils/daily-puzzle";
import { convertCategory } from "@/utils/game";
import { WordCategory, WordId } from "@/types/word";
import { getTodayDateString } from "@/utils/time";

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
    const today = getTodayDateString();

    const applyPuzzleToState = (puzzle: DailyPuzzleSeed) => {
      setDailyPuzzle(puzzle);
      setGameState({
        category: convertCategory(puzzle.word.category),
        originalCategory: puzzle.word.category,
        answer: puzzle.word.id,
      });
    };

    const loadPuzzle = async () => {
      let hasPuzzle = false;
      try {
        setIsLoading(true);
        setError(null);

        // Fast-path: show cached puzzle immediately for the current day
        const cachedPuzzle = await loadCachedPuzzleForDate(today);
        if (cachedPuzzle && mounted) {
          hasPuzzle = true;
          applyPuzzleToState(cachedPuzzle);
        }

        // Always revalidate with backend to ensure correctness
        const freshPuzzle = await getTodaysPuzzle();
        if (mounted) {
          hasPuzzle = true;
          applyPuzzleToState(freshPuzzle);
        }
      } catch (err) {
        console.error("Failed to load daily puzzle:", err);
        if (mounted && !hasPuzzle) {
          setError(err as Error);
        }
        if (mounted && hasPuzzle) {
          // Allow cached puzzle to render if network failed
          setIsLoading(false);
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
