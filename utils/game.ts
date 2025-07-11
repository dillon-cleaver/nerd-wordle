import { WordCategory, WORDS, HINTS, SUMMARIES, Word } from "@/constants/words";
import { sample } from "./sample";
import { colors } from "@/constants/styles";

const convertCategory = (word: WordCategory): string => {
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
      return "A word that tells a story.";
    case "common":
    default:
      return "A common word that's anything but ordinary.";
  }
};

const getDefaultSummary = (category: WordCategory): string => {
  switch (category) {
    case "animeAndManga":
      return "A summary of a word from Japanese anime and manga culture.";
    case "fantasyAndSciFi":
      return "A summary of a word from the realms of fantasy and science fiction.";
    case "science":
      return "A summary of a fundamental scientific term.";
    case "tabletopAndBoardGames":
      return "A summary of a word from tabletop and board games.";
    case "techAndInternetCulture":
      return "A summary of a word from technology and internet culture.";
    case "videoGames":
      return "A summary of a word from the world of video games.";
    case "superheroes":
      return "A summary of a word from superhero lore.";
    case "movies":
      return "A summary of a word from the world of movies.";
    case "literature":
      return "A summary of a word from literature.";
    case "common":
    default:
      return "A summary of a common word.";
  }
};

export const getHintForWord = (
  word: string,
  category: WordCategory
): string => {
  // Check if there's a specific hint for this word
  const specificHint = HINTS[word];
  if (specificHint) {
    return specificHint;
  }

  // Fall back to a default hint based on category
  return getDefaultHint(category);
};

export const getSummaryForWord = (
  word: string,
  category: WordCategory
): string => {
  // Check if there's a specific summary for this word
  const specificSummary = SUMMARIES[word];
  if (specificSummary) {
    return specificSummary;
  }

  // Fall back to a default summary based on category
  return getDefaultSummary(category);
};

export const getCategoryColor = (category: string): string => {
  switch (category) {
    case "videoGames":
      return colors.categories.videoGames;
    case "science":
      return colors.categories.science;
    case "fantasyAndSciFi":
      return colors.categories.fantasyAndSciFi;
    case "animeAndManga":
      return colors.categories.animeAndManga;
    case "tabletopAndBoardGames":
      return colors.categories.tabletopAndBoardGames;
    case "techAndInternetCulture":
      return colors.categories.techAndInternetCulture;
    case "superheroes":
      return colors.categories.superheroes;
    case "movies":
      return colors.categories.movies;
    case "literature":
      return colors.categories.literature;
    default:
      return colors.categories.techAndInternetCulture;
  }
};

export const getCategoryTextColor = (category: string) => {
  switch (category) {
    case "videoGames":
      return colors.neutral.black;
    case "science":
      return colors.neutral.black;
    case "fantasyAndSciFi":
      return colors.neutral.black;
    case "animeAndManga":
      return colors.neutral.black;
    case "tabletopAndBoardGames":
      return colors.neutral.black;
    case "techAndInternetCulture":
      return colors.neutral.black;
    case "superheroes":
      return colors.neutral.white;
    case "movies":
      return colors.neutral.black;
    case "literature":
      return colors.neutral.white;
    default:
      return colors.categories.techAndInternetCulture;
  }
};

export function initializeGame() {
  const categoriesExcludingCommon = Object.keys(WORDS).filter(
    (category) => category !== "common"
  ) as WordCategory[];

  const selectedCategory = sample(categoriesExcludingCommon);
  const convertedCategory = convertCategory(selectedCategory);

  return {
    category: convertedCategory,
    originalCategory: selectedCategory,
    answer: sample([...WORDS[selectedCategory]]),
  };
}
