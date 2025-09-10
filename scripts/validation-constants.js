/**
 * Shared validation constants for word management scripts
 */

// Word ID validation pattern - only uppercase letters allowed
export const WORD_ID_PATTERN = /^[A-Z]+$/;

// Available word categories
export const WORD_CATEGORIES = [
  "common",
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
