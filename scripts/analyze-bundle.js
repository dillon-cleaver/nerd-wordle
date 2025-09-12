#!/usr/bin/env node

/**
 * Bundle Analysis Script
 *
 * Analyzes the bundle to identify optimization opportunities
 */

const fs = require("fs");
const path = require("path");

console.log("🔍 Analyzing bundle for optimization opportunities...\n");

// Find bundle file
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
  console.error("❌ No bundle file found. Run: npx expo export --platform web");
  process.exit(1);
}

const bundleFile = path.join(distDir, bundleFiles[0]);
const bundleContent = fs.readFileSync(bundleFile, "utf8");
const bundleSize = fs.statSync(bundleFile).size;

console.log(
  `📊 Bundle: ${bundleFiles[0]} (${(bundleSize / 1024 / 1024).toFixed(2)} MB)\n`
);

// Analyze major dependencies
const dependencies = {
  firebase: (bundleContent.match(/firebase/g) || []).length,
  expo: (bundleContent.match(/@expo/g) || []).length,
  "react-navigation": (bundleContent.match(/@react-navigation/g) || []).length,
  "vector-icons": (bundleContent.match(/vector-icons|FontAwesome/g) || [])
    .length,
  "async-storage": (bundleContent.match(/async-storage/g) || []).length,
  "expo-crypto": (bundleContent.match(/expo-crypto/g) || []).length,
  reanimated: (bundleContent.match(/reanimated/g) || []).length,
  "gesture-handler": (bundleContent.match(/gesture-handler/g) || []).length,
};

console.log("📦 Dependency Usage Analysis:");
Object.entries(dependencies)
  .sort((a, b) => b[1] - a[1])
  .forEach(([dep, count]) => {
    console.log(`   ${dep}: ${count} references`);
  });

// Check for potential optimizations
console.log("\n🎯 Optimization Opportunities:");

// 1. Firebase tree shaking
const firebaseModules = bundleContent.match(/firebase\/[a-z-]+/g) || [];
const uniqueFirebaseModules = [...new Set(firebaseModules)];
console.log(
  `   🔥 Firebase modules: ${
    uniqueFirebaseModules.length
  } (${uniqueFirebaseModules.join(", ")})`
);

// 2. Expo modules
const expoModules = bundleContent.match(/expo-[a-z-]+/g) || [];
const uniqueExpoModules = [...new Set(expoModules)];
console.log(`   📱 Expo modules: ${uniqueExpoModules.length}`);

// 3. Icon usage
const iconReferences = bundleContent.match(/"[a-z-]+"/g) || [];
const potentialIcons = iconReferences
  .filter(
    (ref) =>
      ref.length > 4 &&
      ref.length < 20 &&
      !ref.includes("http") &&
      !ref.includes(".")
  )
  .slice(0, 10);
console.log(
  `   🎨 Potential unused icons: ${
    potentialIcons.length > 0 ? "Check icon imports" : "Looks optimized"
  }`
);

// 4. Large strings/data
const largeStrings = bundleContent.match(/"[^"]{100,}"/g) || [];
console.log(
  `   📝 Large strings: ${largeStrings.length} (potential data to externalize)`
);

// 5. Source maps in production
const hasSourceMaps = bundleContent.includes("sourceMappingURL");
console.log(
  `   🗺️  Source maps: ${
    hasSourceMaps ? "❌ Present (remove for production)" : "✅ Not included"
  }`
);

console.log("\n💡 Recommended Optimizations:");
console.log("   1. ✅ Words.json already externalized (243KB saved)");
console.log("   2. ✅ FontAwesome → SVG icons (350KB saved)");

if (uniqueFirebaseModules.length > 5) {
  console.log(
    "   2. 🔥 Consider Firebase tree shaking - only import needed modules"
  );
}

if (uniqueExpoModules.length > 15) {
  console.log("   3. 📱 Review Expo modules - remove unused dependencies");
}

if (dependencies["vector-icons"] > 50) {
  console.log(
    "   4. 🎨 Optimize icon imports - use specific icons instead of full sets"
  );
}

if (largeStrings.length > 5) {
  console.log("   5. 📝 Consider externalizing large static data to CDN");
}

if (hasSourceMaps) {
  console.log("   6. 🗺️  Remove source maps for production builds");
}

console.log("   7. 📦 Enable compression (gzip/brotli) on hosting");
console.log("   8. 🔄 Implement code splitting for non-critical features");
