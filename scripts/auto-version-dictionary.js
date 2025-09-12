#!/usr/bin/env node

/**
 * Auto-versioning dictionary builder
 *
 * This script automatically increments the version when words change,
 * ensuring users get new words immediately via cache-busting URLs.
 *
 * How it works:
 * 1. Calculates hash of current words.json
 * 2. Compares with last deployed version
 * 3. Auto-increments version if content changed
 * 4. Updates client code to fetch new version
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const SOURCE_FILE = path.join(process.cwd(), "constants", "words.json");
const TARGET_DIR = path.join(process.cwd(), "public", "dict");
const VERSION_FILE = path.join(TARGET_DIR, "current-version.json");
const CONTEXT_FILE = path.join(process.cwd(), "storage", "words.local.ts");

/**
 * Calculate hash of words.json content
 */
function getWordsHash() {
  const content = fs.readFileSync(SOURCE_FILE, "utf8");
  return crypto
    .createHash("sha256")
    .update(content)
    .digest("hex")
    .substring(0, 8);
}

/**
 * Load current version info
 */
function getCurrentVersionInfo() {
  try {
    if (fs.existsSync(VERSION_FILE)) {
      return JSON.parse(fs.readFileSync(VERSION_FILE, "utf8"));
    }
  } catch (_error) {
    console.warn("Could not read version file, starting fresh");
  }

  return {
    version: "v3",
    hash: "",
    lastUpdated: new Date().toISOString(),
    wordsCount: 0,
  };
}

/**
 * Get next version number
 */
function getNextVersion(currentVersion) {
  const match = currentVersion.match(/^v(\d+)$/);
  if (match) {
    const num = parseInt(match[1]) + 1;
    return `v${num}`;
  }
  return "v4"; // fallback
}

/**
 * Update the client code to use new version
 */
function updateClientVersion(newVersion) {
  let content = fs.readFileSync(CONTEXT_FILE, "utf8");

  // Update the version in fetchWordsFromCDN function
  content = content.replace(
    /version: string = "v\d+"/g,
    `version: string = "${newVersion}"`
  );

  // Update the URL construction
  content = content.replace(
    /\/dict\/v\d+\/words\.json/g,
    `/dict/${newVersion}/words.json`
  );

  fs.writeFileSync(CONTEXT_FILE, content);
  console.log(`✅ Updated client to use ${newVersion}`);
}

/**
 * Main execution
 */
function main() {
  const currentInfo = getCurrentVersionInfo();
  const currentHash = getWordsHash();
  const wordsData = JSON.parse(fs.readFileSync(SOURCE_FILE, "utf8"));

  console.log(`🔍 Current: ${currentInfo.version} (hash: ${currentInfo.hash})`);
  console.log(`🔍 New content hash: ${currentHash}`);

  // Check if content changed
  if (currentHash === currentInfo.hash) {
    console.log("✅ No changes detected, keeping version", currentInfo.version);
    return currentInfo.version;
  }

  // Content changed - increment version
  const newVersion = getNextVersion(currentInfo.version);
  const newVersionDir = path.join(TARGET_DIR, newVersion);

  console.log(
    `🚀 Content changed! Upgrading ${currentInfo.version} → ${newVersion}`
  );

  // Create new version directory
  fs.mkdirSync(newVersionDir, { recursive: true });

  // Copy words.json to new version
  fs.copyFileSync(SOURCE_FILE, path.join(newVersionDir, "words.json"));

  // Create metadata
  const metadata = {
    version: newVersion,
    timestamp: new Date().toISOString(),
    totalWords: wordsData.length,
    categories: [...new Set(wordsData.map((w) => w.category))].length,
    hash: currentHash,
  };

  fs.writeFileSync(
    path.join(newVersionDir, "metadata.json"),
    JSON.stringify(metadata, null, 2)
  );

  // Update version tracking
  const newVersionInfo = {
    version: newVersion,
    hash: currentHash,
    lastUpdated: new Date().toISOString(),
    wordsCount: wordsData.length,
  };

  fs.writeFileSync(VERSION_FILE, JSON.stringify(newVersionInfo, null, 2));

  // Update client code
  updateClientVersion(newVersion);

  console.log(`✅ Dictionary ${newVersion} created successfully!`);
  console.log(`   Words: ${wordsData.length}`);
  console.log(`   Output: ${newVersionDir}/words.json`);

  return newVersion;
}

if (require.main === module) {
  main();
}

module.exports = { main };
