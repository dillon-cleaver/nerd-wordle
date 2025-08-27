import { useEffect } from "react";
import { NUMBER_OF_GUESSES } from "@/constants/numbers";
import { GameStatus } from "@/types/game";
import { LetterGuess } from "@/types/letter-tracking";
import { WordEntry, WordId } from "@/types/word";

type Params = {
  savedLetterGuesses: LetterGuess[];
  guessesLength: number;
  existingLetterGuessesLength: number;
  dailyPuzzleWordId?: WordId | string;
  answer?: WordId | string;
  getWordEntry: (id: WordId) => WordEntry | undefined;
  setGuesses: (entries: WordEntry[]) => void;
  setLetterGuesses: (letters: LetterGuess[]) => void;
  setGameStatus: (status: GameStatus) => void;
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
  getWordEntry,
  setGuesses,
  setLetterGuesses,
  setGameStatus,
}: Params) => {
  useEffect(() => {
    if (
      savedLetterGuesses &&
      savedLetterGuesses.length > 0 &&
      guessesLength === 0 &&
      existingLetterGuessesLength === 0 &&
      dailyPuzzleWordId &&
      answer &&
      answer !== ("LOADING" as unknown as WordId)
    ) {
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
        setGuesses(reconstructedEntries);
        setLetterGuesses(savedLetterGuesses);
        // Determine game status from reconstructed guesses
        const won = reconstructedWords.some((w) => w === answer);
        if (won) {
          setGameStatus("won");
        } else if (reconstructedEntries.length >= NUMBER_OF_GUESSES) {
          setGameStatus("lost");
        }
      }
    }
  }, [
    savedLetterGuesses,
    guessesLength,
    existingLetterGuessesLength,
    dailyPuzzleWordId,
    answer,
    getWordEntry,
    setGuesses,
    setLetterGuesses,
    setGameStatus,
  ]);
};

