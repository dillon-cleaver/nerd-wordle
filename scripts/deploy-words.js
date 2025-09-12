#!/usr/bin/env node

/**
 * Deploy words to CDN with proper error handling
 *
 * This script ensures atomic deployment by:
 * 1. Validating words data
 * 2. Auto-versioning dictionary
 * 3. Deploying to Firebase hosting
 * 4. Only proceeding if each step succeeds
 */

const { execSync } = require("child_process");

function runCommand(command, description) {
  console.log(`🔄 ${description}...`);
  try {
    execSync(command, {
      stdio: "inherit",
      cwd: process.cwd(),
    });
    console.log(`✅ ${description} completed successfully`);
    return true;
  } catch (error) {
    console.error(`❌ ${description} failed:`);
    console.error(error.message);
    return false;
  }
}

async function deployWords() {
  console.log("🚀 Starting words deployment to CDN...\n");

  // Step 1: Validate words data
  if (
    !runCommand(
      "node scripts/build-dictionary.js --validate",
      "Validating words data"
    )
  ) {
    console.error("\n💥 Deployment aborted: Word validation failed");
    process.exit(1);
  }

  // Step 2: Auto-version dictionary
  if (
    !runCommand(
      "node scripts/auto-version-dictionary.js",
      "Auto-versioning dictionary"
    )
  ) {
    console.error("\n💥 Deployment aborted: Auto-versioning failed");
    process.exit(1);
  }

  // Step 3: Deploy to Firebase hosting
  if (
    !runCommand(
      "firebase deploy --only hosting",
      "Deploying to Firebase hosting"
    )
  ) {
    console.error("\n💥 Deployment aborted: Firebase deployment failed");
    process.exit(1);
  }

  // Success!
  console.log("\n🎉 Words deployment completed successfully!");
  console.log("✅ New words deployed to CDN with auto-versioning!");
  console.log(
    "🌐 Words are now available at: https://nerd-word-cfda3.web.app/dict/"
  );
}

// Run the deployment
deployWords().catch((error) => {
  console.error("\n💥 Unexpected error during deployment:", error);
  process.exit(1);
});
