import { WordCategory, Word, WORDS } from "@/constants/words";
import { createContext, ReactNode, useState, useCallback } from "react";
import { NUMBER_OF_GUESSES } from "@/constants/numbers";
import { initializeGame } from "@/utils/game";

type GameStatus = "won" | "running" | "lost";

type Hint =
  | {
      row: number;
      col: number;
      letter: string;
    }
  | undefined;

type GameState = {
  // TODO: Consolidate the categories – make them typed!
  category: string;
  originalCategory: WordCategory;
  answer: Word;
};

type GameContextType = {
  gameStatus: GameStatus;
  guesses: Word[];
  tentativeGuess: string;
  invalidWord: boolean;
  hint: Hint;
  // TODO: Consolidate the categories – make them typed!
  category: string;
  originalCategory: WordCategory;
  answer: Word;
  handleKeyPress: (key: string) => void;
  handleSubmitGuess: () => void;
  // TODO: Remove before production - development only
  resetGame: () => void;
};

export const GameContext = createContext<GameContextType>({
  gameStatus: "running",
  guesses: [],
  tentativeGuess: "",
  invalidWord: false,
  hint: undefined,
  category: "",
  originalCategory: "fantasyAndSciFi",
  answer: "SLATE" as Word,
  handleKeyPress: () => {},
  handleSubmitGuess: () => {},
  // TODO: Remove before production - development only
  resetGame: () => {},
});

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [{ category, answer, originalCategory }, setGameState] =
    useState<GameState>(() => {
      const game = initializeGame();
      return {
        ...game,
        category: game.category || "Fantasy and Sci-Fi",
      };
    });
  const [gameStatus, setGameStatus] = useState<GameStatus>("running");
  const [guesses, setGuesses] = useState<Word[]>([]);
  const [tentativeGuess, setTentativeGuess] = useState("");
  const [invalidWord, setInvalidWord] = useState(false);
  const [hint, setHint] = useState<Hint>(undefined);

  const handleSubmitGuess = useCallback(() => {
    if (tentativeGuess.length !== 5) return;

    const isValidWord = Object.values(WORDS)
      .flat()
      .includes(tentativeGuess as Word);

    if (!isValidWord) {
      setInvalidWord(true);
      setTimeout(() => {
        setInvalidWord(false);
        setTentativeGuess("");
      }, 1500);
      return;
    }

    const nextGuesses = [...guesses, tentativeGuess as Word];

    const correctLettersInPlace = guesses
      .flatMap((guess) =>
        guess.split("").map((char, i) => (char === answer[i] ? char : null))
      )
      .filter(Boolean);

    let nextHint: Hint = undefined;
    if (
      tentativeGuess !== answer &&
      (guesses.length === 2 || guesses.length === 3)
    ) {
      for (let i = 0; i < 5; i++) {
        const letter = tentativeGuess[i];
        const isMisplaced =
          letter &&
          letter !== answer[i] &&
          answer.includes(letter) &&
          tentativeGuess.indexOf(letter) !== answer.indexOf(letter) &&
          !correctLettersInPlace.includes(letter);

        if (isMisplaced) {
          nextHint = {
            row: guesses.length + 1,
            col: answer.indexOf(letter),
            letter,
          };
          break;
        }
      }
    }

    setGuesses(nextGuesses);
    setHint(nextHint);
    setTentativeGuess("");

    if (tentativeGuess === answer) {
      setGameStatus("won");
      setHint(undefined);
    } else if (nextGuesses.length >= NUMBER_OF_GUESSES) {
      setGameStatus("lost");
      setHint(undefined);
    }
  }, [tentativeGuess, guesses, answer]);

  const handleKeyPress = useCallback(
    (key: string) => {
      if (gameStatus !== "running") return;

      if (key === "ENTER") {
        handleSubmitGuess();
      } else if (key === "BACKSPACE") {
        setTentativeGuess((prev) => prev.slice(0, -1));
      } else if (tentativeGuess.length < 5) {
        setTentativeGuess((prev) => prev + key);
      }
    },
    [gameStatus, tentativeGuess, handleSubmitGuess]
  );

  // TODO: Remove before production - development only
  const resetGame = useCallback(() => {
    const newGameState = initializeGame();
    setGameState(newGameState);
    setGameStatus("running");
    setGuesses([]);
    setTentativeGuess("");
    setInvalidWord(false);
    setHint(undefined);
  }, []);

  return (
    <GameContext.Provider
      value={{
        gameStatus,
        guesses,
        tentativeGuess,
        invalidWord,
        hint,
        category,
        originalCategory,
        answer,
        handleKeyPress,
        handleSubmitGuess,
        // TODO: Remove before production - development only
        resetGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
