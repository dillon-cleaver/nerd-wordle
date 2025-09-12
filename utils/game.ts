import { colors } from "@/constants/styles";
import { WordCategory, WordEntry, NerdWordEntry } from "@/types/word";
import { sample } from "./sample";

/**
 * Pure utility functions that don't depend on word data
 * These can be used without WordDataContext
 */

export const convertCategory = (word: WordCategory): string => {
  switch (word) {
    case "animeAndManga":
      return "Anime and Manga";
    case "fantasyAndSciFi":
      return "Fantasy and Sci-Fi";
    case "science":
      return "Science";
    case "tabletopAndBoardGames":
      return "Tabletop and Board Games";
    case "techAndInternetCulture":
      return "Tech and Internet Culture";
    case "videoGames":
      return "Video Games";
    case "superheroes":
      return "Superheroes";
    case "movies":
      return "Movies";
    case "literature":
      return "Literature";
    case "common":
      break;
    default:
      return "Fantasy and Sci-Fi";
  }
  return "Fantasy and Sci-Fi";
};

const getDefaultHint = (category: WordCategory): string => {
  switch (category) {
    case "animeAndManga":
      return "Kawaii! This one's straight from Japan.";
    case "fantasyAndSciFi":
      return "A word from the realms of imagination and future.";
    case "science":
      return "A scientific term that's fundamental to understanding.";
    case "tabletopAndBoardGames":
      return "Roll the dice and hope for the best!";
    case "techAndInternetCulture":
      return "Tech-savvy and internet-culture approved.";
    case "videoGames":
      return "Press start and begin your quest!";
    case "superheroes":
      return "With great power comes great responsibility.";
    case "movies":
      return "Lights, camera, action!";
    case "literature":
      return "From the pages of great literature.";
    case "common":
      return "A common word that's essential to know.";
    default:
      return "A mysterious word from the vast universe of knowledge.";
  }
};

export const getHintForWord = (
  wordEntry: WordEntry,
  hintIndex: number = 0
): string => {
  // If word has custom hints, use them (only NerdWordEntry has hints)
  if (wordEntry.category !== "common") {
    const nerdWord = wordEntry as NerdWordEntry;
    if (nerdWord.hints && nerdWord.hints.length > 0) {
      const validIndex = Math.max(
        0,
        Math.min(hintIndex, nerdWord.hints.length - 1)
      );
      return nerdWord.hints[validIndex];
    }
  }

  // Fallback to default hint for category
  return getDefaultHint(wordEntry.category);
};

export const getSummaryForWord = (wordEntry: WordEntry): string | undefined => {
  // Only NerdWordEntry has summary
  if (wordEntry.category !== "common") {
    return (wordEntry as NerdWordEntry).summary;
  }
  return undefined;
};

export const getCategoryColor = (category: string): string => {
  switch (category) {
    case "animeAndManga":
      return colors.categories.animeAndManga;
    case "fantasyAndSciFi":
      return colors.categories.fantasyAndSciFi;
    case "science":
      return colors.categories.science;
    case "tabletopAndBoardGames":
      return colors.categories.tabletopAndBoardGames;
    case "techAndInternetCulture":
      return colors.categories.techAndInternetCulture;
    case "videoGames":
      return colors.categories.videoGames;
    case "superheroes":
      return colors.categories.superheroes;
    case "movies":
      return colors.categories.movies;
    case "literature":
      return colors.categories.literature;
    case "common":
      return colors.neutral.darkGray; // Use dark gray for common words
    default:
      return colors.categories.fantasyAndSciFi;
  }
};

export const getCategoryTextColor = (_category: string) => {
  // Use white text for better contrast on colored backgrounds
  return colors.neutral.white;
};

/**
 * Initialize game with daily word (simplified version)
 *
 * @deprecated Use initializeGameWithData() or initializeGameWithWords() for new code
 *
 * This function is kept for backward compatibility with the daily puzzle hook.
 * It only returns basic game metadata (category, answer) without full game state.
 *
 * When to use:
 * - Legacy daily puzzle hook integration
 * - When you only need category/answer metadata
 *
 * When to use alternatives:
 * - initializeGameWithData(): When you need full game state (guesses, status, etc.)
 * - initializeGameWithWords(): When you need random word selection fallback
 *
 * @param dailyWord - The word entry for today's puzzle
 * @returns Basic game metadata for backward compatibility
 */
export function initializeGame(dailyWord: WordEntry) {
  const convertedCategory = convertCategory(dailyWord.category);
  return {
    category: convertedCategory,
    originalCategory: dailyWord.category,
    answer: dailyWord.id,
  };
}

/**
 * Initialize game with word data (pure function)
 * This version requires words to be passed in rather than importing them
 */
export function initializeGameWithData(
  words: WordEntry[],
  dailyWord?: WordEntry
) {
  if (dailyWord) {
    return {
      currentWord: dailyWord,
      guesses: [],
      currentGuess: "",
      gameStatus: "playing" as const,
      attempts: 1,
    };
  }

  // Filter to nerd words only (exclude common)
  const nerdWords = words.filter((word) => word.category !== "common");

  if (nerdWords.length === 0) {
    throw new Error("No nerd words available for game initialization");
  }

  // Pick a random nerd word
  const randomWord = sample(nerdWords);

  return {
    currentWord: randomWord,
    guesses: [],
    currentGuess: "",
    gameStatus: "playing" as const,
    attempts: 1,
  };
}

/**
 * Get words by category (pure function)
 * This version requires words to be passed in rather than importing them
 */
export function getWordsByCategory(
  words: WordEntry[],
  category: WordCategory
): WordEntry[] {
  return words.filter((word) => word.category === category);
}

/**
 * Initialize game with daily word or random selection (pure function)
 */
export function initializeGameWithWords(
  words: WordEntry[],
  dailyWord?: WordEntry
) {
  // If a daily word is provided, use it instead of random selection
  if (dailyWord) {
    const convertedCategory = convertCategory(dailyWord.category);
    return {
      category: convertedCategory,
      originalCategory: dailyWord.category,
      answer: dailyWord.id,
    };
  }

  // Fallback to random word selection (for development/testing)
  const categoriesExcludingCommon = Array.from(
    new Set(
      words
        .filter((word) => word.category !== "common")
        .map((word) => word.category)
    )
  ) as WordCategory[];

  const selectedCategory = sample(categoriesExcludingCommon);
  const convertedCategory = convertCategory(selectedCategory);

  const wordsInCategory = words
    .filter((word) => word.category === selectedCategory)
    .map((word) => word.id);

  const answer = sample(wordsInCategory);

  return {
    category: convertedCategory,
    originalCategory: selectedCategory,
    answer: answer,
  };
}

/**
 * Get category words as string array (pure function)
 */
export function getCategoryWords(
  words: WordEntry[],
  category: WordCategory
): string[] {
  return words
    .filter((word) => word.category === category)
    .map((word) => word.id);
}
