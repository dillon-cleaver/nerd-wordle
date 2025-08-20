import { useMemo, useEffect, useState, useContext } from "react";
import { usePuzzleHistory } from "@/context/PuzzleHistoryContext";
import { useDailyPuzzle } from "./useDailyPuzzle";
import { getTodayDateString, getDateString } from "@/utils/time";
import { loadPuzzleResultsLocal } from "@/storage/puzzle-results.local";
import { UserContext } from "@/context/UserContext";

/**
 * Hook to check if the user has already completed today's puzzle
 * Returns the puzzle result if they have, or null if they haven't
 * Checks both localStorage (for offline access) and backend (for authenticated users)
 */
export const useTodaysPuzzleResult = () => {
  const { authUser } = useContext(UserContext);
  const { puzzleResults: backendResults } = usePuzzleHistory();
  const { dailyPuzzle, isLoading: puzzleLoading } = useDailyPuzzle();
  const [localResults, setLocalResults] = useState<any[]>([]);

  // Load localStorage results immediately
  useEffect(() => {
    const localPuzzleResults = loadPuzzleResultsLocal();
    setLocalResults(localPuzzleResults);
  }, []);

  const todayResult = useMemo(() => {
    if (!dailyPuzzle || puzzleLoading) {
      return null;
    }

    const today = getTodayDateString();
    const todaysPuzzleWord = dailyPuzzle.word.id;

    // Check localStorage results first (immediate access)
    const localResult = localResults.find((result) => {
      const resultDate = getDateString(new Date(result.date));
      return result.word === todaysPuzzleWord && resultDate === today;
    });

    if (localResult) {
      // Convert localStorage format to match expected format
      return {
        id: localResult.id,
        word: localResult.word,
        attempts: localResult.guesses, // localStorage uses 'guesses', API uses 'attempts'
        date: localResult.date,
        status: localResult.status === "fail" ? "loss" : localResult.status,
        edition: localResult.edition,
        hintIndex: localResult.hintIndex,
      };
    }

    // If no local result and user is authenticated, check backend results
    if (authUser && backendResults.length > 0) {
      const backendResult = backendResults.find((result) => {
        const resultDate = getDateString(new Date(result.date));
        return result.word === todaysPuzzleWord && resultDate === today;
      });

      if (backendResult) {
        return backendResult;
      }
    }

    return null;
  }, [dailyPuzzle, puzzleLoading, localResults, backendResults, authUser]);

  const hasPlayedToday = !!todayResult;
  const isLoading = puzzleLoading;

  return {
    hasPlayedToday,
    todayResult,
    isLoading,
  };
};
