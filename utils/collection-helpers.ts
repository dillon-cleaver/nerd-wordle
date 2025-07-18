import { WordId } from "@/types/word";
import { WordCollection, UserWordCollections } from "@/types/word-collection";
import {
  loadWordCollectionsLocal,
  saveWordCollectionsLocal,
  getWordCollectionLocal,
} from "@/storage/word-collections.local";

export const addToCollection = (
  wordId: WordId,
  edition: number,
  collectedDate: Date
): void => {
  // Check if already collected
  const existing = getWordCollectionLocal(wordId, edition);
  if (existing) {
    return; // Already have this word+edition
  }

  // Load current collections
  const currentCollections = loadWordCollectionsLocal();

  // Create new collection entry
  const newCollection: WordCollection = {
    wordId,
    edition,
    firstCollectedDate: collectedDate,
  };

  // Create updated collections object
  const updatedCollections: UserWordCollections = {
    collections: [...currentCollections.collections, newCollection],
    totalWordsCollected: currentCollections.collections.length + 1,
    lastUpdated: new Date(), // Update this timestamp
  };

  // Save to localStorage
  saveWordCollectionsLocal(updatedCollections);
};

export const hasCollected = (wordId: WordId, edition: number): boolean => {
  return getWordCollectionLocal(wordId, edition) !== undefined;
};
