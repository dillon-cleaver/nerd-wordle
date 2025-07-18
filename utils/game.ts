import { WORD_DATA } from "@/constants/words";
import { colors } from "@/constants/styles";
import { WordCategory } from "@/types/word";
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
  const entry = WORD_DATA.find((w) => w.id === word);

  if (entry && entry.category !== "common" && entry.hints.length > 0) {
    return entry.hints[0];
  }

  return getDefaultHint(category);
};

export const getSummaryForWord = (
  word: string,
  category: WordCategory
): string => {
  const entry = WORD_DATA.find((w) => w.id === word);

  if (entry && entry.category !== "common" && entry.summary) {
    return entry.summary;
  }

  return getDefaultSummary(category);
};

export const getWikipediaLinkForWord = (word: string): string => {
  // Special cases where the word might need a different search term
  const specialCases: Record<string, string> = {
    // Tech terms that might need disambiguation
    EMAIL: "Email",
    VIRUS: "Computer_virus",
    CACHE: "Cache_(computing)",
    STACK: "Stack_(abstract_data_type)",
    CODES: "Computer_programming",
    FILES: "Computer_file",
    PINGS: "Ping_(networking_utility)",
    DEBUG: "Debugging",
    BYTES: "Byte",
    CLOUD: "Cloud_computing",
    LINUX: "Linux",
    TESLA: "Tesla,_Inc.",

    // Science terms that might need disambiguation
    ATOMS: "Atom",
    CELLS: "Cell_(biology)",
    GENES: "Gene",
    STARS: "Star",
    POLAR: "Polar_(disambiguation)",
    DATUM: "Data",
    MICRO: "Micro-",
    ASTRO: "Astronomy",
    FLORA: "Flora",
    OXIDE: "Oxide",
    HYDRO: "Hydrogen",
    GAMMA: "Gamma_ray",
    ORBIT: "Orbit",
    QUARK: "Quark",

    // Video game terms
    MARIO: "Mario_(character)",
    SONIC: "Sonic_the_Hedgehog_(character)",
    ZELDA: "Princess_Zelda",
    RUPEE: "Rupee_(The_Legend_of_Zelda)",
    PIXEL: "Pixel",
    COMBO: "Combo_(video_games)",
    LEVEL: "Level_(video_games)",
    BOSSY: "Boss_(video_games)",

    // Anime and manga terms
    MANGA: "Manga",
    OTAKU: "Otaku",
    MECHA: "Mecha",
    NINJA: "Ninja",
    SAMUR: "Samurai",
    YOKAI: "Yokai",
    CHIBI: "Chibi_(slang)",
    KAWAI: "Kawaii",
    GENKI: "Genki",
    SAKUR: "Cherry_blossom",
    JUTSU: "Ninjutsu",
    SENPU: "Whirlwind",
    HELLS: "Hell",
    SHONN: "Shonen_manga",

    // Fantasy and sci-fi terms
    MAGIC: "Magic_(supernatural)",
    ELVES: "Elf",
    DWARF: "Dwarf_(mythology)",
    SPOCK: "Spock",
    FORCE: "The_Force",
    QUEST: "Quest",
    CYBER: "Cyber-",

    // Literature terms
    NOVEL: "Novel",
    POETS: "Poetry",
    STORY: "Story",
    PROSE: "Prose",
    FABLE: "Fable",
    VERSE: "Verse_(poetry)",
    EDGAR: "Edgar_Allan_Poe",
    HOMER: "Homer",

    // Movie terms
    PIXAR: "Pixar",
    ACTOR: "Actor",
    SCENE: "Scene_(filmmaking)",
    SCORE: "Film_score",
    THEME: "Theme_(narrative)",
    GENRE: "Film_genre",
    CAMEO: "Cameo_appearance",
    SHORT: "Short_film",

    // Tabletop and board games
    CHESS: "Chess",
    DICEY: "Dice",
    TOKEN: "Game_token",
    HEXES: "Hexagon",
    DECKS: "Playing_card",
    CHECK: "Check_(chess)",
    SPELL: "Magic_spell",
    CARDS: "Playing_card",
    BOARD: "Board_game",

    // Superheroes
    JOKER: "Joker_(character)",
    ROBIN: "Robin_(character)",
    BLADE: "Blade_(character)",
    FLASH: "Flash_(DC_Comics_character)",
    BEAST: "Beast_(comics)",
    SPAWN: "Spawn_(character)",
    VENOM: "Venom_(character)",
    LOGAN: "Wolverine_(character)",
  };

  // Check if we have a special case for this word
  const searchTerm = specialCases[word] || word;

  // Convert to Wikipedia URL format (replace spaces with underscores)
  const formattedTerm = searchTerm.replace(/\s+/g, "_");

  return `https://en.wikipedia.org/wiki/${formattedTerm}`;
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
  const categoriesExcludingCommon = Array.from(
    new Set(
      WORD_DATA.filter((word) => word.category !== "common").map(
        (word) => word.category
      )
    )
  ) as WordCategory[];

  const selectedCategory = sample(categoriesExcludingCommon);
  const convertedCategory = convertCategory(selectedCategory);

  const wordsInCategory = WORD_DATA.filter(
    (word) => word.category === selectedCategory
  ).map((word) => word.id);

  const answer = sample(wordsInCategory);

  return {
    category: convertedCategory,
    originalCategory: selectedCategory,
    answer: answer,
  };
}
