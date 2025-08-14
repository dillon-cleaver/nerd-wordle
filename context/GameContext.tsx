import { createContext, ReactNode, useState, useCallback } from "react";
import { handleSubmitGuess, handleKeyPress } from "../utils/game-logic";
import { GameStatus, Hint } from "@/types/game";
import { WordEntry, WordId, WordCategory } from "@/types/word";
import { useDailyPuzzle } from "@/hooks/useDailyPuzzle";
import { useWordData } from "@/context/WordDataContext";

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
  answerEntry: WordEntry | null; // The full word entry from Firebase
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
  answerEntry: null, // Placeholder while puzzle loads
  handleKeyPress: () => {},
  handleSubmitGuess: () => {},
  resetGame: () => {},
  isLoading: true,
});

export const GameProvider = ({ children }: { children: ReactNode }) => {
  // Use the enhanced hook for clean puzzle loading and game state
  const { dailyPuzzle, gameState, hintIndex, isLoading } = useDailyPuzzle();
  const { getWordEntry, isValidWord } = useWordData();
  const { category, originalCategory, answer } = gameState;

  const [gameStatus, setGameStatus] = useState<GameStatus>("running");
  const [guesses, setGuesses] = useState<WordEntry[]>([]);
  const [tentativeGuess, setTentativeGuess] = useState("");
  const [invalidWord, setInvalidWord] = useState(false);
  const [hint, setHint] = useState<Hint>();

  const handleSubmitGuessCallback = useCallback(() => {
    // Use the word entry from the daily puzzle instead of looking it up locally
    if (!dailyPuzzle?.word) {
      console.error("No daily puzzle word available");
      return;
    }

    const answerEntry = dailyPuzzle.word;

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
      hintIndex,
      getWordEntry, // Pass the Firebase-aware word lookup function
      isValidWord // Pass the Firebase-aware word validation function
    );
  }, [
    tentativeGuess,
    guesses,
    dailyPuzzle?.word,
    hintIndex,
    getWordEntry,
    isValidWord,
  ]);

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
        answerEntry: dailyPuzzle?.word || null,
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
