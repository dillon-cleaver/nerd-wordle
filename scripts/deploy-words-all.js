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

// Command constants for maintainability
const COMMANDS = {
  CDN_DEPLOY: "pnpm run words:deploy:cdn",
  FIRESTORE_DEPLOY: "pnpm run words:deploy:firestore",
  VALIDATE: "node scripts/build-dictionary.js --validate",
};

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
  if (!runCommand(COMMANDS.VALIDATE, "Validating word data")) {
    console.error("\n💥 Deployment aborted: Word validation failed");
    process.exit(1);
  }

  let deploymentResults = [];

  // Step 2: Deploy to CDN
  if (deployCDN) {
    console.log("\n📡 CDN Deployment");
    console.log("==================");

    if (
      !runCommand(COMMANDS.CDN_DEPLOY, "Deploying to CDN (Firebase hosting)")
    ) {
      console.error("\n💥 CDN deployment failed");
      deploymentResults.push("❌ CDN: Deployment failed");
    } else {
      deploymentResults.push("✅ CDN: Deployed successfully");
    }
  }

  // Step 3: Deploy to Firestore (always attempt even if CDN failed)
  if (deployFirestore) {
    console.log("\n🗄️  Firestore Deployment");
    console.log("========================");

    if (
      !runCommand(COMMANDS.FIRESTORE_DEPLOY, "Deploying to Firestore database")
    ) {
      console.error("\n💥 Firestore deployment failed");
      deploymentResults.push("❌ Firestore: Deployment failed");
    } else {
      deploymentResults.push("✅ Firestore: Deployed successfully");
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
    console.log(`   CDN only: ${COMMANDS.CDN_DEPLOY}`);
    console.log(`   Firestore only: ${COMMANDS.FIRESTORE_DEPLOY}`);

    // Show what succeeded for partial recovery
    const successes = deploymentResults.filter((r) => r.includes("✅"));
    if (successes.length > 0) {
      console.log("\n✅ Successful deployments:");
      successes.forEach((s) => console.log(`   ${s}`));
    }

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
