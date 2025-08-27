import { LetterGuess } from "@/types/letter-tracking";
import { WordEntry } from "@/types/word";
import { DailyPuzzleSeed } from "@/utils/daily-puzzle";

export type BackendLetterGuess = Omit<LetterGuess, "timestamp"> & {
  timestamp: string;
};

export type BackendPuzzleResult = {
  id: string;
  word: string;
  guesses: number;
  attempts: number;
  date: string;
  status: "win" | "loss";
  edition?: number;
  hintIndex?: number;
  letterTracking: BackendLetterGuess[];
};

export type PuzzleHistoryResponse = {
  results: BackendPuzzleResult[];
};

export type WordsResponse = {
  words: WordEntry[];
  count: number;
};

export type WordResponse = {
  word: WordEntry;
};

export type DailyPuzzleResponse = {
  puzzle: DailyPuzzleSeed;
};
