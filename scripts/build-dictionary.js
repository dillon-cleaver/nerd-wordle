#!/usr/bin/env node

/**
 * Build script to create dictionary for Firebase Hosting
 *
 * This script:
 * 1. Copies the current words.json to the hosting directory
 * 2. Optionally bumps version number for cache busting
 * 3. Supports different output formats and validation
 *
 * Usage:
 *   node scripts/build-dictionary.js
 *   node scripts/build-dictionary.js --version v4
 *   node scripts/build-dictionary.js --version v4 --validate
 */

const fs = require("fs");
const path = require("path");

// Use process.cwd() to get the project root directory
const SOURCE_FILE = path.join(process.cwd(), "constants", "words.json");
const TARGET_DIR = path.join(process.cwd(), "public", "dict");

// Parse command line arguments
const args = process.argv.slice(2);
let version = "v3"; // default version
let shouldValidate = false;

const versionIndex = args.indexOf("--version");
if (versionIndex !== -1 && args[versionIndex + 1]) {
  version = args[versionIndex + 1];
}

if (args.includes("--validate")) {
  shouldValidate = true;
}

const TARGET_VERSION_DIR = path.join(TARGET_DIR, version);
const TARGET_FILE = path.join(TARGET_VERSION_DIR, "words.json");

/**
 * Validate the word data structure
 */
function validateWords(words) {
  if (!Array.isArray(words)) {
    throw new Error("Words data must be an array");
  }

  const requiredFields = ["id", "category"];
  const issues = [];

  words.forEach((word, index) => {
    requiredFields.forEach((field) => {
      if (!word[field]) {
        issues.push(`Word at index ${index} missing required field: ${field}`);
      }
    });

    // Validate word ID format
    if (word.id && typeof word.id !== "string") {
      issues.push(
        `Word at index ${index} has invalid ID type: ${typeof word.id}`
      );
    }
  });

  if (issues.length > 0) {
    throw new Error(`Validation failed:\n${issues.join("\n")}`);
  }

  return {
    totalWords: words.length,
    categories: [...new Set(words.map((w) => w.category))],
    duplicateIds: findDuplicateIds(words),
  };
}

/**
 * Find duplicate word IDs
 */
function findDuplicateIds(words) {
  const ids = words.map((w) => w.id);
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  return [...new Set(duplicates)];
}

async function buildDictionary() {
  try {
    console.log(`🔨 Building dictionary version ${version}...`);

    // Ensure target directory exists
    fs.mkdirSync(TARGET_VERSION_DIR, { recursive: true });

    // Read source file
    const sourceData = fs.readFileSync(SOURCE_FILE, "utf8");
    const words = JSON.parse(sourceData);

    // Validate if requested
    let validationResults = null;
    if (shouldValidate) {
      console.log("🔍 Validating word data...");
      validationResults = validateWords(words);

      if (validationResults.duplicateIds.length > 0) {
        console.warn(
          `⚠️  Found duplicate IDs: ${validationResults.duplicateIds.join(
            ", "
          )}`
        );
      }
    }

    // Write to target
    fs.writeFileSync(TARGET_FILE, JSON.stringify(words, null, 2));

    // Generate metadata file
    const metadata = {
      version,
      buildDate: new Date().toISOString(),
      wordCount: words.length,
      source: "constants/words.json",
      validation: validationResults,
    };

    const metadataFile = path.join(TARGET_VERSION_DIR, "metadata.json");
    fs.writeFileSync(metadataFile, JSON.stringify(metadata, null, 2));

    console.log(`✅ Dictionary built successfully!`);
    console.log(`   Version: ${version}`);
    console.log(`   Words: ${words.length}`);
    console.log(
      `   Categories: ${validationResults?.categories?.length || "unknown"}`
    );
    console.log(`   Output: ${TARGET_FILE}`);
    console.log(
      `   Size: ${(fs.statSync(TARGET_FILE).size / 1024).toFixed(1)}KB`
    );
    console.log(`   Metadata: ${metadataFile}`);

    if (validationResults?.duplicateIds.length > 0) {
      console.log(
        `   ⚠️  Duplicates: ${validationResults.duplicateIds.length}`
      );
    }
  } catch (error) {
    console.error("❌ Failed to build dictionary:", error.message);
    process.exit(1);
  }
}

buildDictionary();
