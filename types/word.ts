import { WORD_DATA } from "@/constants/words";

type WordId = keyof typeof WORD_DATA;

type WordCategory =
  | "common"
  | "movies"
  | "literature"
  | "fantasyAndSciFi"
  | "science"
  | "videoGames"
  | "animeAndManga"
  | "tabletopAndBoardGames"
  | "techAndInternetCulture"
  | "superheroes";

type WordMeta = {
  category: WordCategory;
  edition?: number;
  hints?: string[];
  summary?: string;
};

type WordEntry = { id: WordId } & WordMeta;

export { WordId, WordMeta, WordCategory, WordEntry };
