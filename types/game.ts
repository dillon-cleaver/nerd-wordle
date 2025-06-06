import { Word, WordCategory } from "@/constants/words";

type GameStatus = "won" | "running" | "lost";

type Hint =
  | {
      row: number;
      col: number;
      letter: string;
    }
  | undefined;

type GameState = {
  category: string;
  originalCategory: WordCategory;
  answer: Word;
};

type GameStateUpdaters = {
  setGuesses: (guesses: Word[]) => void;
  setTentativeGuess: (guess: string) => void;
  setInvalidWord: (invalid: boolean) => void;
  setHint: (hint: Hint) => void;
  setGameStatus: (status: GameStatus) => void;
};

export { GameStatus, Hint, GameState, GameStateUpdaters };
