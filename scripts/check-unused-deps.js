#!/usr/bin/env node

/**
 * Quick Dependency Cleanup Script
 *
 * Identifies potentially unused dependencies by checking if they're imported
 */

const fs = require("fs");
const { execSync } = require("child_process");

console.log("🔍 Checking for unused dependencies...\n");

// Read package.json
const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
const dependencies = Object.keys(packageJson.dependencies || {});

// Dependencies that are likely safe to check
const checkableDeps = dependencies.filter(
  (dep) =>
    dep.startsWith("expo-") &&
    ![
      "expo",
      "expo-router",
      "expo-font",
      "expo-constants",
      "expo-status-bar",
    ].includes(dep)
);

console.log("📦 Checking these Expo dependencies:");
checkableDeps.forEach((dep) => console.log(`   - ${dep}`));
console.log("");

const unused = [];

for (const dep of checkableDeps) {
  try {
    // Search for imports of this dependency
    const result = execSync(
      `grep -r "from \\"${dep}\\"\\|import.*\\"${dep}\\"" --include="*.tsx" --include="*.ts" --exclude-dir=node_modules --exclude-dir=.git . || true`,
      { encoding: "utf8", stdio: "pipe" }
    );

    if (!result.trim()) {
      unused.push(dep);
    } else {
      console.log(`✅ ${dep}: Used`);
    }
  } catch (_error) {
    // If grep fails, assume it's used to be safe
    console.log(`❓ ${dep}: Could not verify (assuming used)`);
  }
}

console.log("\n📋 Results:");
if (unused.length === 0) {
  console.log("✅ No obviously unused Expo dependencies found!");
} else {
  console.log(`❌ Potentially unused dependencies: ${unused.length}`);
  unused.forEach((dep) => {
    console.log(`   - ${dep}`);
  });

  console.log("\n💡 To remove them:");
  console.log(`pnpm remove ${unused.join(" ")}`);
  console.log("\n⚠️  Test thoroughly after removal!");
}

// Check for any other large dependencies
console.log("\n📊 Largest dependencies (estimated):");
const largeDeps = [
  "firebase",
  "react-native-reanimated",
  "react-native-gesture-handler",
  "react-native-svg",
  "react-native-webview",
];

largeDeps.forEach((dep) => {
  if (dependencies.includes(dep)) {
    console.log(`   📦 ${dep} (likely large)`);
  }
});
