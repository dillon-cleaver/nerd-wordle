import { WordCategory, WORDS } from "@/constants/words";
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
