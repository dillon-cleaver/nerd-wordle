import { NUMBER_OF_GUESSES } from "@/constants/numbers";
import { GameStateUpdaters } from "@/types/game";
import { PuzzleResult } from "@/types/puzzle-result";
import { savePuzzleResult as savePuzzleResultDual } from "@/storage/puzzle-results";
import { savePuzzleResultLocal } from "@/storage/puzzle-results.local";
import { addToCollection } from "@/storage/word-collections";
import { WordEntry, WordId, NerdWordEntry } from "@/types/word";
import { LetterGuess } from "@/types/letter-tracking";
import { clearActivePuzzleState } from "@/storage/active-puzzle.local";
import { isDebugLoggingEnabled } from "./dev-flags";
import * as Crypto from "expo-crypto";
import { User } from "firebase/auth";
import { getAuthInstance } from "@/firebase/firebaseConfig";

// Cross-platform UUID generation using expo-crypto
const generatePuzzleResultId = () => Crypto.randomUUID();

/**
 * Handles invalid word input
 */
export const handleInvalidWord = (updaters: GameStateUpdaters): void => {
  updaters.setInvalidWord(true);
  setTimeout(() => {
    updaters.setInvalidWord(false);
    // Keep tentativeGuess intact so user can edit their invalid word
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

    // Clear active puzzle state since game is won
    clearActivePuzzleState().catch((error) => {
      if (isDebugLoggingEnabled()) {
        console.error("Failed to clear active puzzle state:", error);
      }
    });

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

    // Save result to both local storage and backend (if authenticated)
    // This ensures the result is immediately available for the "already played" check
    const auth = getAuthInstance();
    const currentUser = auth?.currentUser;

    if (isDebugLoggingEnabled()) {
      console.log("Game completion debug (WIN):", {
        hasSavePuzzleResult: !!savePuzzleResult,
        hasCurrentUser: !!currentUser,
        currentUserEmail: currentUser?.email,
        willUseContextMethod: !!(savePuzzleResult && currentUser),
      });
    }

    if (savePuzzleResult && currentUser) {
      // Use the context method which saves to both local storage and backend
      if (isDebugLoggingEnabled()) {
        console.log("Using context method to save puzzle result");
      }
      savePuzzleResult(currentUser, result).catch((error) => {
        if (isDebugLoggingEnabled()) {
          console.error(
            "Failed to save via context, falling back to dual save:",
            error
          );
        }
        // Fallback to dual save method (local storage + backend)
        savePuzzleResultDual(null, result).catch(async () => {
          // Final fallback to just local storage
          try {
            await savePuzzleResultLocal(result);
          } catch (localError) {
            if (isDebugLoggingEnabled()) {
              console.error(
                "Final fallback local storage save failed:",
                localError
              );
            }
          }
        });
      });
    } else {
      // Use dual save method for both local storage and backend
      savePuzzleResultDual(null, result).catch(async () => {
        // Fallback to just local storage if dual save fails
        try {
          await savePuzzleResultLocal(result);
        } catch (localError) {
          if (isDebugLoggingEnabled()) {
            console.error("Fallback local storage save failed:", localError);
          }
        }
      });
    }

    // Add to collection for nerd words
    if (answerEntry.category !== "common") {
      addToCollection(answerId, edition, new Date()).catch((error) => {
        if (isDebugLoggingEnabled()) {
          console.error("Failed to add word to collection:", error);
        }
      });

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

    // Clear active puzzle state since game is completed
    clearActivePuzzleState().catch((error) => {
      if (isDebugLoggingEnabled()) {
        console.error("Failed to clear active puzzle state:", error);
      }
    });

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

    // Save result to both local storage and backend (if authenticated)
    // This ensures the result is immediately available for the "already played" check
    const auth = getAuthInstance();
    const currentUser = auth?.currentUser;
    if (savePuzzleResult && currentUser) {
      // Use the context method which saves to both local storage and backend
      savePuzzleResult(currentUser, result).catch((error) => {
        if (isDebugLoggingEnabled()) {
          console.error(
            "Failed to save via context, falling back to dual save:",
            error
          );
        }
        // Fallback to dual save method (local storage + backend)
        savePuzzleResultDual(null, result).catch(async () => {
          // Final fallback to just local storage
          try {
            await savePuzzleResultLocal(result);
          } catch (localError) {
            if (isDebugLoggingEnabled()) {
              console.error(
                "Final fallback local storage save failed:",
                localError
              );
            }
          }
        });
      });
    } else {
      // Use dual save method for both local storage and backend
      savePuzzleResultDual(null, result).catch(async () => {
        // Fallback to just local storage if dual save fails
        try {
          await savePuzzleResultLocal(result);
        } catch (localError) {
          if (isDebugLoggingEnabled()) {
            console.error("Fallback local storage save failed:", localError);
          }
        }
      });
    }
  }
};
