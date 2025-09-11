/**
 * Shared validation constants for word management scripts
 */

// Word ID validation pattern - exactly 5 uppercase letters (Wordle standard)
export const WORD_ID_PATTERN = /^[A-Z]{5}$/;

// Special category for basic words (no additional metadata required)
export const COMMON_CATEGORY = "common";

// Available word categories
export const WORD_CATEGORIES = [
  COMMON_CATEGORY,
  "movies",
  "literature",
  "techAndInternetCulture",
  "science",
  "videoGames",
  "fantasyAndSciFi",
  "superheroes",
  "tabletopAndBoardGames",
  "animeAndManga",
];

// Warning detection pattern for stderr filtering
export const WARNING_PATTERN = /(warning|warn|deprecationwarning)/i;
