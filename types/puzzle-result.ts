import { WordId } from "./word";
type PuzzleStatus = "win" | "fail";

type PuzzleResult = {
  readonly id: string;
  word: WordId;
  date: Date;
  guesses: number;
  hintIndex: number;
  status: PuzzleStatus;
};

export { PuzzleResult, PuzzleStatus };
