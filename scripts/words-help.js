#!/usr/bin/env node

/**
 * Word Management Help System
 *
 * Displays comprehensive help for all word management commands
 * with clear usage examples and explanations.
 */

function showWordManagementHelp() {
  console.log("📚 Word Management Commands:");
  console.log("");

  console.log("🎯 Essential Commands:");
  console.log("  pnpm run words:add              # Add new word (local only)");
  console.log("  pnpm run words:deploy:all       # Deploy to CDN + Firestore");
  console.log("  pnpm run words:verify [WORD]    # Verify deployment");
  console.log("");

  console.log("🔍 Status & Analysis:");
  console.log("  pnpm run words:status           # Show current status");
  console.log("  pnpm run words:check-bundle     # Verify CDN optimization");
  console.log("  pnpm run analyze:bundle         # Full bundle analysis");
  console.log("");

  console.log("🔧 Individual Deployment:");
  console.log("  pnpm run words:deploy:cdn       # CDN only (users)");
  console.log("  pnpm run words:deploy:firestore # Firestore only (server)");
  console.log("");

  console.log("📋 Data Management:");
  console.log(
    "  pnpm run words:validate         # Validate word data structure"
  );
  console.log("  pnpm run build:dictionary       # Build dictionary files");
  console.log("");

  console.log("ℹ️  For detailed guidance:");
  console.log("  📖 docs/word-management-quick-reference.md");
  console.log("  📚 docs/word-management-guide.md");
}

// Run if called directly
if (require.main === module) {
  showWordManagementHelp();
}

module.exports = { showWordManagementHelp };
