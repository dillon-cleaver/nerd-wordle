import { WordCategory, WORDS } from "@/constants/words";
import { sample } from "./sample";

const convertCategory = (word: WordCategory) => {
  // TODO: Use a map / record instead?
  let convertedCategory = word;
  switch (convertedCategory) {
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
  }
};

export function initializeGame() {
  // Object.keys(WORDS): Gets an array of all word categories (like "fantasyAndSciFi", "science", "common", etc.)
  const categoriesExcludingCommon = Object.keys(WORDS).filter(
    // Removes "common" from that list. Now you’re only choosing from your “themed” categories.
    (category) => category !== "common"
  ) as WordCategory[];

  // sample(categoriesExcludingCommon): Randomly picks one of the remaining categories (not "common") to choose an answer from.
  const selectedCategory = sample(categoriesExcludingCommon);
  const convertedCategory = convertCategory(selectedCategory);

  return {
    category: convertedCategory,
    originalCategory: selectedCategory,
    // WORDS[selectedCategory]: Picks a word from that category as the answer.
    answer: sample([...WORDS[selectedCategory]]),
  };
}
