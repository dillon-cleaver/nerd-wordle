import { useCallback, useEffect, useState } from "react";
import { User } from "firebase/auth";
import { LetterGuess } from "@/types/letter-tracking";
import { PuzzleResult } from "@/types/puzzle-result"; // Use frontend type with letterTracking
import { loadPuzzleResultsLocal } from "@/storage/puzzle-results.local";
import { usePuzzleHistory } from "@/context/PuzzleHistoryContext";

/**
 * Hook to read letter tracking data from puzzle results instead of separate storage.
 * This replaces the separate letter tracking storage with data nested in puzzle results.
 */
export const useLetterTrackingFromPuzzleResults = (
  puzzleId: string,
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

        // Extract date from puzzle ID (e.g., "daily-2025-08-26" -> "2025-08-26")
        const puzzleDate = puzzleId.replace("daily-", "");

        let allResults: PuzzleResult[] = [];

        // Load local results (these have letterTracking field)
        const localResults = loadPuzzleResultsLocal();
        allResults.push(...localResults);

        // Note: Backend results from API don't include letterTracking field yet
        // TODO: Update backend API to support letterTracking field
        // For now, only local results will have letter tracking data

        // Find puzzle result for this date
        const matchingResult = allResults.find((result) => {
          if (!result.date) return false;

          // Handle both Date objects and string dates
          const resultDate =
            result.date instanceof Date
              ? result.date.toISOString().split("T")[0]
              : new Date(result.date).toISOString().split("T")[0];

          return resultDate === puzzleDate;
        });

        // Extract letter tracking data from puzzle result
        const letters = matchingResult?.letterTracking || [];
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

    if (puzzleId) {
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
