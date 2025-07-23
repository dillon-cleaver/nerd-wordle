export type PuzzleResultRequest = {
  id: string;
  word: string;
  attempts: number;
  date: string;
  status: "win" | "loss";
  edition?: number;
  hintIndex?: number;
};

export type PuzzleResultResponse = {
  message: string;
  data: PuzzleResultRequest;
};

export type PuzzleHistoryResponse = {
  results: PuzzleResultRequest[];
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
