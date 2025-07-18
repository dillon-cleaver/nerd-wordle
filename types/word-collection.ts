import { WordId } from "./word";

// A single solve event for a word (success only)
type WordSolveEvent = {
  date: Date;
  hintIndex: number; // Which hint they used when they solved it
  guesses: number;
  puzzleResultId?: string; // Reference back to the PuzzleResult
};

// Tracks a user's relationship with a specific word+edition
type WordCollection = {
  wordId: WordId;
  edition: number;
  solveEvents: WordSolveEvent[]; // All times they solved this word+edition
  firstSolvedDate: Date; // When they first collected it
};

// User's complete word collection state
type UserWordCollections = {
  collections: WordCollection[];
  totalWordsCollected: number; // How many unique word+edition combos collected
  lastUpdated: Date;
};

export { WordCollection, WordSolveEvent, UserWordCollections };
