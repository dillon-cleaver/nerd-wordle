type PuzzleResult = {
  id: string;
  word: string;
  date: string;
  attempts: number;
  status: "win" | "fail";
};

export { PuzzleResult };
