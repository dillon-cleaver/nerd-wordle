import { WordCategory, WORDS } from "@/constants/words";
import { sample } from "./sample";

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
    case "common":
      break;
    default:
      return "Fantasy and Sci-Fi";
  }
  return "Fantasy and Sci-Fi";
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
