// Utility functions to convert between domain and API types
import * as admin from "firebase-admin";
import { PuzzleResultRequest, WordEntry, DailyPuzzleSeed } from "./types";
import { PuzzleResult } from "../../types/puzzle-result";

export const puzzleResultToApiRequest = (
  result: PuzzleResult
): PuzzleResultRequest => ({
  id: result.id,
  word: result.word,
  attempts: result.guesses,
  date: result.date.toISOString(),
  status: result.status === "fail" ? "loss" : result.status,
  edition: result.edition,
  hintIndex: result.hintIndex,
});

export const apiRequestToPuzzleResult = (
  record: PuzzleResultRequest
): Omit<PuzzleResult, "status"> => ({
  id: record.id,
  word: record.word,
  edition: record.edition || 1,
  date: new Date(record.date),
  guesses: record.attempts,
  hintIndex: record.hintIndex || 0,
});

/**
 * Word and Daily Puzzle utilities
 */
const getDb = () => admin.firestore();

export const wordsCollection = () => getDb().collection("words");
export const dailyPuzzlesCollection = () => getDb().collection("dailyPuzzles");

/**
 * Convert a Firestore document to a WordEntry
 */
export const firestoreToWordEntry = (
  doc: admin.firestore.DocumentSnapshot
): WordEntry | null => {
  if (!doc.exists) return null;

  const data = doc.data()!;
  const baseWord = {
    id: doc.id,
    category: data.category,
  };

  if (data.category === "common") {
    return baseWord as WordEntry;
  }

  return {
    ...baseWord,
    edition: data.edition,
    hints: data.hints || [],
    summary: data.summary || "",
    wikipediaUrl: data.wikipediaUrl || "",
    appearance: data.appearance
      ? {
          timesShown: data.appearance.timesShown || 0,
          firstShownDate:
            data.appearance.firstShownDate?.toDate() || new Date(),
          currentHintIndex: data.appearance.currentHintIndex || 0,
          lastHintRotation: data.appearance.lastHintRotation?.toDate(),
        }
      : undefined,
  } as WordEntry;
};

/**
 * Convert a WordEntry to Firestore data
 */
export const wordEntryToFirestore = (word: WordEntry): any => {
  const baseData = {
    id: word.id, // The word ID is included to ensure that when reconstructing WordEntry objects from Firestore data, the ID is available even if the document ID is not directly accessible. This prevents bugs where the ID would be missing from the reconstructed object.
    category: word.category,
  };

  if (word.category === "common") {
    return baseData;
  }

  const nerdWord = word as any;
  return {
    ...baseData,
    edition: nerdWord.edition,
    hints: nerdWord.hints || [],
    summary: nerdWord.summary || "",
    wikipediaUrl: nerdWord.wikipediaUrl || "",
    appearance: nerdWord.appearance
      ? {
          timesShown: nerdWord.appearance.timesShown || 0,
          firstShownDate: admin.firestore.Timestamp.fromDate(
            nerdWord.appearance.firstShownDate
          ),
          currentHintIndex: nerdWord.appearance.currentHintIndex || 0,
          lastHintRotation: nerdWord.appearance.lastHintRotation
            ? admin.firestore.Timestamp.fromDate(
                nerdWord.appearance.lastHintRotation
              )
            : null,
        }
      : null,
  };
};

/**
 * Convert a Firestore document to a DailyPuzzleSeed
 */
export const firestoreToDailyPuzzle = (
  doc: admin.firestore.DocumentSnapshot
): DailyPuzzleSeed | null => {
  if (!doc.exists) return null;

  const data = doc.data()!;
  return {
    date: doc.id, // Document ID is the date
    word: data.word as WordEntry,
  };
};

/**
 * Convert a DailyPuzzleSeed to Firestore data
 */
export const dailyPuzzleToFirestore = (puzzle: DailyPuzzleSeed): any => {
  return {
    word: wordEntryToFirestore(puzzle.word),
  };
};

/**
 * Get today's date in YYYY-MM-DD format
 */
export const getTodayDateString = (): string => {
  return new Date().toISOString().split("T")[0];
};

/**
 * Validate date format (YYYY-MM-DD)
 */
export const isValidDateFormat = (date: string): boolean => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  return regex.test(date) && !isNaN(Date.parse(date));
};
