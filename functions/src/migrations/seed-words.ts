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
 * Migration script to seed Firestore words collection with existing WORD_DATA
 *
 * Run this script to populate the Firestore words collection with all
 * the words currently defined in constants/words.ts
 *
 * Usage:
 * 1. Build the functions: cd functions && npm run build
 * 2. Run this script: node lib/migrations/seed-words.js
 */

async function seedWordsCollection() {
  console.log("🌱 Starting words collection seeding...");
  console.log(`📊 Total words to migrate: ${WORD_DATA.length}`);

  let totalProcessed = 0;

  try {
    // Process words in batches of 500 (Firestore limit)
    // Process words in batches of 450 (slightly below Firestore limit for safety)
    const BATCH_SIZE = 450;

    for (let i = 0; i < WORD_DATA.length; i += BATCH_SIZE) {
      const batch = db.batch();
      const endIndex = Math.min(i + BATCH_SIZE, WORD_DATA.length);

      for (let j = i; j < endIndex; j++) {
        const word = WORD_DATA[j];
        const wordRef = db.collection("words").doc(word.id);
        const firestoreData = wordEntryToFirestore(word);
        batch.set(wordRef, firestoreData);
      }

      await batch.commit();
      totalProcessed += endIndex - i;
      console.log(
        `✅ Committed batch: ${totalProcessed}/${WORD_DATA.length} words`
      );
    }

    console.log("🎉 Words collection seeding completed successfully!");

    // Verify the migration
    const wordsSnapshot = await db.collection("words").get();
    console.log(
      `📋 Verification: ${wordsSnapshot.size} words now exist in Firestore`
    );
  } catch (error) {
    console.error("❌ Error during words collection seeding:", error);
    throw error;
  }
}

/**
 * Check if words collection already has data
 */
async function checkExistingWords(): Promise<number> {
  const totalSnapshot = await db.collection("words").get();
  return totalSnapshot.size;
}

async function main() {
  try {
    const existingCount = await checkExistingWords();

    if (existingCount > 0) {
      console.log(
        `⚠️  Warning: Found ${existingCount} existing words in Firestore`
      );
      console.log(
        "This script will overwrite existing words with the same ID."
      );
      console.log("Proceeding in 3 seconds... (Ctrl+C to cancel)");

      await new Promise((resolve) => setTimeout(resolve, 3000));
    }

    await seedWordsCollection();
    console.log("🏁 Migration completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("💥 Migration failed:", error);
    process.exit(1);
  }
}

// Run the migration if this file is executed directly
if (require.main === module) {
  main();
}

export { seedWordsCollection, checkExistingWords };
