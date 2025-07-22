import { WordId } from "./word";

// API request/response types that align with existing domain types
export type WinRecordRequest = {
  id: string; // PuzzleResult.id
  word: WordId; // PuzzleResult.word
  attempts: number; // PuzzleResult.guesses (renamed for API clarity)
  date: string; // ISO string version of PuzzleResult.date
  edition?: number; // PuzzleResult.edition (optional for backwards compatibility)
  hintIndex?: number; // PuzzleResult.hintIndex (optional)
};

export type WinRecordResponse = {
  message: string;
  data: WinRecordRequest;
};

export type WinHistoryResponse = {
  wins: WinRecordRequest[];
  count: number;
};

export type ApiError = {
  error: string;
};

// Express middleware types for functions
declare global {
  namespace Express {
    interface Request {
      user?: {
        uid: string;
      };
    }
  }
}
