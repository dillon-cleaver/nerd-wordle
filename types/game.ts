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

/**
 * The runtime snapshot of the current puzzle.
 *
 * • `answer` is now a full WordEntry so callers have
 *   both the id ("PIXAR") and its metadata (`category`, `edition`, …).
 *
 *   Any component that needs the category can read
 *   `gameState.answer.category` instead of storing a duplicate string.
 */
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
