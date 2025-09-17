/**
 * Puzzle ID utilities for consistent validation and parsing
 */

import { PuzzleId } from "@/types/puzzle-result";

/**
 * Validates a puzzle ID and extracts the date component
 * @param puzzleId - The puzzle ID to validate (e.g., "daily-2025-09-17")
 * @returns The date string if valid, undefined if invalid
 */
export function extractDateFromPuzzleId(
  puzzleId: PuzzleId
): string | undefined {
  const match = /^daily-(\d{4}-\d{2}-\d{2})$/.exec(puzzleId);
  return match ? match[1] : undefined;
}

/**
 * Validates if a puzzle ID follows the expected format
 * @param puzzleId - The puzzle ID to validate
 * @returns True if the puzzle ID is valid, false otherwise
 */
export function isValidPuzzleId(puzzleId: string): puzzleId is PuzzleId {
  return /^daily-\d{4}-\d{2}-\d{2}$/.test(puzzleId);
}

/**
 * Creates a puzzle ID from a date string
 * @param dateString - The date string in YYYY-MM-DD format
 * @returns The puzzle ID
 */
export function createPuzzleId(dateString: string): PuzzleId {
  return `daily-${dateString}` as PuzzleId;
}
