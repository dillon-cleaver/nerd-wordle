#!/usr/bin/env node

/**
 * Unified word deployment script
 *
 * Deploys words to both CDN and Firestore with proper validation
 * and error handling. Prevents partial deployments.
 *
 * Usage:
 *   node scripts/deploy-words-all.js           # Deploy to both CDN and Firestore
 *   node scripts/deploy-words-all.js --cdn     # CDN only
 *   node scripts/deploy-words-all.js --db      # Firestore only
 */

const { execSync } = require("child_process");

// Parse command line arguments
const args = process.argv.slice(2);
const cdnOnly = args.includes("--cdn");
const dbOnly = args.includes("--db");

function runCommand(command, description, options = {}) {
  console.log(`🔄 ${description}...`);
  try {
    execSync(command, {
      stdio: "inherit",
      cwd: process.cwd(),
      ...options,
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
  console.log("🚀 Starting unified word deployment...\n");

  // Determine what to deploy
  const deployCDN = !dbOnly;
  const deployFirestore = !cdnOnly;

  console.log("📋 Deployment plan:");
  console.log(`   CDN: ${deployCDN ? "✅ Yes" : "⏭️  Skip"}`);
  console.log(`   Firestore: ${deployFirestore ? "✅ Yes" : "⏭️  Skip"}`);
  console.log();

  // Step 1: Always validate first
  if (
    !runCommand(
      "node scripts/build-dictionary.js --validate",
      "Validating word data"
    )
  ) {
    console.error("\n💥 Deployment aborted: Word validation failed");
    process.exit(1);
  }

  let deploymentResults = [];

  // Step 2: Deploy to CDN
  if (deployCDN) {
    console.log("\n📡 CDN Deployment");
    console.log("==================");

    // Auto-version dictionary
    if (
      !runCommand(
        "node scripts/auto-version-dictionary.js",
        "Auto-versioning dictionary"
      )
    ) {
      console.error("\n💥 CDN deployment failed: Auto-versioning failed");
      deploymentResults.push("❌ CDN: Auto-versioning failed");
    } else {
      // Deploy to Firebase hosting
      if (
        !runCommand(
          "firebase deploy --only hosting",
          "Deploying to Firebase hosting (CDN)"
        )
      ) {
        console.error("\n💥 CDN deployment failed: Firebase hosting failed");
        deploymentResults.push("❌ CDN: Hosting deployment failed");
      } else {
        deploymentResults.push("✅ CDN: Deployed successfully");
      }
    }
  }

  // Step 3: Deploy to Firestore
  if (deployFirestore) {
    console.log("\n🗄️  Firestore Deployment");
    console.log("========================");

    // Ensure production environment
    if (
      !runCommand(
        "node scripts/env-helper.js production",
        "Setting production environment"
      )
    ) {
      console.error(
        "\n💥 Firestore deployment failed: Environment setup failed"
      );
      deploymentResults.push("❌ Firestore: Environment setup failed");
    } else {
      // Deploy to Firestore
      if (
        !runCommand(
          "cd functions && pnpm run seed:words:production",
          "Deploying to Firestore database"
        )
      ) {
        console.error(
          "\n💥 Firestore deployment failed: Database seeding failed"
        );
        deploymentResults.push("❌ Firestore: Database seeding failed");
      } else {
        deploymentResults.push("✅ Firestore: Deployed successfully");
      }

      // Reset to development environment
      runCommand(
        "node scripts/env-helper.js development",
        "Resetting to development environment"
      );
    }
  }

  // Step 4: Report results
  console.log("\n🎯 Deployment Summary");
  console.log("====================");
  deploymentResults.forEach((result) => console.log(`   ${result}`));

  const hasFailures = deploymentResults.some((result) => result.includes("❌"));

  if (hasFailures) {
    console.log("\n⚠️  Some deployments failed. Check the logs above.");
    console.log("💡 You can retry specific deployments:");
    console.log("   CDN only: pnpm run words:deploy");
    console.log("   Firestore only: pnpm run words:firestore");
    process.exit(1);
  } else {
    console.log("\n🎉 All deployments completed successfully!");

    if (deployCDN) {
      console.log("🌐 CDN: https://nerd-word-cfda3.web.app/dict/");
    }

    if (deployFirestore) {
      console.log("🗄️  Firestore: nerd-word-cfda3 project");
    }

    console.log("\n📋 Next steps:");
    console.log("   1. Verify deployment: pnpm run words:verify [WORD]");
    console.log("   2. Check bundle optimization: pnpm run words:check-bundle");
    console.log("   3. Test in your application");
  }
}

// Run the deployment
deployWords().catch((error) => {
  console.error("\n💥 Unexpected error during deployment:", error);
  process.exit(1);
});
