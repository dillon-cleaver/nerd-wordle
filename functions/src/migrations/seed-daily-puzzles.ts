import * as admin from "firebase-admin";
import { WORD_DATA } from "../data/words";
import { wordEntryToFirestore } from "../utils";

// Initialize Firebase Admin SDK for emulator
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: "nerd-word-cfda3", // Your project ID from firebaseConfig.ts
  });
}

// Configure Firestore to use the emulator if specified
const db = admin.firestore();
if (process.env.FIRESTORE_EMULATOR_HOST) {
  // Already configured via environment variable
  console.log(
    `🔧 Using Firestore emulator at ${process.env.FIRESTORE_EMULATOR_HOST}`
  );
} else {
  console.log("� Using production Firestore");
}

/**
 * Create daily puzzles using words marked for testing
 * Iterates through marked words by edition number (lowest first)
 */

async function seedDailyPuzzles() {
  if (process.env.FIRESTORE_EMULATOR_HOST) {
    console.log("🗓️  Starting daily puzzles seeding...");
  }

  // Get all nerd words and filter by test flags
  const allNerdWords = WORD_DATA.filter((word) => word.category !== "common");

  // Filter and sort words with alpha flag by edition (lowest first)
  const firstPhaseWords = allNerdWords
    .filter((word: any) => word.alpha === true)
    .sort((a, b) => {
      const aEdition = (a as any).edition || 0;
      const bEdition = (b as any).edition || 0;
      return aEdition - bEdition;
    });

  // Filter and sort words with beta flag by edition (lowest first)
  const secondPhaseWords = allNerdWords
    .filter((word: any) => word.beta === true)
    .sort((a, b) => {
      const aEdition = (a as any).edition || 0;
      const bEdition = (b as any).edition || 0;
      return aEdition - bEdition;
    });

  // Combine: first phase words first, then second phase words
  const selectedWords = [...firstPhaseWords, ...secondPhaseWords];

  if (process.env.FIRESTORE_EMULATOR_HOST) {
    console.log(`📝 Selected ${selectedWords.length} words for testing:`);
    console.log(`   First phase: ${firstPhaseWords.length} words`);
    console.log(`   Second phase: ${secondPhaseWords.length} words`);

    selectedWords.forEach((word, index) => {
      const isFirstPhase = (word as any).alpha === true;
      const phase = isFirstPhase ? "FIRST" : "SECOND";
      console.log(
        `   ${index + 1}. ${word.id} (${word.category}, edition ${
          (word as any).edition
        }) [${phase}]`
      );
    });
  }

  const batch = db.batch();
  const startDate = new Date();

  try {
    for (let i = 0; i < selectedWords.length; i++) {
      const puzzleDate = new Date(startDate);
      puzzleDate.setDate(startDate.getDate() + i);
      const dateString = puzzleDate.toISOString().split("T")[0]; // YYYY-MM-DD

      const word = selectedWords[i];
      const puzzleRef = db.collection("dailyPuzzles").doc(dateString);

      batch.set(puzzleRef, {
        word: wordEntryToFirestore(word),
        solveCount: 0,
        averageGuesses: 0,
        createdAt: new Date(),
        isGenerated: false, // false = manually seeded, true = algorithm generated
        cycleLap: 1, // Track which cycle of the word list this is
      });

      if (process.env.FIRESTORE_EMULATOR_HOST) {
        console.log(
          `📅 ${dateString}: ${word.id} (${word.category}, edition ${
            (word as any).edition || "N/A"
          })`
        );
      }
    }

    await batch.commit();

    if (process.env.FIRESTORE_EMULATOR_HOST) {
      console.log("🎉 Daily puzzles seeding completed successfully!");
      console.log(
        `📅 Schedule: ${selectedWords.length} puzzles from ${
          new Date(startDate).toISOString().split("T")[0]
        } to ${
          new Date(
            startDate.getTime() +
              (selectedWords.length - 1) * 24 * 60 * 60 * 1000
          )
            .toISOString()
            .split("T")[0]
        }`
      );
      console.log(
        `🔄 Order: ${firstPhaseWords.length} first phase → ${secondPhaseWords.length} second phase (sorted by edition)`
      );

      // Verify the migration
      const puzzlesSnapshot = await db.collection("dailyPuzzles").get();
      console.log(
        `📋 Verification: ${puzzlesSnapshot.size} daily puzzles now exist in Firestore`
      );
    }
  } catch (error) {
    console.error("❌ Error during daily puzzles seeding:", error);
    throw error;
  }
}

/**
 * Check if dailyPuzzles collection already has data
 */
async function checkExistingPuzzles(): Promise<number> {
  const totalSnapshot = await db.collection("dailyPuzzles").get();
  return totalSnapshot.size;
}

async function main() {
  try {
    const existingCount = await checkExistingPuzzles();

    if (existingCount > 0) {
      if (process.env.FIRESTORE_EMULATOR_HOST) {
        console.log(
          `⚠️  Warning: Found ${existingCount} existing daily puzzles in Firestore`
        );
        console.log("This script will add new puzzles starting from today.");
        console.log("Proceeding in 3 seconds... (Ctrl+C to cancel)");
      }

      await new Promise((resolve) => setTimeout(resolve, 3000));
    }

    await seedDailyPuzzles();

    if (process.env.FIRESTORE_EMULATOR_HOST) {
      console.log("🏁 Daily puzzles seeding completed successfully!");
    }
    process.exit(0);
  } catch (error) {
    if (process.env.FIRESTORE_EMULATOR_HOST) {
      console.error("💥 Daily puzzles seeding failed:", error);
    }
    process.exit(1);
  }
}

// Run the migration if this file is executed directly
if (require.main === module) {
  main();
}

export { seedDailyPuzzles, checkExistingPuzzles };
