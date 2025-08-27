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
    loadPuzzleResults,
    loading: historyLoading,
  } = usePuzzleHistory();
  const { dailyPuzzle, isLoading: puzzleLoading } = useDailyPuzzle();
  const [localResults, setLocalResults] = useState<PuzzleResult[]>([]);
  const [hasTriedLoadingBackend, setHasTriedLoadingBackend] = useState(false);

  // Load localStorage results immediately
  useEffect(() => {
    const localPuzzleResults = loadPuzzleResultsLocal();
    setLocalResults(localPuzzleResults);
  }, []);

  // Load backend results when user is authenticated and we haven't tried yet
  useEffect(() => {
    if (
      authUser &&
      !userLoading &&
      !historyLoading &&
      !hasTriedLoadingBackend
    ) {
      if (isDebugLoggingEnabled()) {
        console.log(
          "🔄 Loading puzzle history from backend for authenticated user"
        );
      }
      loadPuzzleResults(authUser)
        .then(() => {
          if (isDebugLoggingEnabled()) {
            console.log("✅ Backend puzzle history loaded successfully");
          }
          setHasTriedLoadingBackend(true);
        })
        .catch((error) => {
          if (isDebugLoggingEnabled()) {
            console.error("❌ Failed to load backend puzzle history:", error);
          }
          setHasTriedLoadingBackend(true); // Still mark as tried to avoid infinite retries
        });
    }
  }, [
    authUser,
    userLoading,
    historyLoading,
    hasTriedLoadingBackend,
    loadPuzzleResults,
  ]);

  // Reset the loading flag when user changes (logout/login)
  useEffect(() => {
    setHasTriedLoadingBackend(false);
  }, [authUser?.uid]);

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
        hasTriedLoadingBackend,
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
  }, [
    dailyPuzzle,
    puzzleLoading,
    localResults,
    backendResults,
    authUser,
    hasTriedLoadingBackend,
  ]);

  // Apply dev bypass logic - if bypass is enabled, never report as having played today
  const hasPlayedToday = canBypassDailyLock() ? false : !!todayResult;
  const isLoading =
    puzzleLoading ||
    userLoading ||
    (authUser && !hasTriedLoadingBackend && historyLoading);

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
