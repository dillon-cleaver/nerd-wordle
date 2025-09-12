#!/usr/bin/env node

/**
 * Word verification script
 *
 * Verifies that a word exists in both CDN and Firestore
 * to ensure complete deployment.
 *
 * Usage:
 *   node scripts/verify-word.js GRAZE
 *   node scripts/verify-word.js MARIO --detailed
 */

const { execSync } = require("child_process");

// Parse command line arguments
const args = process.argv.slice(2);
const wordToCheck = args[0];
const detailed = args.includes("--detailed");

if (!wordToCheck) {
  console.error("❌ Please specify a word to verify");
  console.log("Usage: node scripts/verify-word.js GRAZE");
  process.exit(1);
}

const word = wordToCheck.toUpperCase();

async function checkCDN() {
  try {
    console.log("🌐 Checking CDN...");
    
    // Get current version
    const versionResponse = await fetch(
      "https://nerd-word-cfda3.web.app/dict/current-version.json"
    );
    
    if (!versionResponse.ok) {
      throw new Error(`CDN version check failed: ${versionResponse.statusText}`);
    }
    
    const versionInfo = await versionResponse.json();
    const version = versionInfo.version;
    
    // Check word exists in current version
    const wordsResponse = await fetch(
      `https://nerd-word-cfda3.web.app/dict/${version}/words.json`
    );
    
    if (!wordsResponse.ok) {
      throw new Error(`CDN words fetch failed: ${wordsResponse.statusText}`);
    }
    
    const words = await wordsResponse.json();
    const wordEntry = words.find((w) => w.id === word);
    
    if (wordEntry) {
      console.log(`   ✅ Found in CDN (${version})`);
      if (detailed) {
        console.log(`   📋 Data: ${JSON.stringify(wordEntry, null, 2)}`);
      }
      return { success: true, version, data: wordEntry };
    } else {
      console.log(`   ❌ Not found in CDN (${version})`);
      return { success: false, version };
    }
  } catch (error) {
    console.log(`   ❌ CDN check failed: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function checkFirestore() {
  try {
    console.log("🗄️  Checking Firestore...");
    
    // Use Node.js to check Firestore (requires firebase-admin)
    const checkScript = `
      const admin = require('firebase-admin');
      admin.initializeApp({ projectId: 'nerd-word-cfda3' });
      const db = admin.firestore();
      
      async function checkWord() {
        try {
          const doc = await db.collection('words').doc('${word}').get();
          if (doc.exists) {
            console.log(JSON.stringify({ success: true, data: doc.data() }));
          } else {
            console.log(JSON.stringify({ success: false, reason: 'not_found' }));
          }
        } catch (error) {
          console.log(JSON.stringify({ success: false, error: error.message }));
        }
        process.exit(0);
      }
      
      checkWord();
    `;
    
    const result = execSync(`cd functions && node -e "${checkScript}"`, {
      encoding: "utf8",
    });
    
    const parsed = JSON.parse(result.trim());
    
    if (parsed.success) {
      console.log("   ✅ Found in Firestore");
      if (detailed) {
        console.log(`   📋 Data: ${JSON.stringify(parsed.data, null, 2)}`);
      }
      return { success: true, data: parsed.data };
    } else {
      console.log(`   ❌ Not found in Firestore: ${parsed.reason || parsed.error}`);
      return { success: false, error: parsed.error };
    }
  } catch (error) {
    console.log(`   ❌ Firestore check failed: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function verifyWord() {
  console.log(`🔍 Verifying word: ${word}\n`);
  
  const [cdnResult, firestoreResult] = await Promise.all([
    checkCDN(),
    checkFirestore(),
  ]);
  
  console.log("\n📊 Summary");
  console.log("==========");
  console.log(`CDN: ${cdnResult.success ? "✅ Found" : "❌ Missing"}`);
  console.log(`Firestore: ${firestoreResult.success ? "✅ Found" : "❌ Missing"}`);
  
  if (cdnResult.success && firestoreResult.success) {
    console.log("\n🎉 Word is properly deployed to both systems!");
    
    // Check for consistency
    if (detailed && cdnResult.data && firestoreResult.data) {
      const cdnCategory = cdnResult.data.category;
      const firestoreCategory = firestoreResult.data.category;
      
      if (cdnCategory === firestoreCategory) {
        console.log(`✅ Categories match: ${cdnCategory}`);
      } else {
        console.log(`⚠️  Category mismatch: CDN(${cdnCategory}) vs Firestore(${firestoreCategory})`);
      }
    }
    
    process.exit(0);
  } else {
    console.log("\n⚠️  Word is not fully deployed. Check the errors above.");
    
    if (!cdnResult.success) {
      console.log("💡 To fix CDN: pnpm run words:deploy");
    }
    
    if (!firestoreResult.success) {
      console.log("💡 To fix Firestore: pnpm run words:firestore");
    }
    
    console.log("💡 To fix both: pnpm run words:deploy:all");
    
    process.exit(1);
  }
}

// Run verification
verifyWord().catch((error) => {
  console.error("\n💥 Unexpected error during verification:", error);
  process.exit(1);
});