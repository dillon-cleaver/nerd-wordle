import { getWordCollectionLocal } from "@/storage/word-collections.local";
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
    };
  }

  const sortedSolves = collection.solveEvents.sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  );

  return {
    isCollected: true,
    firstCollectedDate: collection.firstSolvedDate,
    firstHintUsed: sortedSolves[0]?.hintIndex ?? 0,
    totalSolves: collection.solveEvents.length,
    lastSolvedDate:
      sortedSolves[sortedSolves.length - 1]?.date ?? collection.firstSolvedDate,
    allSolves: collection.solveEvents.map((event) => ({
      date: event.date,
      hintIndex: event.hintIndex,
      guesses: event.guesses,
    })),
  };
};
