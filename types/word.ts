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
  wikipediaUrl: string; // Wikipedia link for additional context
  appearance?: {
    timesShown: number; // How many times this word has appeared globally
    firstShownDate: Date; // When first shown
    currentHintIndex: number; // Which hint is currently being shown
    lastHintRotation?: Date; // When hint last changed
  };
};

type WordEntry = CommonWordEntry | NerdWordEntry;

export { WordId, WordCategory, WordEntry, CommonWordEntry, NerdWordEntry };
