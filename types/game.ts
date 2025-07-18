import { WordEntry } from "./word";

type GameStatus = "won" | "running" | "lost";

// TODO: Fix this type – remove undefined from type definition
type Hint =
  | {
      row: number;
      col: number;
      letter: string;
    }
  | undefined;

type GameState = {
  answer: WordEntry;
};

type GameStateUpdaters = {
  setGuesses: (guesses: WordEntry[]) => void;
  setTentativeGuess: (guess: string) => void;
  setInvalidWord: (invalid: boolean) => void;
  setHint: (hint: Hint) => void;
  setGameStatus: (status: GameStatus) => void;
};

export { GameStatus, Hint, GameState, GameStateUpdaters };
