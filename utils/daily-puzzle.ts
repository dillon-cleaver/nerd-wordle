import { WordEntry } from "@/types/word";

type DailyPuzzleSeed = {
  date: string; // ISO (YYYY-MM-DD)
  word: WordEntry; // The word includes its own appearance data
};

/**
 * ---------------------------------------------------------------------------
 * DAILY PUZZLE SEED (TEMP STUB)
 * ------------------------------------------------------------
 * In the finished app this object will be hydrated from Firestore
 * (or another backend endpoint) so that **every player sees the
 * same puzzle on the same calendar date**.
 *
 * • `date` → ISO string that identifies the puzzle day.
 * • `word` → The correct answer for that day, including its appearance data.
 *
 * The word's `appearance.currentHintIndex` tells us which hint to show.
 * During local‑only development the game still picks the word at
 * random inside `initializeGame()`, so this is just a stub.
 *
 * When the backend is ready, simply replace this static constant with
 * a fetch/helper that returns the real daily seed—and delete these
 * “ignored” comments.
 */
const today = new Date().toISOString().split("T")[0]; // Gets "YYYY-MM-DD"

const TODAY_PUZZLE: DailyPuzzleSeed = {
  date: today,
  word: {
    id: "ZELDA",
    category: "videoGames",
    edition: 5,
    summary: "",
    hints: [],
    appearance: {
      timesShown: 1,
      firstShownDate: new Date(),
      currentHintIndex: 0,
      lastHintRotation: new Date(),
    },
  },
};

export { DailyPuzzleSeed, TODAY_PUZZLE };
