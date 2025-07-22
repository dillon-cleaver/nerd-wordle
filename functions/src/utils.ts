// Utility functions to convert between domain and API types
import { WinRecordRequest } from "./types";
import { PuzzleResult } from "../../types/puzzle-result";

export const puzzleResultToWinRecord = (
  result: PuzzleResult
): WinRecordRequest => ({
  id: result.id,
  word: result.word,
  attempts: result.guesses,
  date: result.date.toISOString(),
  edition: result.edition,
  hintIndex: result.hintIndex,
});

export const winRecordToPuzzleResult = (
  record: WinRecordRequest
): Omit<PuzzleResult, "status"> => ({
  id: record.id,
  word: record.word,
  edition: record.edition || 1,
  date: new Date(record.date),
  guesses: record.attempts,
  hintIndex: record.hintIndex || 0,
});
