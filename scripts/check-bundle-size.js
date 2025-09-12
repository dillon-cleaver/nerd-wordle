#!/usr/bin/env node

/**
 * Quick Bundle Size Check
 *
 * A lightweight version of verify-bundle-size.js for CI/development
 * Just checks that words.json isn't bundled and reports current size.
 */

const fs = require("fs");
const path = require("path");

console.log("🔍 Quick bundle check...");

// Check if we have a recent build
const distDir = path.join(
  process.cwd(),
  "dist",
  "_expo",
  "static",
  "js",
  "web"
);

if (!fs.existsSync(distDir)) {
  console.log(
    "⚠️  No build found. Run: pnpm words:verify-bundle for full verification"
  );
  process.exit(0);
}

const bundleFiles = fs
  .readdirSync(distDir)
  .filter(
    (file) =>
      file.startsWith("entry-") &&
      file.endsWith(".js") &&
      !file.endsWith(".map")
  );

if (bundleFiles.length === 0) {
  console.log(
    "⚠️  No bundle files found. Run: pnpm words:verify-bundle for full verification"
  );
  process.exit(0);
}

const bundleFile = path.join(distDir, bundleFiles[0]);
const bundleStats = fs.statSync(bundleFile);
const bundleSizeMB = bundleStats.size / (1024 * 1024);

// Quick check for word data
const bundleContent = fs.readFileSync(bundleFile, "utf8");
const testWords = ["MARIO", "SONIC", "VADER", "SPOCK"];
const foundWords = testWords.filter((word) => bundleContent.includes(word));

const wordsFileSize =
  fs.statSync(path.join(process.cwd(), "data", "words.json")).size / 1024;

console.log(`📊 Current bundle: ${bundleSizeMB.toFixed(2)} MB`);
console.log(`📁 Words file: ${wordsFileSize.toFixed(1)} KB`);
console.log(
  `🔍 Word data in bundle: ${foundWords.length > 0 ? "❌ FOUND" : "✅ None"}`
);

if (foundWords.length > 0) {
  console.log(`   Found: ${foundWords.join(", ")}`);
  console.log(
    "⚠️  Word data detected in bundle! Run: pnpm words:verify-bundle"
  );
  process.exit(1);
} else {
  console.log("✅ Bundle looks good!");
}
