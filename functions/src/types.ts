// TODO: PRODUCTION - Migrate to tRPC for end-to-end type safety
// Current types are duplicated between frontend (/types/*) and backend
// tRPC would eliminate duplication and provide automatic type inference

// Letter tracking types for backend
export type LetterGuess = {
  letter: string;
  row: number;
  position: number;
  timestamp: Date;
};

export type PuzzleResultRequest = {
  id: string;
  word: string;
  guesses: number; // Number of guesses in this game session (1-6 for Wordle)
  attempts: number; // Number of times this puzzle has been attempted (1 for first play, 2 for retry, etc.)
  date: string;
  status: "win" | "loss";
  edition?: number;
  hintIndex?: number;
  letterTracking: LetterGuess[]; // Required letter tracking data
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

// Word and Daily Puzzle types for API
export type WordCategory =
  | "common"
  | "movies"
  | "literature"
  | "fantasyAndSciFi"
  | "science"
  | "videoGames"
  | "animeAndManga"
  | "tabletopAndBoardGames"
  | "techAndInternetCulture"
  | "superheroes";

export type WordAppearance = {
  timesShown: number;
  firstShownDate: Date;
  currentHintIndex: number;
  lastHintRotation?: Date;
};

export type CommonWordEntry = {
  id: string;
  category: "common";
};

export type NerdWordEntry = {
  id: string;
  category: Exclude<WordCategory, "common">;
  edition: number;
  hints: string[];
  summary: string;
  wikipediaUrl: string;
  appearance?: WordAppearance;
  alpha?: boolean; // Mark word as available in alpha testing
  beta?: boolean; // Mark word as available in beta testing
};

export type WordEntry = CommonWordEntry | NerdWordEntry;

export type DailyPuzzleSeed = {
  date: string; // ISO (YYYY-MM-DD)
  word: WordEntry;
};

// API Response types
// REMOVED: WordsResponse - no longer needed with bundle-first approach

export type WordResponse = {
  word: WordEntry;
};

export type DailyPuzzleResponse = {
  puzzle: DailyPuzzleSeed;
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
