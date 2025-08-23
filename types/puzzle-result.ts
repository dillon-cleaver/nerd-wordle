import { WordId } from "./word";

type PuzzleStatus = "win" | "fail";

// TODO: CRITICAL - Type inconsistency with API
// This frontend type uses 'guesses: number' while the API type in utils/api.ts uses 'attempts: number'
// Both represent the same concept (number of guesses to solve puzzle) but different property names
// This causes 'as any' casts throughout codebase. Consider:
// 1. Unifying the types to use the same property name
// 2. Creating proper union types
// 3. Using discriminated unions or branded types
// A complete record of a single game session
type PuzzleResult = {
  readonly id: string;
  word: WordId;
  edition: number; // Edition of the word that was played
  date: Date;
  guesses: number; // Number of guesses it took to solve (API uses 'attempts' for same data)
  hintIndex: number; // Which hint was shown during this session
  status: PuzzleStatus;
};

export { PuzzleResult, PuzzleStatus };
