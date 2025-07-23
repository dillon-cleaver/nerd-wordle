// Utility functions to convert between domain and API types
import { PuzzleResultRequest } from "./types";
import { PuzzleResult } from "../../types/puzzle-result";

export const puzzleResultToApiRequest = (
  result: PuzzleResult
): PuzzleResultRequest => ({
  id: result.id,
  word: result.word,
  attempts: result.guesses,
  date: result.date.toISOString(),
  status: result.status === "fail" ? "loss" : result.status,
  edition: result.edition,
  hintIndex: result.hintIndex,
});

export const apiRequestToPuzzleResult = (
  record: PuzzleResultRequest
): Omit<PuzzleResult, "status"> => ({
  id: record.id,
  word: record.word,
  edition: record.edition || 1,
  date: new Date(record.date),
  guesses: record.attempts,
  hintIndex: record.hintIndex || 0,
});
