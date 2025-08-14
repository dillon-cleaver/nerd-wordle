import * as admin from "firebase-admin";
import { WORD_DATA } from "../../../constants/words";
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
 * Create daily puzzles for the next 11 days for Alpha testing
 * Uses the first 11 NerdWords by edition to test daily cycling and category diversity
 *
 * TODO: ALPHA ONLY - Replace with proper puzzle generation algorithm for production
 * Production should use intelligent word selection based on usage stats, difficulty,
 * category diversity, and time since last appearance.
 */

async function seedDailyPuzzles() {
  console.log("🗓️  Starting daily puzzles seeding for Alpha (11 days)...");

  // TODO: ALPHA ONLY - Using fixed 11 words for testing
  // Production should generate puzzles dynamically based on algorithm
  const nerdWords = WORD_DATA.filter((word) => word.category !== "common");

  // Sort by edition to get the exact first 11 NerdWords in order
  nerdWords.sort((a, b) => {
    const aEdition = (a as any).edition || 0;
    const bEdition = (b as any).edition || 0;
    return aEdition - bEdition;
  });

  // TODO: ALPHA ONLY - Take first 11 for testing, production should use full algorithm
  const testWords = nerdWords.slice(0, 11);

  console.log(
    `📝 Selected first ${testWords.length} NerdWords by edition for Alpha testing:`
  );
  testWords.forEach((word, index) => {
    console.log(
      `   ${index + 1}. ${word.id} (${word.category}, edition ${
        (word as any).edition
      })`
    );
  });

  const batch = db.batch();
  const startDate = new Date();

  try {
    for (let i = 0; i < testWords.length; i++) {
      const puzzleDate = new Date(startDate);
      puzzleDate.setDate(startDate.getDate() + i);
      const dateString = puzzleDate.toISOString().split("T")[0]; // YYYY-MM-DD

      const word = testWords[i];
      const puzzleRef = db.collection("dailyPuzzles").doc(dateString);

      batch.set(puzzleRef, {
        word: wordEntryToFirestore(word),
        solveCount: 0,
        averageGuesses: 0,
        createdAt: new Date(),
        isGenerated: false, // false = manually seeded, true = algorithm generated
        cycleLap: 1, // Track which cycle of the word list this is
      });

      console.log(
        `📅 ${dateString}: ${word.id} (${word.category}, edition ${
          (word as any).edition || "N/A"
        })`
      );
    }

    await batch.commit();
    console.log("🎉 Daily puzzles seeding completed successfully!");
    console.log(
      `📅 Alpha schedule: ${testWords.length} puzzles from ${
        new Date(startDate).toISOString().split("T")[0]
      } to ${
        new Date(
          startDate.getTime() + (testWords.length - 1) * 24 * 60 * 60 * 1000
        )
          .toISOString()
          .split("T")[0]
      }`
    );
    console.log(
      "🔄 This will test daily cycling through different categories and editions"
    );

    // Verify the migration
    const puzzlesSnapshot = await db.collection("dailyPuzzles").get();
    console.log(
      `📋 Verification: ${puzzlesSnapshot.size} daily puzzles now exist in Firestore`
    );
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
      console.log(
        `⚠️  Warning: Found ${existingCount} existing daily puzzles in Firestore`
      );
      console.log("This script will add new puzzles starting from today.");
      console.log("Proceeding in 3 seconds... (Ctrl+C to cancel)");

      await new Promise((resolve) => setTimeout(resolve, 3000));
    }

    await seedDailyPuzzles();
    console.log("🏁 Daily puzzles seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("💥 Daily puzzles seeding failed:", error);
    process.exit(1);
  }
}

// Run the migration if this file is executed directly
if (require.main === module) {
  main();
}

export { seedDailyPuzzles, checkExistingPuzzles };
