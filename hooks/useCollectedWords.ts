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
  attempts: number;
  editionNumber: number;
  hintIndex: number;
};

export const useCollectedWords = () => {
  const { authUser, loading: userLoading } = useContext(UserContext);
  const { puzzleResults: backendResults, loading: historyLoading } =
    usePuzzleHistory();
  const { getWordEntry, isLoading: wordsLoading } = useWordData();
  const [localResults, setLocalResults] = useState<PuzzleResult[]>([]);

  // Load localStorage results once
  useEffect(() => {
    setLocalResults(loadPuzzleResultsLocal());
  }, []);

  const collectedWords = useMemo(() => {
    if (wordsLoading) return [];

    // Use backend results if authenticated, otherwise use local
    const allResults = authUser ? backendResults : localResults;

    return allResults
      .filter((result) => result.status === "win")
      .map((result) => {
        const wordEntry = getWordEntry(result.word);
        // Skip if word not found or is a common word (common words aren't "collected")
        if (!wordEntry || wordEntry.category === "common") return null;

        const nerdWordEntry = wordEntry as NerdWordEntry;
        const completedDate =
          typeof result.date === "string" ? new Date(result.date) : result.date;
        // TODO: Fix type inconsistency - Local storage uses 'guesses', API uses 'attempts' for same data
        // Consider unifying types or creating a proper union type instead of 'as any'
        const attempts =
          "guesses" in result ? result.guesses : (result as any).attempts;

        return {
          id: result.id,
          wordEntry: nerdWordEntry,
          category: nerdWordEntry.category,
          completedDate,
          attempts,
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
