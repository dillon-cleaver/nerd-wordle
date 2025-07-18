type WordId = string;

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

type CommonWordEntry = {
  id: WordId;
  category: "common";
};

type NerdWordEntry = {
  id: WordId;
  category: Exclude<WordCategory, "common">;
  edition: number;
  hints: string[];
  summary: string;
};

type WordEntry = CommonWordEntry | NerdWordEntry;

export { WordId, WordCategory, WordEntry, CommonWordEntry, NerdWordEntry };
