import AsyncStorage from "@react-native-async-storage/async-storage";
import { WordCollection, UserWordCollections } from "@/types/word-collection";
import { WordId } from "@/types/word";

const WORD_COLLECTIONS_KEY = "wordCollections_v1";

export const loadWordCollectionsLocal =
  async (): Promise<UserWordCollections> => {
    try {
      const stored = await AsyncStorage.getItem(WORD_COLLECTIONS_KEY);
      if (!stored) {
        return {
          collections: [],
          totalWordsCollected: 0,
          lastUpdated: new Date(),
        };
      }

      const parsed = JSON.parse(stored) as UserWordCollections;
      // Convert date strings back to Date objects
      return {
        ...parsed,
        lastUpdated: new Date(parsed.lastUpdated),
        collections: parsed.collections.map((collection: WordCollection) => ({
          ...collection,
          firstCollectedDate: new Date(collection.firstCollectedDate),
        })),
      };
    } catch (error) {
      console.error(
        "Failed to parse word collections from AsyncStorage:",
        error
      );
      // Return default structure on error
      return {
        collections: [],
        totalWordsCollected: 0,
        lastUpdated: new Date(),
      };
    }
  };

export const saveWordCollectionsLocal = async (
  collections: UserWordCollections
): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      WORD_COLLECTIONS_KEY,
      JSON.stringify(collections)
    );
  } catch (error) {
    console.error("Failed to save word collections to AsyncStorage:", error);
  }
};

export const getWordCollectionLocal = async (
  wordId: WordId,
  edition: number
): Promise<WordCollection | undefined> => {
  const collections = await loadWordCollectionsLocal();
  return collections.collections.find(
    (c) => c.wordId === wordId && c.edition === edition
  );
};
