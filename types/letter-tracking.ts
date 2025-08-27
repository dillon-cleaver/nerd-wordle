export type LetterGuess = {
  letter: string;
  row: number;
  position: number;
  timestamp: Date;
};

export type LetterTrackingData = {
  puzzleId: string;
  date: string;
  guesses: LetterGuess[];
  lastUpdated: Date;
};
