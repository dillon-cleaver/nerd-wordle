import * as admin from "firebase-admin";
import { WORD_DATA } from "../../../constants/words";
import { wordEntryToFirestore } from "../utils";

// Initialize Firebase Admin SDK for emulator
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: "nerd-word-cfda3",
  });
}

const db = admin.firestore();
if (process.env.FIRESTORE_EMULATOR_HOST) {
  console.log(
    `🔧 Using Firestore emulator at ${process.env.FIRESTORE_EMULATOR_HOST}`
  );
} else {
  console.log("🔧 Using production Firestore");
}

/**
 * ALPHA/BETA TESTING ONLY
 *
 * This seeds daily puzzles with your marked alpha/beta words for testing.
 * After testing is complete, use seed-production-puzzles.ts for the real algorithm.
 */

async function seedAlphaBetaPuzzles() {
  console.log("🧪 [ALPHA/BETA] Starting test puzzle seeding...");

  // Get all nerd words and filter by alpha/beta flags
  const allNerdWords = WORD_DATA.filter((word) => word.category !== "common");

  // Filter and sort alpha words by edition (lowest first)
  const alphaWords = allNerdWords
    .filter((word: any) => word.alpha === true)
    .sort((a, b) => {
      const aEdition = (a as any).edition || 0;
      const bEdition = (b as any).edition || 0;
      return aEdition - bEdition;
    });

  // Filter and sort beta words by edition (lowest first)
  const betaWords = allNerdWords
    .filter((word: any) => word.beta === true)
    .sort((a, b) => {
      const aEdition = (a as any).edition || 0;
      const bEdition = (b as any).edition || 0;
      return aEdition - bEdition;
    });

  // Combine: alpha words first, then beta words
  const testWords = [...alphaWords, ...betaWords];

  console.log(`📝 Selected ${testWords.length} words for Alpha/Beta testing:`);
  console.log(`   🔴 Alpha: ${alphaWords.length} words`);
  console.log(`   🔵 Beta: ${betaWords.length} words`);

  const batch = db.batch();
  const startDate = new Date();

  try {
    for (let i = 0; i < testWords.length; i++) {
      const puzzleDate = new Date(startDate);
      puzzleDate.setDate(startDate.getDate() + i);
      const dateString = puzzleDate.toISOString().split("T")[0];

      const word = testWords[i];
      const puzzleRef = db.collection("dailyPuzzles").doc(dateString);

      batch.set(puzzleRef, {
        word: wordEntryToFirestore(word),
        solveCount: 0,
        averageGuesses: 0,
        createdAt: new Date(),
        isGenerated: false,
        cycleLap: 1,
        testPhase: (word as any).alpha ? "alpha" : "beta", // Track test phase
      });
    }

    await batch.commit();
    console.log("✅ Alpha/Beta puzzles seeded successfully!");
    console.log(
      `📅 Schedule: ${alphaWords.length} Alpha → ${betaWords.length} Beta words`
    );
  } catch (error) {
    console.error("❌ Error seeding Alpha/Beta puzzles:", error);
    throw error;
  }
}

async function main() {
  try {
    await seedAlphaBetaPuzzles();
    console.log("🏁 Alpha/Beta seeding completed!");
    process.exit(0);
  } catch (error) {
    console.error("💥 Alpha/Beta seeding failed:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { seedAlphaBetaPuzzles };
