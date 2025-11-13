import { WordCategory } from "@/types/word";
import { CollectedWord } from "@/hooks/useCollectedWords";
import { convertCategory, getCategoryColor, getCategoryTextColor } from "./game";

export type CategoryInfo = {
  id: WordCategory | "all";
  displayName: string;
  backgroundColor: string;
  textColor: string;
  wordCount: number;
  words: CollectedWord[];
};

/**
 * Get all categories with their collected word counts
 */
export const getCategoriesWithCounts = (
  collectedWords: CollectedWord[]
): CategoryInfo[] => {
  // Define all possible categories (excluding 'common')
  const allCategories: Exclude<WordCategory, "common">[] = [
    "videoGames",
    "superheroes",
    "fantasyAndSciFi",
    "animeAndManga",
    "science",
    "movies",
    "literature",
    "tabletopAndBoardGames",
    "techAndInternetCulture",
  ];

  // Count words per category
  const categoryMap = new Map<Exclude<WordCategory, "common">, CollectedWord[]>();
  
  collectedWords.forEach((word) => {
    const existing = categoryMap.get(word.category) || [];
    categoryMap.set(word.category, [...existing, word]);
  });

  // Create category info objects
  const categories: CategoryInfo[] = allCategories.map((category) => {
    const words = categoryMap.get(category) || [];
    return {
      id: category,
      displayName: convertCategory(category),
      backgroundColor: getCategoryColor(category),
      textColor: getCategoryTextColor(category),
      wordCount: words.length,
      words,
    };
  });

  // Add "All" category at the beginning
  const allCategory: CategoryInfo = {
    id: "all",
    displayName: "All",
    backgroundColor: "rainbow", // Special marker for rainbow gradient
    textColor: "#000000",
    wordCount: collectedWords.length,
    words: collectedWords,
  };

  return [allCategory, ...categories];
};

/**
 * Get a specific category by ID
 */
export const getCategoryById = (
  categoryId: string,
  collectedWords: CollectedWord[]
): CategoryInfo | null => {
  const categories = getCategoriesWithCounts(collectedWords);
  return categories.find((cat) => cat.id === categoryId) || null;
};

/**
 * Create rainbow gradient colors for the "All" category
 */
export const getRainbowGradientColors = (): [string, string, ...string[]] => {
  return [
    "#FF0000", // Red
    "#FF7F00", // Orange
    "#FFFF00", // Yellow
    "#00FF00", // Green
    "#0000FF", // Blue
    "#4B0082", // Indigo
    "#9400D3", // Violet
  ];
};
