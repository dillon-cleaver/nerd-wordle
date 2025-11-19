import { WordId } from "@/types/word";
import { WordCollection, UserWordCollections } from "@/types/word-collection";
import {
  loadWordCollectionsLocal,
  saveWordCollectionsLocal,
  getWordCollectionLocal,
} from "@/storage/word-collections.local";
// import { getAuth } from "firebase/auth";
// TODO: Create API functions for word collections (similar to puzzleHistoryApi)
// import { wordCollectionsApi } from "@/utils/api";

export const addToCollection = async (
  wordId: WordId,
  edition: number,
  collectedDate: Date
): Promise<void> => {
  // Check if already collected
  const existing = await getWordCollectionLocal(wordId, edition);
  if (existing) {
    return; // Already have this word+edition
  }

  // Load current collections
  const currentCollections = await loadWordCollectionsLocal();

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

  // Save to localStorage for offline support
  await saveWordCollectionsLocal(updatedCollections);

  // TODO: Save to backend if user is authenticated
  // const user = getAuth().currentUser;
  // if (user) {
  //   try {
  //     await wordCollectionsApi.addToCollection(user, { wordId, edition, collectedDate });
  //     console.log('✅ Word collection saved to backend');
  //   } catch (error) {
  //     console.error('❌ Failed to save word collection to backend:', error);
  //     // Don't throw - we want the local save to succeed even if backend fails
  //   }
  // }
};

export const hasCollected = async (
  wordId: WordId,
  edition: number
): Promise<boolean> => {
  return (await getWordCollectionLocal(wordId, edition)) !== undefined;
};
