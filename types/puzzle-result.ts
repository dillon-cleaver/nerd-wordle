import { WordId } from "./word";
import { LetterGuess } from "./letter-tracking";

type PuzzleId = string; // Format: "daily-YYYY-MM-DD" (e.g., "daily-2025-09-17")

type PuzzleStatus = "win" | "fail";

// A complete record of a single game session
type PuzzleResult = {
  readonly id: string;
  word: WordId;
  edition: number; // Edition of the word that was played
  date: Date;
  guesses: number; // Number of guesses in this game session (1-6 for Wordle)
  attempts: number; // Number of times this puzzle has been attempted (1 for first play, 2 for retry, etc.)
  hintIndex: number; // Which hint was shown during this session
  status: PuzzleStatus;
  letterTracking: LetterGuess[];
};

export { PuzzleId, PuzzleResult, PuzzleStatus };
