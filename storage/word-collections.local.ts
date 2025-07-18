import { WordCollection, UserWordCollections } from "@/types/word-collection";
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
      firstCollectedDate: new Date(collection.firstCollectedDate),
    })),
  };
};

export const saveWordCollectionsLocal = (
  collections: UserWordCollections
): void => {
  localStorage.setItem(WORD_COLLECTIONS_KEY, JSON.stringify(collections));
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
