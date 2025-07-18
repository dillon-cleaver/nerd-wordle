import { WordId } from "./word";

// Just tracks that a user has collected a specific word+edition
type WordCollection = {
  wordId: WordId;
  edition: number;
  firstCollectedDate: Date; // When they first got it
  // That's it! All solve history lives in PuzzleResult
};

// User's complete collection state
type UserWordCollections = {
  collections: WordCollection[];
  totalWordsCollected: number; // Derived: collections.length
  lastUpdated: Date;
};

export { WordCollection, UserWordCollections };
