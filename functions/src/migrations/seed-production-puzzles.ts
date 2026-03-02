import * as admin from "firebase-admin";
import { WORD_DATA } from "../data/words";
import { getDateString } from "../shared/time";
import { wordEntryToFirestore } from "../utils";

// Initialize Firebase Admin SDK for emulator
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: "nerd-word-cfda3",
  });
}

const db = admin.firestore();

/**
 * PRODUCTION DAILY PUZZLE SEEDING
 *
 * First run: Schedules all words starting tomorrow
 * Future runs: Finds last scheduled puzzle and adds only new words after it
 */

async function seedProductionPuzzles() {
  console.log("🚀 Starting puzzle scheduling...");

  // Get all nerd words and sort by edition
  const allWords = WORD_DATA.filter((word) => word.category !== "common").sort(
    (a, b) => {
      const aEdition = (a as any).edition || 0;
      const bEdition = (b as any).edition || 0;
      return aEdition - bEdition;
    }
  );

  console.log(`📝 Found ${allWords.length} words total`);

  // Check if we already have scheduled puzzles
  // Get all puzzles and find the one with the latest date
  const allPuzzles = await db.collection("dailyPuzzles").get();

  let startDate: Date;
  let wordsToSchedule = allWords;
  let isFirstRun = allPuzzles.empty;

  if (isFirstRun) {
    // First run: start from tomorrow
    startDate = new Date();
    startDate.setDate(startDate.getDate() + 1);
    console.log(
      `📅 First run: scheduling all ${allWords.length} words from tomorrow`
    );
  } else {
    // Future runs: find last scheduled date and add only new words
    // Sort puzzle dates to find the latest one
    const puzzleDates = allPuzzles.docs
      .map((doc) => doc.id)
      .sort()
      .reverse();
    const lastDate = puzzleDates[0];
    const lastPuzzleDoc = allPuzzles.docs.find((doc) => doc.id === lastDate);
    const lastWord = lastPuzzleDoc?.data().word;
    const lastEdition = lastWord?.edition || 0;

    console.log(`📅 Last scheduled: ${lastDate} (edition ${lastEdition})`);

    // Filter to only words with higher edition numbers
    wordsToSchedule = allWords.filter(
      (w: any) => (w.edition || 0) > lastEdition
    );

    if (wordsToSchedule.length === 0) {
      console.log("✅ No new words to schedule!");
      return;
    }

    // Start the day after the last scheduled puzzle
    startDate = new Date(lastDate);
    startDate.setDate(startDate.getDate() + 1);
    console.log(
      `📝 Scheduling ${wordsToSchedule.length} new words starting ${
        getDateString(startDate)
      }`
    );
  }

  const batch = db.batch();

  try {
    for (let i = 0; i < wordsToSchedule.length; i++) {
      const puzzleDate = new Date(startDate);
      puzzleDate.setDate(startDate.getDate() + i);
      const dateString = getDateString(puzzleDate);

      const word = wordsToSchedule[i];
      const puzzleRef = db.collection("dailyPuzzles").doc(dateString);

      batch.set(puzzleRef, {
        word: wordEntryToFirestore(word),
        solveCount: 0,
        averageGuesses: 0,
        createdAt: new Date(),
        isGenerated: true,
        cycleLap: 1,
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

    const endDate = getDateString(
      new Date(
        startDate.getTime() + (wordsToSchedule.length - 1) * 24 * 60 * 60 * 1000
      )
    );

    console.log(`\n✅ Scheduled ${wordsToSchedule.length} words through ${endDate}`);
  } catch (error) {
    console.error("❌ Error seeding puzzles:", error);
    throw error;
  }
}

async function main() {
  try {
    await seedProductionPuzzles();
    console.log("🏁 Production seeding completed!");
    process.exit(0);
  } catch (error) {
    console.error("💥 Production seeding failed:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { seedProductionPuzzles };
