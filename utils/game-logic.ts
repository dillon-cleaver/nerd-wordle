import { GameStatus, GameStateUpdaters } from "@/types/game";
import { WordEntry, WordId } from "@/types/word";
import { LetterGuess } from "@/types/letter-tracking";
import { PuzzleResult, PuzzleId } from "@/types/puzzle-result";
import { User } from "firebase/auth";
import { getCorrectPositions, generateHint } from "./hint-logic";
import { handleInvalidWord, handleGameCompletion } from "./game-completion";
import { saveActivePuzzleState } from "@/storage/active-puzzle.local";
import { extractDateFromPuzzleId } from "./puzzle-id";

export const handleSubmitGuessWithLetterTracking = (
  tentativeGuess: string,
  guesses: WordId[],
  answerEntry: WordEntry,
  updaters: GameStateUpdaters,
  hintIndex: number,
  getWordEntry: (id: WordId) => WordEntry | undefined,
  isValidWord: (word: string) => boolean,
  letterTracking: LetterGuess[],
  updateLetterTracking?: (newLetters: LetterGuess[]) => void,
  savePuzzleResult?: (user: User, result: PuzzleResult) => Promise<void>,
  puzzleId?: PuzzleId // Add puzzleId parameter for active puzzle tracking
) => {
  if (tentativeGuess.length !== 5) return;
  const answerId = answerEntry.id as WordId;

  if (!isValidWord(tentativeGuess)) {
    handleInvalidWord(updaters);
    return;
  }

  // Only track letters AFTER validation passes
  if (updateLetterTracking) {
    const currentRow = guesses.length;
    const newLetterGuesses = tentativeGuess
      .split("")
      .map((letter, position) => ({
        letter: letter.toUpperCase(),
        row: currentRow,
        position,
        timestamp: new Date(),
      }));

    const allLetterGuesses = [...letterTracking, ...newLetterGuesses];
    updateLetterTracking(allLetterGuesses);

    // Save active puzzle state immediately after each valid guess
    if (puzzleId) {
      const puzzleDate = extractDateFromPuzzleId(puzzleId);
      if (puzzleDate) {
        saveActivePuzzleState(puzzleId, puzzleDate, allLetterGuesses);
      } else {
        // Optionally log a warning or handle invalid format
        // console.warn(`Invalid puzzleId format: ${puzzleId}`);
      }
    }

    // Use the updated letter tracking for game completion
    letterTracking = allLetterGuesses;
  }

  const nextGuesses: WordId[] = [
    ...guesses,
    tentativeGuess.toUpperCase() as WordId,
  ];

  const correctPositions = getCorrectPositions(nextGuesses, answerId);
  const nextHint = generateHint(
    tentativeGuess,
    guesses,
    answerId,
    correctPositions
  );

  const nextGuessesEntries: WordEntry[] = nextGuesses
    .map((id) => getWordEntry(id))
    .filter((entry): entry is WordEntry => entry !== undefined);

  updaters.setGuesses(nextGuessesEntries);
  updaters.setHint(nextHint);
  updaters.setTentativeGuess("");

  handleGameCompletion(
    tentativeGuess,
    nextGuesses,
    answerEntry,
    updaters,
    hintIndex,
    letterTracking,
    savePuzzleResult
  );
};

export const handleSubmitGuess = (
  tentativeGuess: string,
  guesses: WordId[],
  answerEntry: WordEntry,
  updaters: GameStateUpdaters,
  hintIndex: number,
  getWordEntry: (id: WordId) => WordEntry | undefined,
  isValidWord: (word: string) => boolean
) => {
  handleSubmitGuessWithLetterTracking(
    tentativeGuess,
    guesses,
    answerEntry,
    updaters,
    hintIndex,
    getWordEntry,
    isValidWord,
    [] // No letter tracking data for backward compatibility
  );
};

export const handleKeyPress = (
  key: string,
  gameStatus: GameStatus,
  tentativeGuess: string,
  updaters: {
    setTentativeGuess: (guess: string) => void;
    handleSubmitGuess: () => void;
  }
) => {
  if (gameStatus !== "running") return;

  if (key === "ENTER") {
    updaters.handleSubmitGuess();
  } else if (key === "BACKSPACE") {
    updaters.setTentativeGuess(tentativeGuess.slice(0, -1));
  } else if (tentativeGuess.length < 5) {
    updaters.setTentativeGuess(tentativeGuess + key);
  }
};
