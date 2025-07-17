type PuzzleResult = {
  id: string;
  word: string;
  date: string;
  guesses: number;
  hintIndex: number;
  status: "win" | "fail";
};

export { PuzzleResult };
