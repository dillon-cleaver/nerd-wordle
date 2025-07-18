import {
  WordCollection,
  WordSolveEvent,
  UserWordCollections,
} from "@/types/word-collection";
import { WordId } from "@/types/word";

const WORD_COLLECTIONS_KEY = "wordCollections_v1";

export const loadWordCollectionsLocal = (): UserWordCollections => {
  const stored = localStorage.getItem(WORD_COLLECTIONS_KEY);
  if (!stored) {
    return {
      collections: [],
      totalWordsCollected: 0,
      lastUpdated: new Date(),
    };
  }

  const parsed = JSON.parse(stored);
  // Convert date strings back to Date objects
  return {
    ...parsed,
    lastUpdated: new Date(parsed.lastUpdated),
    collections: parsed.collections.map((collection: any) => ({
      ...collection,
      firstSolvedDate: new Date(collection.firstSolvedDate),
      solveEvents: collection.solveEvents.map((event: any) => ({
        ...event,
        date: new Date(event.date),
      })),
    })),
  };
};

export const saveWordCollectionsLocal = (
  collections: UserWordCollections
): void => {
  localStorage.setItem(WORD_COLLECTIONS_KEY, JSON.stringify(collections));
};

export const addWordCollectionEventLocal = (
  wordId: WordId,
  edition: number,
  solveEvent: WordSolveEvent
): void => {
  const existing = loadWordCollectionsLocal();

  // Find existing collection for this word+edition
  const collectionIndex = existing.collections.findIndex(
    (c) => c.wordId === wordId && c.edition === edition
  );

  let updatedCollections: WordCollection[];

  if (collectionIndex >= 0) {
    // Add to existing collection
    const existingCollection = existing.collections[collectionIndex];
    const updatedCollection: WordCollection = {
      ...existingCollection,
      solveEvents: [...existingCollection.solveEvents, solveEvent],
    };

    updatedCollections = [...existing.collections];
    updatedCollections[collectionIndex] = updatedCollection;
  } else {
    // Create new collection
    const newCollection: WordCollection = {
      wordId,
      edition,
      solveEvents: [solveEvent],
      firstSolvedDate: solveEvent.date,
    };

    updatedCollections = [...existing.collections, newCollection];
  }

  const updatedUserCollections: UserWordCollections = {
    collections: updatedCollections,
    totalWordsCollected: updatedCollections.length,
    lastUpdated: new Date(),
  };

  saveWordCollectionsLocal(updatedUserCollections);
};

export const getWordCollectionLocal = (
  wordId: WordId,
  edition: number
): WordCollection | undefined => {
  const collections = loadWordCollectionsLocal();
  return collections.collections.find(
    (c) => c.wordId === wordId && c.edition === edition
  );
};
