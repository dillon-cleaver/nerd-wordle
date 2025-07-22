export type WinRecordRequest = {
  id: string;
  word: string;
  attempts: number;
  date: string;
  edition?: number;
  hintIndex?: number;
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
