import { useMemo, useEffect, useState, useContext } from "react";
import { usePuzzleHistory } from "@/context/PuzzleHistoryContext";
import { useDailyPuzzle } from "./useDailyPuzzle";
import { getTodayDateString, getDateString } from "@/utils/time";
import { loadPuzzleResultsLocal } from "@/storage/puzzle-results.local";
import { UserContext } from "@/context/UserContext";
import { PuzzleResult } from "@/types/puzzle-result";
import { canBypassDailyLock, isDebugLoggingEnabled } from "@/utils/dev-flags";

/**
 * Hook to check if the user has already completed today's puzzle
 * Returns the puzzle result if they have, or null if they haven't
 * Checks both localStorage (for offline access) and backend (for authenticated users)
 */
export const useTodaysPuzzleResult = () => {
  const { authUser, loading: userLoading } = useContext(UserContext);
  const {
    puzzleResults: backendResults,
    autoLoadResults,
    loading: historyLoading,
  } = usePuzzleHistory();
  const { dailyPuzzle, isLoading: puzzleLoading } = useDailyPuzzle();
  const [localResults, setLocalResults] = useState<PuzzleResult[]>([]);

  // Load localStorage results immediately and when puzzle results change
  useEffect(() => {
    const localPuzzleResults = loadPuzzleResultsLocal();
    setLocalResults(localPuzzleResults);
  }, []);

  // Also refresh localStorage when backend results change (in case context saved to backend)
  useEffect(() => {
    const refreshLocalResults = () => {
      const localPuzzleResults = loadPuzzleResultsLocal();
      setLocalResults(localPuzzleResults);
    };

    // Small delay to allow any pending localStorage writes to complete
    const timer = setTimeout(refreshLocalResults, 100);
    return () => clearTimeout(timer);
  }, [backendResults]);

  // Ensure backend results are loaded for authenticated users
  useEffect(() => {
    autoLoadResults(authUser, userLoading);
  }, [authUser, userLoading, autoLoadResults]);

  // Reset handled by autoLoadResults internally

  const todayResult = useMemo(() => {
    if (!dailyPuzzle || puzzleLoading) {
      return null;
    }

    const today = getTodayDateString();
    const todaysPuzzleWord = dailyPuzzle.word.id;

    if (isDebugLoggingEnabled()) {
      console.log("🔍 Checking for today's puzzle result:", {
        today,
        puzzleWord: todaysPuzzleWord,
        hasLocalResults: localResults.length > 0,
        hasBackendResults: backendResults.length > 0,
        isAuthenticated: !!authUser,
        canBypassDaily: canBypassDailyLock(),
      });
    }

    // Check localStorage results first (immediate access)
    const localResult = localResults.find((result) => {
      const resultDate = getDateString(new Date(result.date));
      const matches = result.word === todaysPuzzleWord && resultDate === today;
      if (matches && isDebugLoggingEnabled()) {
        console.log("✅ Found local result for today:", result);
      }
      return matches;
    });

    if (localResult) {
      // Convert localStorage format to match expected format
      return {
        id: localResult.id,
        word: localResult.word,
        guesses: localResult.guesses, // Number of guesses in this game session
        attempts: localResult.attempts, // Number of times this puzzle has been attempted
        date:
          localResult.date instanceof Date
            ? localResult.date.toISOString()
            : localResult.date,
        status: (localResult.status === "fail"
          ? "loss"
          : localResult.status) as "win" | "loss",
        edition: localResult.edition,
        hintIndex: localResult.hintIndex,
        source: "localStorage",
      };
    }

    // If no local result and user is authenticated, check backend results
    if (authUser && backendResults.length > 0) {
      const backendResult = backendResults.find((result) => {
        const resultDate = getDateString(new Date(result.date));
        const matches =
          result.word === todaysPuzzleWord && resultDate === today;
        if (matches && isDebugLoggingEnabled()) {
          console.log("✅ Found backend result for today:", result);
        }
        return matches;
      });

      if (backendResult) {
        return {
          ...backendResult,
          date: backendResult.date,
          source: "backend",
        };
      }
    }

    if (isDebugLoggingEnabled()) {
      console.log("❌ No result found for today's puzzle");
    }
    return null;
  }, [dailyPuzzle, puzzleLoading, localResults, backendResults, authUser]);

  // Apply dev bypass logic - if bypass is enabled, never report as having played today
  const hasPlayedToday = canBypassDailyLock() ? false : !!todayResult;
  const isLoading =
    puzzleLoading || userLoading || (authUser && historyLoading);

  if (isDebugLoggingEnabled()) {
    console.log("🎮 useTodaysPuzzleResult state:", {
      hasPlayedToday,
      isLoading,
      resultSource: todayResult?.source,
      userAuthenticated: !!authUser,
      bypassEnabled: canBypassDailyLock(),
    });
  }

  return {
    hasPlayedToday,
    todayResult,
    isLoading,
  };
};
