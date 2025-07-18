import { getWordCollectionLocal } from "@/storage/word-collections.local";
import { loadPuzzleResultsLocal } from "@/storage/puzzle-results.local";
import { WordId } from "@/types/word";

/**
 * Get collection info for displaying on WordCard
 */
export const getWordCardCollectionInfo = (wordId: WordId, edition: number) => {
  const collection = getWordCollectionLocal(wordId, edition);

  if (!collection) {
    return {
      isCollected: false,
      firstCollectedDate: null,
      firstHintUsed: null,
      totalSolves: 0,
      lastSolvedDate: null,
      allSolves: [],
    };
  }

  // Get ALL successful solves for this word+edition from PuzzleResult
  const allPuzzleResults = loadPuzzleResultsLocal();
  const successfulSolves = allPuzzleResults.filter(
    (puzzle) =>
      puzzle.word === wordId &&
      puzzle.edition === edition &&
      puzzle.status === "win"
  );

  const sortedSolves = successfulSolves.sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  );

  return {
    isCollected: true,
    firstCollectedDate: collection.firstCollectedDate,
    firstHintUsed: sortedSolves[0]?.hintIndex ?? 0,
    totalSolves: successfulSolves.length,
    lastSolvedDate:
      sortedSolves[sortedSolves.length - 1]?.date ??
      collection.firstCollectedDate,
    allSolves: sortedSolves.map((puzzle) => ({
      date: puzzle.date,
      hintIndex: puzzle.hintIndex,
      guesses: puzzle.guesses,
    })),
  };
};
