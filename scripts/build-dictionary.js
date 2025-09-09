#!/usr/bin/env node

/**
 * Build script to create dictionary for Firebase Hosting
 *
 * This script:
 * 1. Copies the current words.json to the hosting directory
 * 2. Optionally bumps version number for cache busting
 *
 * Usage:
 *   node scripts/build-dictionary.js
 *   node scripts/build-dictionary.js --version v4
 */

const fs = require("fs");
const path = require("path");

// Use process.cwd() to get the project root directory
const SOURCE_FILE = path.join(process.cwd(), "constants", "words.json");
const TARGET_DIR = path.join(process.cwd(), "public", "dict");

// Parse command line arguments
const args = process.argv.slice(2);
let version = "v3"; // default version

const versionIndex = args.indexOf("--version");
if (versionIndex !== -1 && args[versionIndex + 1]) {
  version = args[versionIndex + 1];
}

const TARGET_VERSION_DIR = path.join(TARGET_DIR, version);
const TARGET_FILE = path.join(TARGET_VERSION_DIR, "words.json");

async function buildDictionary() {
  try {
    // Ensure target directory exists
    fs.mkdirSync(TARGET_VERSION_DIR, { recursive: true });

    // Read source file
    const sourceData = fs.readFileSync(SOURCE_FILE, "utf8");
    const words = JSON.parse(sourceData);

    // Write to target with metadata
    const output = {
      words,
      metadata: {
        version,
        buildDate: new Date().toISOString(),
        wordCount: words.length,
        source: "constants/words.json",
      },
    };

    fs.writeFileSync(TARGET_FILE, JSON.stringify(output.words, null, 2));

    console.log(`✅ Dictionary built successfully!`);
    console.log(`   Version: ${version}`);
    console.log(`   Words: ${words.length}`);
    console.log(`   Output: ${TARGET_FILE}`);
    console.log(
      `   Size: ${(fs.statSync(TARGET_FILE).size / 1024).toFixed(1)}KB`
    );
  } catch (error) {
    console.error("❌ Failed to build dictionary:", error);
    process.exit(1);
  }
}

buildDictionary();
