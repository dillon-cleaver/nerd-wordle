import { NUMBER_OF_GUESSES } from "@/constants/numbers";
import { GameStateUpdaters } from "@/types/game";
import { PuzzleResult } from "@/types/puzzle-result";
import { savePuzzleResult as savePuzzleResultLocal } from "@/storage/puzzle-results";
import { addToCollection } from "@/storage/word-collections";
import { WordEntry, WordId, NerdWordEntry } from "@/types/word";
import { LetterGuess } from "@/types/letter-tracking";
import { isDebugLoggingEnabled } from "./dev-flags";
import * as Crypto from "expo-crypto";
import { User, getAuth } from "firebase/auth";

// Cross-platform UUID generation using expo-crypto
const generatePuzzleResultId = () => Crypto.randomUUID();

/**
 * Handles invalid word input
 */
export const handleInvalidWord = (updaters: GameStateUpdaters): void => {
  updaters.setInvalidWord(true);
  setTimeout(() => {
    updaters.setInvalidWord(false);
    updaters.setTentativeGuess("");
  }, 1500);
};

/**
 * Handles game completion (win or loss) and saves results
 */
export const handleGameCompletion = (
  tentativeGuess: string,
  nextGuesses: WordId[],
  answerEntry: WordEntry,
  updaters: GameStateUpdaters,
  hintIndex: number,
  letterTracking: LetterGuess[],
  savePuzzleResult?: (user: User, result: PuzzleResult) => Promise<void>
): void => {
  const answerId = answerEntry.id as WordId;

  if (tentativeGuess === answerId) {
    // Player won
    updaters.setGameStatus("won");
    updaters.setHint(undefined);

    const puzzleResultId = generatePuzzleResultId();
    const edition =
      answerEntry.category === "common"
        ? 0
        : (answerEntry as NerdWordEntry).edition;

    const result: PuzzleResult = {
      id: puzzleResultId,
      word: answerId,
      edition,
      date: new Date(),
      guesses: nextGuesses.length,
      attempts: 1, // TODO: Implement proper attempt counting for puzzle retries
      hintIndex,
      status: "win",
      letterTracking,
    };

    // Try to save using context method (updates React state immediately)
    // If not provided, fallback to local storage method
    const currentUser = getAuth().currentUser;
    if (savePuzzleResult && currentUser) {
      savePuzzleResult(currentUser, result).catch(() => {
        // Fallback to local storage if context save fails
        savePuzzleResultLocal(null, result);
      });
    } else {
      // Fallback to local storage method
      savePuzzleResultLocal(null, result);
    }

    // Add to collection for nerd words
    if (answerEntry.category !== "common") {
      addToCollection(answerId, edition, new Date());

      // Only log in development mode
      if (isDebugLoggingEnabled()) {
        console.log(
          `Word collected! ${answerId} (Edition ${edition}) - ${nextGuesses.length} guesses, hint index ${hintIndex}`
        );
      }
    }
  } else if (nextGuesses.length >= NUMBER_OF_GUESSES) {
    // Player lost
    updaters.setGameStatus("lost");
    updaters.setHint(undefined);

    const edition =
      answerEntry.category === "common"
        ? 0
        : (answerEntry as NerdWordEntry).edition;
    const result: PuzzleResult = {
      id: generatePuzzleResultId(),
      word: answerId,
      edition,
      date: new Date(),
      guesses: nextGuesses.length,
      attempts: 1, // TODO: Implement proper attempt counting for puzzle retries
      hintIndex,
      status: "fail",
      letterTracking,
    };

    // Try to save using context method (updates React state immediately)
    // If not provided, fallback to local storage method
    const currentUser = getAuth().currentUser;
    if (savePuzzleResult && currentUser) {
      savePuzzleResult(currentUser, result).catch(() => {
        // Fallback to local storage if context save fails
        savePuzzleResultLocal(null, result);
      });
    } else {
      // Fallback to local storage method
      savePuzzleResultLocal(null, result);
    }
  }
};
