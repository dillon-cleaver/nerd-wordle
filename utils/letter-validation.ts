/**
 * Utility functions for validating letters in Wordle guesses
 * Handles duplicate letters correctly according to Wordle rules
 */

export type LetterState = 'correct' | 'present' | 'absent';

export interface LetterValidation {
  letter: string;
  state: LetterState;
  position: number;
}

/**
 * Validates a guess against an answer using proper Wordle rules for duplicate letters
 * 
 * Rules:
 * 1. Letters in correct positions are marked as 'correct' (green)
 * 2. Letters in wrong positions but present in answer are marked as 'present' (yellow)
 * 3. Letters not in answer (or already accounted for) are marked as 'absent' (gray)
 * 4. Frequency matters: if a letter appears more times in guess than answer, 
 *    only the correct number of instances should be marked as correct/present
 * 
 * @param guess - The guessed word (5 letters)
 * @param answer - The correct answer (5 letters)
 * @returns Array of letter validations for each position
 */
export function validateGuess(guess: string, answer: string): LetterValidation[] {
  const guessLetters = guess.toUpperCase().split('');
  const answerLetters = answer.toUpperCase().split('');
  const result: LetterValidation[] = [];
  
  // Count letter frequencies in the answer
  const answerFrequency: Record<string, number> = {};
  for (const letter of answerLetters) {
    answerFrequency[letter] = (answerFrequency[letter] || 0) + 1;
  }
  
  // Track how many of each letter we've already marked as correct/present
  const usedFrequency: Record<string, number> = {};
  
  // First pass: mark all correct positions
  for (let i = 0; i < guessLetters.length; i++) {
    const letter = guessLetters[i];
    if (letter === answerLetters[i]) {
      result[i] = { letter, state: 'correct', position: i };
      usedFrequency[letter] = (usedFrequency[letter] || 0) + 1;
    } else {
      // Initialize placeholder - will be determined in second pass
      result[i] = { letter, state: 'absent', position: i };
    }
  }
  
  // Second pass: mark present positions for non-correct letters
  for (let i = 0; i < guessLetters.length; i++) {
    if (result[i].state !== 'absent') continue; // Skip if already marked correct
    
    const letter = guessLetters[i];
    const available = (answerFrequency[letter] || 0) - (usedFrequency[letter] || 0);
    
    if (available > 0) {
      result[i] = { letter, state: 'present', position: i };
      usedFrequency[letter] = (usedFrequency[letter] || 0) + 1;
    }
    // else: remains 'absent'
  }
  
  return result;
}

/**
 * Get the validation state for a specific letter at a specific position
 * 
 * @param guess - The guessed word
 * @param answer - The correct answer
 * @param position - The position to check (0-4)
 * @returns The letter state for that position
 */
export function getLetterState(guess: string, answer: string, position: number): LetterState {
  const validations = validateGuess(guess, answer);
  return validations[position]?.state || 'absent';
}

/**
 * Check if a letter is in the correct position
 * 
 * @param guess - The guessed word
 * @param answer - The correct answer
 * @param position - The position to check
 * @returns True if letter is correct at this position
 */
export function isLetterCorrect(guess: string, answer: string, position: number): boolean {
  return getLetterState(guess, answer, position) === 'correct';
}

/**
 * Check if a letter is present but in wrong position
 * 
 * @param guess - The guessed word
 * @param answer - The correct answer
 * @param position - The position to check
 * @returns True if letter is present but in wrong position
 */
export function isLetterPresent(guess: string, answer: string, position: number): boolean {
  return getLetterState(guess, answer, position) === 'present';
}

/**
 * Get the overall state of a letter across all guesses (for keyboard coloring)
 * Priority: correct > present > absent
 * 
 * @param letter - The letter to check
 * @param guesses - All previous guesses
 * @param answer - The correct answer
 * @returns The highest priority state this letter has achieved
 */
export function getKeyboardLetterState(
  letter: string, 
  guesses: string[], 
  answer: string
): LetterState | null {
  let highestState: LetterState | null = null;
  
  for (const guess of guesses) {
    const validations = validateGuess(guess, answer);
    
    for (const validation of validations) {
      if (validation.letter === letter.toUpperCase()) {
        if (validation.state === 'correct') {
          return 'correct'; // Highest priority, return immediately
        } else if (validation.state === 'present' && highestState !== 'present') {
          highestState = 'present';
        } else if (validation.state === 'absent' && highestState === null) {
          highestState = 'absent';
        }
      }
    }
  }
  
  return highestState;
}