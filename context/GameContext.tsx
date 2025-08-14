import { createContext, ReactNode, useState, useCallback } from "react";
import { handleSubmitGuess, handleKeyPress } from "../utils/game-logic";
import { GameStatus, Hint } from "@/types/game";
import { WordEntry, WordId, WordCategory } from "@/types/word";
import { getWordEntry } from "@/constants/words";
import { useDailyPuzzle } from "@/hooks/useDailyPuzzle";

type GameContextType = {
  gameStatus: GameStatus;
  guesses: WordEntry[];
  tentativeGuess: string;
  invalidWord: boolean;
  hint: Hint | undefined;
  category: string; // human‑readable name
  // TODO: Update this to use newer typing
  originalCategory: WordCategory;
  answer: WordId;
  handleKeyPress: (key: string) => void;
  handleSubmitGuess: () => void;
  // TODO: Remove before production - development only
  resetGame: () => void;
  // Loading state for async puzzle fetch
  isLoading: boolean;
};

export const GameContext = createContext<GameContextType>({
  gameStatus: "running",
  guesses: [] as WordEntry[],
  tentativeGuess: "",
  invalidWord: false,
  hint: undefined,
  category: "Fantasy and Sci‑Fi",
  originalCategory: "fantasyAndSciFi",
  answer: "LOADING", // Placeholder while puzzle loads
  handleKeyPress: () => {},
  handleSubmitGuess: () => {},
  resetGame: () => {},
  isLoading: true,
});

export const GameProvider = ({ children }: { children: ReactNode }) => {
  // Use the enhanced hook for clean puzzle loading and game state
  const { gameState, hintIndex, isLoading } = useDailyPuzzle();
  const { category, originalCategory, answer } = gameState;

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
    // Reset all game state except the puzzle itself
    setGameStatus("running");
    setGuesses([]);
    setTentativeGuess("");
    setInvalidWord(false);
    setHint(undefined);
    // Note: Game state (answer, category) comes from the puzzle and doesn't need reset
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
        resetGame,
        isLoading,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
