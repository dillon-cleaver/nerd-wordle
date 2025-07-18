import { WordCollection, UserWordCollections } from "@/types/word-collection";
import { WordId } from "@/types/word";

/**
 * Check if user has collected a specific word+edition
 */
export const hasCollectedWordEdition = (
  userCollections: UserWordCollections | undefined,
  wordId: WordId,
  edition: number
): boolean => {
  if (!userCollections) return false;

  return userCollections.collections.some(
    (c) => c.wordId === wordId && c.edition === edition
  );
};

/**
 * Get collection for a specific word+edition
 */
export const getWordCollection = (
  userCollections: UserWordCollections | undefined,
  wordId: WordId,
  edition: number
): WordCollection | undefined => {
  if (!userCollections) return undefined;

  return userCollections.collections.find(
    (c) => c.wordId === wordId && c.edition === edition
  );
};
