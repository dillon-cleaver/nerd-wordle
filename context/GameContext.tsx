import { createContext, ReactNode, useState, useCallback } from "react";
import { initializeGame } from "@/utils/game";
import { handleSubmitGuess, handleKeyPress } from "../utils/game-logic";
import { GameStatus, Hint } from "@/types/game";
import { TODAY_PUZZLE } from "@/utils/daily-puzzle";
import { WordEntry, WordId, WordCategory } from "@/types/word";
import { getWordEntry } from "@/constants/words";

type GameContextType = {
  gameStatus: GameStatus;
  guesses: WordEntry[];
  tentativeGuess: string;
  invalidWord: boolean;
  hint: Hint | undefined;
  category: string; // human‑readable name
  originalCategory: WordCategory;
  answer: WordId;
  handleKeyPress: (key: string) => void;
  handleSubmitGuess: () => void;
  // TODO: Remove before production - development only
  resetGame: () => void;
};

export const GameContext = createContext<GameContextType>({
  gameStatus: "running",
  guesses: [] as WordEntry[],
  tentativeGuess: "",
  invalidWord: false,
  hint: undefined,
  category: "Fantasy and Sci‑Fi",
  originalCategory: "fantasyAndSciFi",
  answer: TODAY_PUZZLE.word.id,
  handleKeyPress: () => {},
  handleSubmitGuess: () => {},
  // TODO: Remove before production - development only
  resetGame: () => {},
});

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const { hintIndex } = TODAY_PUZZLE; // we'll still use its hint rotation
  const [{ category, originalCategory, answer }, setGameState] = useState(() =>
    initializeGame()
  );

  const [gameStatus, setGameStatus] = useState<GameStatus>("running");
  const [guesses, setGuesses] = useState<WordEntry[]>([]);
  const [tentativeGuess, setTentativeGuess] = useState("");
  const [invalidWord, setInvalidWord] = useState(false);
  const [hint, setHint] = useState<Hint>();

  const handleSubmitGuessCallback = useCallback(() => {
    const answerEntry = getWordEntry(answer);

    handleSubmitGuess(
      tentativeGuess,
      guesses.map((g) => g.id),
      answerEntry,
      {
        setGuesses,
        setTentativeGuess,
        setInvalidWord,
        setHint,
        setGameStatus,
      },
      hintIndex
    );
  }, [tentativeGuess, guesses, answer, hintIndex]);

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
