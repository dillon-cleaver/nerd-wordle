import { Hint } from "@/types/game";
import { WordId } from "@/types/word";

/**
 * Tracks which positions already have the correct letter placed
 */
export const getCorrectPositions = (guesses: WordId[], answerId: WordId): Set<number> => {
  const correctPositions = new Set<number>();
  guesses.forEach((guess) => {
    guess.split("").forEach((char, i) => {
      if (char === answerId[i]) {
        correctPositions.add(i);
      }
    });
  });
  return correctPositions;
};

/**
 * Finds a hint for a misplaced letter from the last guess
 */
export const findMisplacedLetterHint = (
  lastGuess: WordId,
  answerId: WordId,
  correctPositions: Set<number>,
  nextRow: number
): Hint | undefined => {
  for (let i = 0; i < 5; i++) {
    const letter = lastGuess[i];
    const isLetterInAnswer = letter && answerId.includes(letter);
    const isLetterInWrongPosition = letter && letter !== answerId[i];
    // Check if this letter is already correctly placed somewhere
    const correctPositionForLetter = answerId.indexOf(letter);
    const isLetterAlreadyCorrect =
      correctPositionForLetter !== -1 &&
      correctPositions.has(correctPositionForLetter);

    if (
      isLetterInAnswer &&
      isLetterInWrongPosition &&
      !isLetterAlreadyCorrect
    ) {
      return {
        row: nextRow,
        col: correctPositionForLetter,
        letter,
      };
    }
  }
  return undefined;
};

/**
 * Finds a hint for a missing letter (fallback when no misplaced letters found)
 */
export const findMissingLetterHint = (
  answerId: WordId,
  correctPositions: Set<number>,
  nextRow: number
): Hint | undefined => {
  for (let i = 0; i < answerId.length; i++) {
    if (!correctPositions.has(i)) {
      return {
        row: nextRow,
        col: i,
        letter: answerId[i],
      };
    }
  }
  return undefined;
};

/**
 * Generates a hint based on the current game state
 */
export const generateHint = (
  tentativeGuess: string,
  guesses: WordId[],
  answerId: WordId,
  correctPositions: Set<number>
): Hint | undefined => {
  if (tentativeGuess !== answerId && guesses.length >= 3) {
    const lastGuess = guesses[guesses.length - 1];
    const nextRow = guesses.length + 1;

    // First, try to find a misplaced letter
    let hint = findMisplacedLetterHint(lastGuess, answerId, correctPositions, nextRow);

    // If no misplaced letter found, show hint for any missing letter
    if (!hint) {
      hint = findMissingLetterHint(answerId, correctPositions, nextRow);
    }

    return hint;
  }
  
  return undefined;
};
