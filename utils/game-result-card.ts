import { CollectedWord } from "@/hooks/useCollectedWords";
import { NerdWordEntry, WordEntry } from "@/types/word";

/**
 * Build a WordCard-compatible payload from today's answer without writing to
 * the user's collection. Used by the win/loss result modal.
 */
export const buildResultCardWord = (
  answerEntry: WordEntry,
  guesses: number,
  hintIndex = 0,
  completedDate: Date = new Date()
): CollectedWord | null => {
  if (answerEntry.category === "common") {
    return null;
  }

  const nerdWordEntry = answerEntry as NerdWordEntry;

  return {
    id: `result-${nerdWordEntry.id}`,
    wordEntry: nerdWordEntry,
    category: nerdWordEntry.category,
    completedDate,
    guesses,
    attempts: 1,
    editionNumber: nerdWordEntry.edition,
    hintIndex,
  };
};
