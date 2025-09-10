#!/usr/bin/env node

/**
 * Comprehensive word management script
 *
 * Handles both CDN dictionary updates and Firestore seeding
 * with validation, rollback, and environment targeting.
 *
 * Usage:
 *   node scripts/update-words.js --env production --deploy
 *   node scripts/update-words.js --env emulator --validate
 *   node scripts/update-words.js --env production --version v4 --deploy
 */

const { exec } = require("child_process");
const util = require("util");
const execAsync = util.promisify(exec);

// Parse command line arguments
const args = process.argv.slice(2);
let environment = "emulator"; // Default to safer emulator
let shouldDeploy = false;
let shouldValidate = false;
let version = "v3";

const envIndex = args.indexOf("--env");
if (envIndex !== -1 && args[envIndex + 1]) {
  environment = args[envIndex + 1];
}

const versionIndex = args.indexOf("--version");
if (versionIndex !== -1 && args[versionIndex + 1]) {
  version = args[versionIndex + 1];
}

if (args.includes("--deploy")) {
  shouldDeploy = true;
}

if (args.includes("--validate")) {
  shouldValidate = true;
}

/**
 * Execute command with proper error handling
 */
async function execCommand(command, description) {
  console.log(`🔄 ${description}...`);
  try {
    const { stdout, stderr } = await execAsync(command);
    if (stderr && !stderr.includes("Warning")) {
      console.warn(`⚠️  ${stderr.trim()}`);
    }
    if (stdout) {
      console.log(stdout.trim());
    }
    return true;
  } catch (error) {
    console.error(`❌ Failed: ${error.message}`);
    return false;
  }
}

/**
 * Main word update workflow
 */
async function updateWords() {
  console.log(`🚀 Starting word update workflow...`);
  console.log(`   Environment: ${environment}`);
  console.log(`   Version: ${version}`);
  console.log(`   Deploy: ${shouldDeploy ? "Yes" : "No"}`);
  console.log(`   Validate: ${shouldValidate ? "Yes" : "No"}`);
  console.log("");

  // Step 1: Build dictionary with validation
  const buildArgs = shouldValidate
    ? `--version ${version} --validate`
    : `--version ${version}`;
  const buildSuccess = await execCommand(
    `node scripts/build-dictionary.js ${buildArgs}`,
    "Building static dictionary"
  );

  if (!buildSuccess) {
    console.error("❌ Dictionary build failed. Aborting.");
    process.exit(1);
  }

  // Step 2: Update Firestore based on environment
  let firestoreCommand;
  if (environment === "emulator") {
    firestoreCommand = "cd functions && pnpm run seed:words:emulator";
  } else if (environment === "production") {
    firestoreCommand = "cd functions && pnpm run seed:words:production";
  } else {
    console.error(`❌ Unknown environment: ${environment}`);
    process.exit(1);
  }

  const firestoreSuccess = await execCommand(
    firestoreCommand,
    `Updating Firestore (${environment})`
  );

  if (!firestoreSuccess) {
    console.error(
      "❌ Firestore update failed. CDN deployment will be skipped."
    );
    process.exit(1);
  }

  // Step 3: Deploy to CDN if requested and environment is appropriate
  if (shouldDeploy) {
    if (environment === "production") {
      const deploySuccess = await execCommand(
        "firebase deploy --only hosting",
        "Deploying dictionary to CDN"
      );

      if (deploySuccess) {
        console.log("");
        console.log("🎉 Word update completed successfully!");
        console.log(
          `   CDN URL: https://nerd-word-cfda3.web.app/dict/${version}/words.json`
        );
        console.log(`   Environment: ${environment}`);
        console.log(`   Dictionary version: ${version}`);
      } else {
        console.error("❌ CDN deployment failed");
        process.exit(1);
      }
    } else {
      console.log(
        "ℹ️  Skipping CDN deployment (not in production environment)"
      );
    }
  } else {
    console.log("ℹ️  Skipping CDN deployment (--deploy not specified)");
  }

  console.log("");
  console.log("✅ Word update workflow completed");

  // Provide next steps
  if (environment === "production" && !shouldDeploy) {
    console.log("");
    console.log("📋 Next steps:");
    console.log("   1. Test the changes in your environment");
    console.log("   2. Deploy to CDN: firebase deploy --only hosting");
    console.log(`   3. Update client code to use version ${version} if needed`);
  }
}

// Validation
if (!["emulator", "production"].includes(environment)) {
  console.error('❌ Environment must be "emulator" or "production"');
  process.exit(1);
}

// CI environment detection:
// The following check prevents accidental production deployments unless running in CI or
// with --force.
// Supported CI environments are those that set one of the following variables:
//   - CI (common: GitHub Actions, Travis CI, CircleCI, etc.)
//   - GITHUB_ACTIONS (GitHub Actions)
//   - TRAVIS (Travis CI)
//   - CIRCLECI (CircleCI)
//   - BUILDKITE (Buildkite)
//   - JENKINS_URL (Jenkins)
// Add more as needed for your CI provider.
if (
  environment === "production" &&
  !(
    process.env.CI ||
    process.env.GITHUB_ACTIONS ||
    process.env.TRAVIS ||
    process.env.CIRCLECI ||
    process.env.BUILDKITE ||
    process.env.JENKINS_URL
  ) &&
  !args.includes("--force")
) {
  console.log("⚠️  Production environment detected.");
  console.log("   Add --force flag to confirm production deployment");
  console.log("   Or use --env emulator for testing");
  process.exit(1);
}

// Run the update
updateWords().catch((error) => {
  console.error("❌ Update failed:", error.message);
  process.exit(1);
});
