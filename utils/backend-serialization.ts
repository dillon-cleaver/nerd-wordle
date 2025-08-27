import { LetterGuess } from "@/types/letter-tracking";
import { BackendLetterGuess } from "@/types/backend-types";

export function toBackendLetterGuess(guess: LetterGuess): BackendLetterGuess {
  return {
    ...guess,
    timestamp:
      guess.timestamp instanceof Date
        ? guess.timestamp.toISOString()
        : String(guess.timestamp),
  };
}

export function fromBackendLetterGuess(
  apiGuess: BackendLetterGuess
): LetterGuess {
  return {
    ...apiGuess,
    timestamp: new Date(apiGuess.timestamp),
  };
}
