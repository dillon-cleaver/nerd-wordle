import { useCallback, useEffect, useState } from "react";
import { User } from "firebase/auth";
import { LetterGuess } from "@/types/letter-tracking";
import { PuzzleResult, PuzzleId } from "@/types/puzzle-result"; // Use frontend type with letterTracking
import { loadPuzzleResultsLocal } from "@/storage/puzzle-results.local";
import { getActivePuzzleLetterGuesses } from "@/storage/active-puzzle.local";
import { usePuzzleHistory } from "@/context/PuzzleHistoryContext";
import { isPuzzleHistoryDebugEnabled } from "@/utils/dev-flags";
import { getDateString } from "@/utils/time";
import { extractDateFromPuzzleId } from "@/utils/puzzle-id";

/**
 * Hook to read letter tracking data from puzzle results instead of separate storage.
 * This replaces the separate letter tracking storage with data nested in puzzle results.
 */
export const useLetterTrackingFromPuzzleResults = (
  puzzleId: PuzzleId | undefined,
  authUser: User | null
) => {
  const [letterGuesses, setLetterGuesses] = useState<LetterGuess[]>([]);
  const [loading, setLoading] = useState(true);

  // Get puzzle results from context (includes backend data for authenticated users)
  // Note: Backend results use API type without letterTracking, local results use frontend type
  const { puzzleResults: backendResults, loading: historyLoading } =
    usePuzzleHistory();

  useEffect(() => {
    const loadLetterTracking = async () => {
      try {
        setLoading(true);

        // Don't try to load if we don't have a puzzle ID yet
        if (!puzzleId) {
          setLetterGuesses([]);
          return;
        }

        // Extract date from puzzle ID (e.g., "daily-2025-08-26" -> "2025-08-26")
        const puzzleDate = extractDateFromPuzzleId(puzzleId);

        if (!puzzleDate) {
          // Invalid puzzle ID format, no letter tracking to load
          setLetterGuesses([]);
          return;
        }

        if (isPuzzleHistoryDebugEnabled()) {
          console.log("🔍 Loading letter tracking for puzzle:", {
            puzzleId,
            puzzleDate,
            authUser: !!authUser,
            backendResultsCount: backendResults.length,
            historyLoading,
          });
        }

        // First, check for active (in-progress) puzzle state
        const activePuzzleLetters = getActivePuzzleLetterGuesses(puzzleId);
        if (activePuzzleLetters.length > 0) {
          if (isPuzzleHistoryDebugEnabled()) {
            console.log("✅ Found active puzzle state:", {
              puzzleId,
              letterCount: activePuzzleLetters.length,
              rows: Math.ceil(activePuzzleLetters.length / 5),
            });
          }
          setLetterGuesses(activePuzzleLetters);
          return;
        }

        // If no active puzzle state, check completed puzzle results
        let allResults: PuzzleResult[] = [];

        // Load local results (these have letterTracking field)
        const localResults = loadPuzzleResultsLocal();
        allResults.push(...localResults);

        // Add backend results if available
        if (backendResults.length > 0) {
          allResults.push(...backendResults);
        }

        if (isPuzzleHistoryDebugEnabled()) {
          console.log("📊 All puzzle results loaded:", {
            localCount: localResults.length,
            backendCount: backendResults.length,
            totalCount: allResults.length,
          });
        }

        // Find puzzle result for this date
        const matchingResult = allResults.find((result) => {
          if (!result.date) return false;

          // Convert result date to Central Time for proper comparison with puzzleDate
          const resultDate = getDateString(new Date(result.date));

          const matches = resultDate === puzzleDate;

          if (isPuzzleHistoryDebugEnabled()) {
            console.log("🔍 SYNC DEBUG - Date comparison:", {
              resultDate,
              puzzleDate,
              rawDate: result.date,
              dateType: typeof result.date,
              isDateObject: result.date instanceof Date,
              matches,
              status: result.status,
              word: result.word,
              hasLetterTracking: !!result.letterTracking?.length,
            });
          }

          if (matches && isPuzzleHistoryDebugEnabled()) {
            console.log("✅ Found matching puzzle result:", {
              resultDate,
              puzzleDate,
              letterTrackingCount: result.letterTracking?.length || 0,
              status: result.status,
            });
          }
          return matches;
        });

        // Extract letter tracking data from puzzle result
        const letters = matchingResult?.letterTracking || [];
        if (isPuzzleHistoryDebugEnabled()) {
          console.log("📝 Setting letter guesses:", letters.length, "letters");
        }
        setLetterGuesses(letters);
      } catch (error) {
        console.error(
          "Error loading letter tracking from puzzle results:",
          error
        );
        setLetterGuesses([]);
      } finally {
        setLoading(false);
      }
    };

    // Wait for user loading to complete and backend results to be available
    // This ensures we have all the data we need before trying to load
    if (!historyLoading) {
      loadLetterTracking();
    }
  }, [puzzleId, authUser, backendResults, historyLoading]);

  // Helper functions for letter tracking queries
  const getGuessesForRow = useCallback(
    (row: number) => {
      return letterGuesses.filter((guess) => guess.row === row);
    },
    [letterGuesses]
  );

  const hasLetterBeenGuessed = useCallback(
    (letter: string) => {
      return letterGuesses.some(
        (guess) => guess.letter === letter.toUpperCase()
      );
    },
    [letterGuesses]
  );

  const getFirstRowForLetter = useCallback(
    (letter: string) => {
      const guess = letterGuesses.find(
        (guess) => guess.letter === letter.toUpperCase()
      );
      return guess ? guess.row : null;
    },
    [letterGuesses]
  );

  const getGuessedLetters = useCallback(() => {
    return Array.from(new Set(letterGuesses.map((guess) => guess.letter)));
  }, [letterGuesses]);

  return {
    letterGuesses,
    loading,
    getGuessesForRow,
    hasLetterBeenGuessed,
    getFirstRowForLetter,
    getGuessedLetters,
  };
};
