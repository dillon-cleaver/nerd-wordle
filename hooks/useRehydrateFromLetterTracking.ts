import { useEffect } from "react";
import { NUMBER_OF_GUESSES, MIN_GUESSES_FOR_HINT } from "@/constants/numbers";
import { GameStatus, Hint } from "@/types/game";
import { LetterGuess } from "@/types/letter-tracking";
import { WordEntry, WordId } from "@/types/word";
import { PuzzleId } from "@/types/puzzle-result";
import { incrementRefreshAttempts } from "@/storage/active-puzzle.local";
import { isStateRestorationDebugEnabled } from "@/utils/dev-flags";
import { getCorrectPositions, generateHint } from "@/utils/hint-logic";

type Params = {
  savedLetterGuesses: LetterGuess[];
  guessesLength: number;
  existingLetterGuessesLength: number;
  dailyPuzzleWordId?: WordId | string;
  answer?: WordId | string;
  puzzleId?: PuzzleId; // Add puzzleId for tracking refresh attempts
  getWordEntry: (id: WordId) => WordEntry | undefined;
  setGuesses: (entries: WordEntry[]) => void;
  setLetterGuesses: (letters: LetterGuess[]) => void;
  setGameStatus: (status: GameStatus) => void;
  setHint: (hint: Hint | undefined) => void; // Add setHint for hint restoration
  setIsRehydrationComplete: (complete: boolean) => void;
};

/**
 * Rehydrate the game board (guesses + status) from saved letter tracking.
 *
 * This hook reconstructs prior guesses from `LetterGuess[]` by grouping
 * letters by row and position, maps them to WordEntry objects, and updates
 * guesses, letterGuesses, and gameStatus accordingly. It runs once when
 * today's puzzle and saved letters are available and no guesses exist yet.
 */
export const useRehydrateFromLetterTracking = ({
  savedLetterGuesses,
  guessesLength,
  existingLetterGuessesLength,
  dailyPuzzleWordId,
  answer,
  puzzleId,
  getWordEntry,
  setGuesses,
  setLetterGuesses,
  setGameStatus,
  setHint,
  setIsRehydrationComplete,
}: Params) => {
  useEffect(() => {
    let mounted = true;

    const rehydrateState = async () => {
      // Mark rehydration as complete early if conditions suggest no restoration is needed
      if (
        !savedLetterGuesses ||
        savedLetterGuesses.length === 0 ||
        !dailyPuzzleWordId ||
        !answer ||
        answer === ("LOADING" as unknown as WordId) ||
        guessesLength > 0 ||
        existingLetterGuessesLength > 0
      ) {
        if (mounted) {
          setIsRehydrationComplete(true);
        }
        return;
      }

      // At this point, all conditions are met for rehydration
      if (isStateRestorationDebugEnabled()) {
        console.log("Rehydrating game state from saved letter tracking:", {
          savedLetterCount: savedLetterGuesses.length,
          currentGuesses: guessesLength,
          currentLetters: existingLetterGuessesLength,
          puzzleWord: dailyPuzzleWordId,
          answer: answer,
        });
      }

      // Group letters by row and reconstruct each guess word
      const rows = new Map<number, string[]>();
      savedLetterGuesses.forEach((lg) => {
        const arr = rows.get(lg.row) || new Array(5).fill("");
        arr[lg.position] = lg.letter.toUpperCase();
        rows.set(lg.row, arr);
      });

      const reconstructedWords = Array.from(rows.keys())
        .sort((a, b) => a - b)
        .map((row) => (rows.get(row) || []).join(""))
        .filter((w) => w.length === 5);

      const reconstructedEntries = reconstructedWords
        .map((id) => getWordEntry(id as WordId))
        .filter((entry): entry is WordEntry => entry !== undefined);

      if (reconstructedEntries.length > 0) {
        if (isStateRestorationDebugEnabled()) {
          console.log("Restoring game state:", {
            words: reconstructedWords,
            entries: reconstructedEntries.length,
          });
        }

        // Track refresh attempts for analytics if this is an active puzzle
        if (puzzleId && savedLetterGuesses.length > 0) {
          const attempts = await incrementRefreshAttempts(puzzleId);
          if (isStateRestorationDebugEnabled()) {
            console.log(`Refresh attempt #${attempts} for puzzle ${puzzleId}`);
          }
        }

        if (mounted) {
          setGuesses(reconstructedEntries);
          setLetterGuesses(savedLetterGuesses);
        }

        // Restore hint if game is still in progress and has enough guesses
        const gameInProgress =
          !reconstructedWords.some((w) => w === answer) &&
          reconstructedEntries.length < NUMBER_OF_GUESSES;

        if (
          gameInProgress &&
          reconstructedEntries.length >= MIN_GUESSES_FOR_HINT
        ) {
          // Recalculate hint based on current game state
          const lastGuess = reconstructedWords[reconstructedWords.length - 1];
          const correctPositions = getCorrectPositions(
            reconstructedWords as WordId[],
            answer as WordId
          );
          const restoredHint = generateHint(
            lastGuess,
            reconstructedWords.slice(0, -1) as WordId[], // All guesses except the last one
            answer as WordId,
            correctPositions
          );

          if (mounted) {
            setHint(restoredHint);
          }

          if (isStateRestorationDebugEnabled()) {
            console.log("Restored hint:", restoredHint);
          }
        } else if (mounted) {
          // Clear hint if game is complete or not enough guesses
          setHint(undefined);
        }

        // Determine game status from reconstructed guesses
        const won = reconstructedWords.some((w) => w === answer);
        if (mounted) {
          if (won) {
            setGameStatus("won");
            if (isStateRestorationDebugEnabled()) {
              console.log("Restored completed puzzle - game won");
            }
          } else if (reconstructedEntries.length >= NUMBER_OF_GUESSES) {
            setGameStatus("lost");
            if (isStateRestorationDebugEnabled()) {
              console.log("Restored completed puzzle - game lost");
            }
          } else if (isStateRestorationDebugEnabled()) {
            console.log("Restored in-progress puzzle");
          }
        }
      } else if (isStateRestorationDebugEnabled()) {
        console.warn("Failed to reconstruct word entries from saved letters");
      }

      // Mark rehydration as complete regardless of whether restoration succeeded
      if (mounted) {
        setIsRehydrationComplete(true);
      }
    };

    rehydrateState();

    return () => {
      mounted = false;
    };
  }, [
    savedLetterGuesses,
    guessesLength,
    existingLetterGuessesLength,
    dailyPuzzleWordId,
    answer,
    puzzleId,
    getWordEntry,
    setGuesses,
    setLetterGuesses,
    setGameStatus,
    setHint,
    setIsRehydrationComplete,
  ]);
};
