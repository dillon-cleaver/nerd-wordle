import * as admin from "firebase-admin";

// Store the emulator host for later use
const emulatorHost = process.env.FIRESTORE_EMULATOR_HOST;
if (!emulatorHost) {
  console.error("❌ FIRESTORE_EMULATOR_HOST not set!");
  process.exit(1);
}

console.log(`🔧 Emulator target: ${emulatorHost}`);

// Temporarily unset emulator host to connect to production
delete process.env.FIRESTORE_EMULATOR_HOST;

// Initialize production Firebase Admin instance
const productionApp = admin.initializeApp(
  {
    projectId: "nerd-word-cfda3",
  },
  "production"
);

const productionDb = admin.firestore(productionApp);

// Restore emulator host for emulator connection
process.env.FIRESTORE_EMULATOR_HOST = emulatorHost;

// Initialize emulator Firebase Admin instance
const emulatorApp = admin.initializeApp(
  {
    projectId: "nerd-word-cfda3",
  },
  "emulator"
);

const emulatorDb = admin.firestore(emulatorApp);

/**
 * Import data from production Firestore to local emulator
 * This ensures your local development environment has the exact same
 * data structure and content as production.
 */

async function importFromProduction() {
  console.log("🔄 Starting production data import to emulator...");

  // Set a timeout to prevent hanging
  const timeoutId = setTimeout(() => {
    console.error("⏰ Import timed out after 30 seconds");
    process.exit(1);
  }, 30000);

  try {
    // Import words collection
    console.log("📚 Importing words collection...");
    const wordsSnapshot = await productionDb.collection("words").get();
    console.log(`📚 Found ${wordsSnapshot.size} words in production`);

    if (wordsSnapshot.empty) {
      console.log("⚠️  No words found in production - using fallback seeding");
      clearTimeout(timeoutId);
      return;
    }

    const wordsBatch = emulatorDb.batch();
    let wordsCount = 0;

    wordsSnapshot.forEach((doc) => {
      const emulatorRef = emulatorDb.collection("words").doc(doc.id);
      wordsBatch.set(emulatorRef, doc.data());
      wordsCount++;
      if (wordsCount % 100 === 0) {
        console.log(`📚 Processing word ${wordsCount}...`);
      }
    });

    console.log("📚 Committing words batch...");
    await wordsBatch.commit();
    console.log(`✅ Imported ${wordsCount} words`);

    // Import daily puzzles collection
    console.log("📅 Importing daily puzzles collection...");
    try {
      const puzzlesSnapshot = await productionDb
        .collection("dailyPuzzles")
        .get();
      console.log(
        `📅 Found ${puzzlesSnapshot.size} daily puzzles in production`
      );

      if (!puzzlesSnapshot.empty) {
        const puzzlesBatch = emulatorDb.batch();
        let puzzlesCount = 0;

        puzzlesSnapshot.forEach((doc) => {
          const emulatorRef = emulatorDb.collection("dailyPuzzles").doc(doc.id);
          puzzlesBatch.set(emulatorRef, doc.data());
          puzzlesCount++;
          if (puzzlesCount % 10 === 0) {
            console.log(`📅 Processing puzzle ${puzzlesCount}...`);
          }
        });

        console.log("📅 Committing daily puzzles batch...");
        await puzzlesBatch.commit();
        console.log(`✅ Imported ${puzzlesCount} daily puzzles`);
      } else {
        console.log("📅 No daily puzzles found in production");
      }
    } catch (error) {
      console.error("❌ Error importing daily puzzles:", error);
      // Continue with the rest of the import even if puzzles fail
    }

    console.log("🎉 Production data import completed successfully!");

    // Import users collection
    console.log("👥 Importing users collection...");
    try {
      const usersSnapshot = await productionDb.collection("users").get();
      console.log(`👥 Found ${usersSnapshot.size} users in production`);

      if (!usersSnapshot.empty) {
        const usersBatch = emulatorDb.batch();
        let usersCount = 0;

        for (const userDoc of usersSnapshot.docs) {
          const emulatorRef = emulatorDb.collection("users").doc(userDoc.id);
          usersBatch.set(emulatorRef, userDoc.data());
          usersCount++;

          // Import puzzleHistory subcollection for each user
          console.log(`👥 Importing puzzleHistory for user ${userDoc.id}...`);
          const puzzleHistorySnapshot = await productionDb
            .collection("users")
            .doc(userDoc.id)
            .collection("puzzleHistory")
            .get();

          console.log(
            `   📚 Found ${puzzleHistorySnapshot.size} puzzle history entries`
          );

          if (!puzzleHistorySnapshot.empty) {
            for (const puzzleHistoryDoc of puzzleHistorySnapshot.docs) {
              const emulatorPuzzleHistoryRef = emulatorDb
                .collection("users")
                .doc(userDoc.id)
                .collection("puzzleHistory")
                .doc(puzzleHistoryDoc.id);
              usersBatch.set(emulatorPuzzleHistoryRef, puzzleHistoryDoc.data());
            }
          }

          if (usersCount % 10 === 0) {
            console.log(`👥 Processing user ${usersCount}...`);
          }
        }

        console.log("👥 Committing users batch...");
        await usersBatch.commit();
        console.log(`✅ Imported ${usersCount} users`);
      } else {
        console.log("👥 No users found in production");
      }
    } catch (error) {
      console.error("❌ Error importing users:", error);
      // Continue with verification even if users fail
    }

    console.log("🎉 Production data import completed successfully!");

    // Verify import
    const emulatorWordsSnapshot = await emulatorDb.collection("words").get();
    const emulatorPuzzlesSnapshot = await emulatorDb
      .collection("dailyPuzzles")
      .get();
    const emulatorUsersSnapshot = await emulatorDb.collection("users").get();

    // Count total puzzleHistory entries across all users
    let totalPuzzleHistory = 0;
    for (const userDoc of emulatorUsersSnapshot.docs) {
      const puzzleHistorySnapshot = await emulatorDb
        .collection("users")
        .doc(userDoc.id)
        .collection("puzzleHistory")
        .get();
      totalPuzzleHistory += puzzleHistorySnapshot.size;
    }

    console.log("📋 Import verification:");
    console.log(`   Words: ${emulatorWordsSnapshot.size}`);
    console.log(`   Daily puzzles: ${emulatorPuzzlesSnapshot.size}`);
    console.log(`   Users: ${emulatorUsersSnapshot.size}`);
    console.log(`   Puzzle history entries: ${totalPuzzleHistory}`);

    // Clear timeout since we succeeded
    clearTimeout(timeoutId);
  } catch (error) {
    clearTimeout(timeoutId);
    console.error("❌ Error during production import:", error);
    throw error;
  }
}

// Run the import
if (require.main === module) {
  importFromProduction()
    .then(() => {
      console.log("🏁 Import script completed successfully!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Import script failed:", error);
      process.exit(1);
    });
}

export { importFromProduction };
