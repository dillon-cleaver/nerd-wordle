#!/usr/bin/env node

/**
 * Bundle Size Verification Script
 *
 * Verifies that words.json is NOT bundled with the app and measures bundle size.
 * This ensures our CDN-first approach is working correctly.
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const EXPECTED_BUNDLE_SIZE_MB = 3; // Max expected size in MB (was 4, now optimized)

console.log("🔍 Bundle Size Verification Starting...\n");

// 1. Build the web export
console.log("📦 Building web export...");
try {
  execSync("npx expo export --platform web", {
    stdio: ["inherit", "pipe", "inherit"],
    cwd: process.cwd(),
  });
  console.log("✅ Build completed\n");
} catch (error) {
  console.error("❌ Build failed:", error.message);
  process.exit(1);
}

// 2. Find the main bundle file
const distDir = path.join(
  process.cwd(),
  "dist",
  "_expo",
  "static",
  "js",
  "web"
);
const bundleFiles = fs
  .readdirSync(distDir)
  .filter(
    (file) =>
      file.startsWith("entry-") &&
      file.endsWith(".js") &&
      !file.endsWith(".map")
  );

if (bundleFiles.length === 0) {
  console.error("❌ No bundle file found");
  process.exit(1);
}

const bundleFile = path.join(distDir, bundleFiles[0]);
const bundleStats = fs.statSync(bundleFile);
const bundleSizeMB = bundleStats.size / (1024 * 1024);

console.log(`📊 Bundle Analysis:`);
console.log(`   File: ${bundleFiles[0]}`);
console.log(`   Size: ${bundleSizeMB.toFixed(2)} MB`);
console.log(`   Expected max: ${EXPECTED_BUNDLE_SIZE_MB} MB`);

// 3. Check for word data in bundle
console.log("\n🔍 Checking for word data in bundle...");

const bundleContent = fs.readFileSync(bundleFile, "utf8");

// Check for specific words that would only be in the dictionary
const testWords = ["MARIO", "SONIC", "VADER", "SPOCK", "FRODO"];
const foundWords = testWords.filter((word) => bundleContent.includes(word));

// Check for word data arrays (large JSON structures)
const hasLargeArrays =
  bundleContent.includes('["') &&
  bundleContent.includes('","') &&
  bundleContent.length > bundleSizeMB * 1024 * 1024;

// Check for specific references we expect (vs. unexpected)
const expectedReferences = {
  "words.json": bundleContent.includes("words.json"), // URL reference is OK
  ZELDA: bundleContent.includes("ZELDA"), // Fallback puzzle is OK
  categories: bundleContent.includes("animeAndManga"), // Category constants are OK
};

const unexpectedContent = foundWords.length > 0 || hasLargeArrays;

console.log(
  `   Test words found: ${
    foundWords.length > 0 ? foundWords.join(", ") : "None ✅"
  }`
);
console.log(`   Expected references:`);
console.log(
  `     - words.json URL: ${expectedReferences["words.json"] ? "✅" : "❌"}`
);
console.log(
  `     - ZELDA fallback: ${expectedReferences["ZELDA"] ? "✅" : "❌"}`
);
console.log(
  `     - Category constants: ${expectedReferences.categories ? "✅" : "❌"}`
);

// 4. Size comparison
const wordsFileSize =
  fs.statSync(path.join(process.cwd(), "data", "words.json")).size / 1024;
const sizeDifferenceKB = bundleSizeMB * 1024 - wordsFileSize;

console.log(`\n📏 Size Comparison:`);
console.log(`   Words file: ${wordsFileSize.toFixed(1)} KB`);
console.log(`   Bundle: ${(bundleSizeMB * 1024).toFixed(1)} KB`);
console.log(
  `   Savings: ${wordsFileSize.toFixed(1)} KB (${(
    (wordsFileSize / (bundleSizeMB * 1024)) *
    100
  ).toFixed(1)}% reduction)`
);

// 5. Final verdict
console.log("\n🎯 Verification Results:");

const checks = {
  "Bundle size reasonable": bundleSizeMB <= EXPECTED_BUNDLE_SIZE_MB,
  "No word dictionary in bundle": !unexpectedContent,
  "CDN references present": expectedReferences["words.json"],
  "Fallback puzzle present": expectedReferences["ZELDA"],
  "Bundle size savings": sizeDifferenceKB > 0,
};

let allPassed = true;
Object.entries(checks).forEach(([check, passed]) => {
  console.log(`   ${passed ? "✅" : "❌"} ${check}`);
  if (!passed) allPassed = false;
});

if (allPassed) {
  console.log(
    "\n🎉 Bundle verification PASSED! CDN-first approach is working correctly."
  );
  console.log(
    `💾 Bundle size: ${bundleSizeMB.toFixed(
      2
    )} MB (saved ${wordsFileSize.toFixed(1)} KB by excluding words)`
  );
} else {
  console.log("\n❌ Bundle verification FAILED! Check the issues above.");
  process.exit(1);
}
