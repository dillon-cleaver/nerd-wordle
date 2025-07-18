import { WordId } from "./word";

type PuzzleStatus = "win" | "fail";

// A complete record of a single game session
type PuzzleResult = {
  readonly id: string;
  word: WordId;
  edition: number; // Edition of the word that was played
  date: Date;
  guesses: number;
  hintIndex: number; // Which hint was shown during this session
  status: PuzzleStatus;
};

export { PuzzleResult, PuzzleStatus };
