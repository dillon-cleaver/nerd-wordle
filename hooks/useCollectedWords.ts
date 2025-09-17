import { useState, useEffect, useContext, useMemo } from "react";
import { usePuzzleHistory } from "@/context/PuzzleHistoryContext";
import { useWordData } from "@/context/WordDataContext";
import { UserContext } from "@/context/UserContext";
import { loadPuzzleResultsLocal } from "@/storage/puzzle-results.local";
import { NerdWordEntry, WordCategory } from "@/types/word";
import { PuzzleResult } from "@/types/puzzle-result";

export type CollectedWord = {
  id: string;
  wordEntry: NerdWordEntry;
  category: Exclude<WordCategory, "common">;
  completedDate: Date;
  guesses: number; // Number of guesses it took to solve this puzzle
  attempts: number; // Number of times this puzzle has been attempted
  editionNumber: number;
  hintIndex: number;
};

export const useCollectedWords = () => {
  const { authUser, loading: userLoading } = useContext(UserContext);
  const {
    puzzleResults: backendResults,
    loading: historyLoading,
    autoLoadResults,
  } = usePuzzleHistory();
  const { getWordEntry, isLoading: wordsLoading } = useWordData();
  const [localResults, setLocalResults] = useState<PuzzleResult[]>([]);

  // Load localStorage results once
  useEffect(() => {
    setLocalResults(loadPuzzleResultsLocal());
  }, []);

  // Ensure backend results are loaded for authenticated users
  useEffect(() => {
    autoLoadResults(authUser, userLoading);
  }, [authUser, userLoading, autoLoadResults]);

  const collectedWords = useMemo(() => {
    if (wordsLoading) return [];

    // Prefer backend when authenticated, but merge with local to include
    // any unsynced or offline results. De-duplicate by id.
    const allResultsMap = new Map<string, PuzzleResult>();
    const addAll = (arr: PuzzleResult[]) =>
      arr.forEach((r) => allResultsMap.set(r.id, r));
    if (authUser) addAll(backendResults);
    addAll(localResults);
    const allResults = Array.from(allResultsMap.values());

    return allResults
      .filter((result) => result.status === "win")
      .map((result) => {
        const wordEntry = getWordEntry(result.word);
        // Skip if word not found or is a common word (common words aren't "collected")
        if (!wordEntry || wordEntry.category === "common") return null;

        const nerdWordEntry = wordEntry as NerdWordEntry;
        const completedDate =
          typeof result.date === "string" ? new Date(result.date) : result.date;

        return {
          id: result.id,
          wordEntry: nerdWordEntry,
          category: nerdWordEntry.category,
          completedDate,
          guesses: result.guesses, // Number of guesses in this game session
          attempts: result.attempts, // Number of times this puzzle has been attempted
          editionNumber: result.edition || 1,
          hintIndex: result.hintIndex || 0,
        };
      })
      .filter((word): word is CollectedWord => word !== null)
      .sort((a, b) => b.completedDate.getTime() - a.completedDate.getTime());
  }, [localResults, backendResults, authUser, getWordEntry, wordsLoading]);

  const loading = wordsLoading || userLoading || (authUser && historyLoading);

  return {
    collectedWords,
    loading,
    error: null,
  };
};
