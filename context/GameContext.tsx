import {
  createContext,
  ReactNode,
  useState,
  useCallback,
  useContext,
  useEffect,
} from "react";
import {
  handleSubmitGuessWithLetterTracking,
  handleKeyPress,
} from "../utils/game-logic";
import { GameStatus, Hint } from "@/types/game";
import { WordEntry, WordId, WordCategory } from "@/types/word";
import { LetterGuess } from "@/types/letter-tracking";
import { PuzzleId } from "@/types/puzzle-result";
import { useDailyPuzzle } from "@/hooks/useDailyPuzzle";
import { useWordData } from "@/context/WordDataContext";
import { useLetterTrackingFromPuzzleResults } from "@/hooks/useLetterTrackingFromPuzzleResults";
import { UserContext } from "@/context/UserContext";
import { useRehydrateFromLetterTracking } from "@/hooks/useRehydrateFromLetterTracking";
import { usePuzzleHistory } from "@/context/PuzzleHistoryContext";
import { createPuzzleId } from "@/utils/puzzle-id";

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
  // Loading state for async puzzle fetch
  isLoading: boolean;
  // Letter tracking
  letterGuesses: LetterGuess[];
  getGuessesForRow: (row: number) => LetterGuess[];
  hasLetterBeenGuessed: (letter: string) => boolean;
  getFirstRowForLetter: (letter: string) => number | null;
  getGuessedLetters: () => string[];
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
  isLoading: true,
  // Letter tracking defaults
  letterGuesses: [],
  getGuessesForRow: () => [],
  hasLetterBeenGuessed: () => false,
  getFirstRowForLetter: () => null,
  getGuessedLetters: () => [],
});

export const GameProvider = ({ children }: { children: ReactNode }) => {
  // Use the enhanced hook for clean puzzle loading and game state
  const { dailyPuzzle, gameState, hintIndex, isLoading } = useDailyPuzzle();
  const { getWordEntry, isValidWord } = useWordData();
  const { category, originalCategory, answer } = gameState;
  const { authUser } = useContext(UserContext);
  const { savePuzzleResult, autoLoadResults } = usePuzzleHistory();

  // Auto-load puzzle history when user auth state changes
  useEffect(() => {
    autoLoadResults(authUser, false); // UserContext handles its own loading state
  }, [authUser, autoLoadResults]);

  // Load any previously saved letter tracking for today's puzzle to restore the grid on refresh
  const puzzleId: PuzzleId | undefined = dailyPuzzle?.date
    ? createPuzzleId(dailyPuzzle.date)
    : undefined;
  const { letterGuesses: savedLetterGuesses, loading: letterTrackingLoading } =
    useLetterTrackingFromPuzzleResults(puzzleId, authUser);

  // Local letter tracking state - will be saved in puzzle results
  const [letterGuesses, setLetterGuesses] = useState<LetterGuess[]>([]);
  const [isRehydrationComplete, setIsRehydrationComplete] = useState(false);

  const [gameStatus, setGameStatus] = useState<GameStatus>("running");
  const [guesses, setGuesses] = useState<WordEntry[]>([]);
  const [tentativeGuess, setTentativeGuess] = useState("");
  const [invalidWord, setInvalidWord] = useState(false);
  const [hint, setHint] = useState<Hint>();

  // Wrap setIsRehydrationComplete in useCallback to prevent unnecessary re-renders
  const setIsRehydrationCompleteCallback = useCallback((complete: boolean) => {
    setIsRehydrationComplete(complete);
  }, []);

  // Helper functions for letter tracking
  const getGuessesForRow = useCallback(
    (row: number) => {
      return letterGuesses.filter((guess) => guess.row === row);
    },
    [letterGuesses]
  );

  const hasLetterBeenGuessed = useCallback(
    (letter: string) => {
      return letterGuesses.some(
        (guess) => guess.letter === letter.toUpperCase()
      );
    },
    [letterGuesses]
  );

  const getFirstRowForLetter = useCallback(
    (letter: string) => {
      const guess = letterGuesses.find(
        (guess) => guess.letter === letter.toUpperCase()
      );
      return guess ? guess.row : null;
    },
    [letterGuesses]
  );

  const getGuessedLetters = useCallback(() => {
    return Array.from(new Set(letterGuesses.map((guess) => guess.letter)));
  }, [letterGuesses]);

  // Rehydrate guesses and status from saved letter tracking when available
  useRehydrateFromLetterTracking({
    savedLetterGuesses,
    guessesLength: guesses.length,
    existingLetterGuessesLength: letterGuesses.length,
    dailyPuzzleWordId: dailyPuzzle?.word?.id,
    answer,
    puzzleId,
    hintIndex,
    getWordEntry,
    setGuesses,
    setLetterGuesses,
    setGameStatus,
    setHint,
    setIsRehydrationComplete: setIsRehydrationCompleteCallback,
  });

  const handleSubmitGuessCallback = useCallback(() => {
    // Use the word entry from the daily puzzle instead of looking it up locally
    if (!dailyPuzzle?.word) {
      console.error("No daily puzzle word available");
      return;
    }

    const answerEntry = dailyPuzzle.word;

    handleSubmitGuessWithLetterTracking(
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
      isValidWord, // Pass the Firebase-aware word validation function
      letterGuesses, // Pass current letter tracking state
      // Add callback to update letter tracking when valid guess is made
      (newLetters: LetterGuess[]) => setLetterGuesses(newLetters),
      savePuzzleResult, // Pass the context save method for immediate state updates
      puzzleId // Pass puzzle ID for active puzzle tracking
    );
  }, [
    tentativeGuess,
    guesses,
    dailyPuzzle?.word,
    hintIndex,
    getWordEntry,
    isValidWord,
    letterGuesses,
    savePuzzleResult,
    puzzleId,
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

  // Comprehensive loading state that includes puzzle loading, letter tracking, and state restoration
  const isGameLoading =
    isLoading || letterTrackingLoading || !isRehydrationComplete;

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
        isLoading: isGameLoading,
        letterGuesses,
        getGuessesForRow,
        hasLetterBeenGuessed,
        getFirstRowForLetter,
        getGuessedLetters,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
