import { NUMBER_OF_GUESSES } from "@/constants/numbers";
import { GameStateUpdaters } from "@/types/game";
import { PuzzleResult } from "@/types/puzzle-result";
import { savePuzzleResult } from "@/storage/puzzle-results";
import { addToCollection } from "@/storage/word-collections";
import { WordEntry, WordId, NerdWordEntry } from "@/types/word";
import { LetterGuess } from "@/types/letter-tracking";
import { isDebugLoggingEnabled } from "./dev-flags";

// TODO: Replace with React Native-compatible UUID generation when building for native
// Consider: react-native-get-random-values + uuid, or expo-crypto
const generatePuzzleResultId = () => crypto.randomUUID();

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
  letterTracking: LetterGuess[]
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
      attempts: 1,
      hintIndex,
      status: "win",
      letterTracking,
    };
    savePuzzleResult(null, result);

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
      attempts: 1,
      hintIndex,
      status: "fail",
      letterTracking,
    };
    savePuzzleResult(null, result);
  }
};
