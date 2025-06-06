import { createContext, ReactNode, useState, useCallback } from "react";
import { WordCategory, Word } from "@/constants/words";
import { initializeGame } from "@/utils/game";
import { handleSubmitGuess, handleKeyPress } from "./game-logic";
import { GameStatus, Hint, GameState } from "@/types/game";

type GameContextType = {
  gameStatus: GameStatus;
  guesses: Word[];
  tentativeGuess: string;
  invalidWord: boolean;
  hint: Hint;
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

  const handleSubmitGuessCallback = useCallback(() => {
    handleSubmitGuess(tentativeGuess, guesses, answer, {
      setGuesses,
      setTentativeGuess,
      setInvalidWord,
      setHint,
      setGameStatus,
    });
  }, [tentativeGuess, guesses, answer]);

  const handleKeyPressCallback = useCallback(
    (key: string) => {
      handleKeyPress(key, gameStatus, tentativeGuess, {
        setTentativeGuess,
        handleSubmitGuess: handleSubmitGuessCallback,
      });
    },
    [gameStatus, tentativeGuess, handleSubmitGuessCallback]
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
        handleKeyPress: handleKeyPressCallback,
        handleSubmitGuess: handleSubmitGuessCallback,
        // TODO: Remove before production - development only
        resetGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
