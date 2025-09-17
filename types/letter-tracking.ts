import { PuzzleId } from "./puzzle-result";

export type LetterGuess = {
  letter: string;
  row: number;
  position: number;
  timestamp: Date;
};

export type LetterTrackingData = {
  puzzleId: PuzzleId;
  date: string;
  guesses: LetterGuess[];
  lastUpdated: Date;
};
