import * as admin from "firebase-admin";
import { WORD_DATA } from "../data/words";
import { wordEntryToFirestore } from "../utils";

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: "nerd-word-cfda3",
  });
}

const db = admin.firestore();

/**
 * RESEED DAILY PUZZLES FROM TODAY
 *
 * Non-destructive: only writes new puzzle documents, never deletes existing ones.
 * Starts from today and schedules all nerd words (edition 1 → N) sequentially.
 * Use when the existing schedule has expired and needs to restart from scratch.
 */
async function reseedFromToday() {
  // Get all nerd words sorted by edition
  const wordsToSchedule = WORD_DATA.filter(
    (word) => word.category !== "common"
  ).sort((a, b) => {
    const aEdition = (a as any).edition || 0;
    const bEdition = (b as any).edition || 0;
    return aEdition - bEdition;
  });

  const today = new Date();
  const todayString = today.toISOString().split("T")[0];

  console.log(`🚀 Reseeding from today (${todayString})...`);
  console.log(`📝 Found ${wordsToSchedule.length} nerd words`);

  const batch = db.batch();

  try {
    for (let i = 0; i < wordsToSchedule.length; i++) {
      const puzzleDate = new Date(today);
      puzzleDate.setDate(today.getDate() + i);
      const dateString = puzzleDate.toISOString().split("T")[0];

      const word = wordsToSchedule[i];
      const puzzleRef = db.collection("dailyPuzzles").doc(dateString);

      batch.set(puzzleRef, {
        word: wordEntryToFirestore(word),
        solveCount: 0,
        averageGuesses: 0,
        createdAt: new Date(),
        isGenerated: true,
        cycleLap: 2,
        algorithm: "edition-based-v1",
      });

      // Show first 5 and last 5
      if (i < 5 || i >= wordsToSchedule.length - 5) {
        console.log(
          `   ${dateString}: ${word.id} (edition ${(word as any).edition})`
        );
      } else if (i === 5) {
        console.log(`   ... ${wordsToSchedule.length - 10} more ...`);
      }
    }

    await batch.commit();

    const endDate = new Date(today);
    endDate.setDate(today.getDate() + wordsToSchedule.length - 1);
    const endDateString = endDate.toISOString().split("T")[0];

    console.log(
      `\n✅ Scheduled ${wordsToSchedule.length} words through ${endDateString}`
    );
  } catch (error) {
    console.error("❌ Error reseeding puzzles:", error);
    throw error;
  }
}

async function main() {
  try {
    await reseedFromToday();
    console.log("🏁 Reseed completed!");
    process.exit(0);
  } catch (error) {
    console.error("💥 Reseed failed:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { reseedFromToday };
