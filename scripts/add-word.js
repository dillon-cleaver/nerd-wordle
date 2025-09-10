#!/usr/bin/env node

/**
 * Interactive script to add words to the dictionary
 *
 * This script helps users add new words to constants/words.json
 * with validation and category selection.
 *
 * Usage:
 *   node scripts/add-word.js
 *   node scripts/add-word.js MUSIC common
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const WORDS_FILE = path.join(process.cwd(), "constants", "words.json");

// Available categories (extracted from existing words)
const CATEGORIES = [
  "common",
  "movies", 
  "literature",
  "techAndInternetCulture",
  "science",
  "videoGames",
  "fantasyAndSciFi", 
  "superheroes",
  "tabletopAndBoardGames",
  "animeAndManga"
];

function loadWords() {
  try {
    const data = fs.readFileSync(WORDS_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("❌ Failed to load words.json:", error.message);
    process.exit(1);
  }
}

function saveWords(words) {
  try {
    fs.writeFileSync(WORDS_FILE, JSON.stringify(words, null, 2) + "\n");
    console.log("✅ Words saved successfully!");
  } catch (error) {
    console.error("❌ Failed to save words.json:", error.message);
    process.exit(1);
  }
}

function validateWord(id, category) {
  const issues = [];
  
  if (!id || typeof id !== "string") {
    issues.push("Word ID must be a non-empty string");
  }
  
  if (id && id !== id.toUpperCase()) {
    issues.push("Word ID should be uppercase (will be auto-converted)");
  }
  
  if (id && !/^[A-Z]+$/.test(id.toUpperCase())) {
    issues.push("Word ID should only contain letters");
  }
  
  if (!category || !CATEGORIES.includes(category)) {
    issues.push(`Category must be one of: ${CATEGORIES.join(", ")}`);
  }
  
  return issues;
}

function createReadlineInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
}

function askQuestion(rl, question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function interactiveAdd() {
  const rl = createReadlineInterface();
  
  console.log("🎯 Add New Word to Dictionary");
  console.log("=============================\n");
  
  try {
    // Get word ID
    const wordId = (await askQuestion(rl, "Enter word ID (letters only): ")).toUpperCase().trim();
    
    if (!wordId) {
      console.log("❌ Word ID is required");
      rl.close();
      return;
    }
    
    // Show available categories
    console.log("\nAvailable categories:");
    CATEGORIES.forEach((cat, index) => {
      console.log(`  ${index + 1}. ${cat}`);
    });
    
    // Get category
    const categoryInput = await askQuestion(rl, "\nEnter category (name or number): ");
    let category;
    
    if (/^\d+$/.test(categoryInput)) {
      const index = parseInt(categoryInput) - 1;
      category = CATEGORIES[index];
    } else {
      category = categoryInput.trim();
    }
    
    rl.close();
    
    // Validate input
    const issues = validateWord(wordId, category);
    if (issues.length > 0) {
      console.log("\n❌ Validation errors:");
      issues.forEach(issue => console.log(`   ${issue}`));
      return;
    }
    
    // Load existing words and check for duplicates
    const words = loadWords();
    const exists = words.find(w => w.id === wordId);
    
    if (exists) {
      console.log(`❌ Word "${wordId}" already exists in category "${exists.category}"`);
      return;
    }
    
    // Add the word
    const newWord = { id: wordId, category };
    words.push(newWord);
    
    // Sort alphabetically by ID
    words.sort((a, b) => a.id.localeCompare(b.id));
    
    // Save
    saveWords(words);
    
    console.log(`\n✅ Added "${wordId}" to category "${category}"`);
    console.log(`📊 Total words: ${words.length}`);
    console.log("\n🚀 Next steps:");
    console.log("   1. Run: pnpm words:deploy");
    console.log("   2. Test your changes in the app");
    
  } catch (error) {
    console.error("❌ Error:", error.message);
    rl.close();
  }
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length >= 2) {
    // Command line mode: node add-word.js WORD CATEGORY
    const [wordId, category] = args;
    const normalizedId = wordId.toUpperCase();
    
    const issues = validateWord(normalizedId, category);
    if (issues.length > 0) {
      console.log("❌ Validation errors:");
      issues.forEach(issue => console.log(`   ${issue}`));
      return;
    }
    
    const words = loadWords();
    const exists = words.find(w => w.id === normalizedId);
    
    if (exists) {
      console.log(`❌ Word "${normalizedId}" already exists in category "${exists.category}"`);
      return;
    }
    
    words.push({ id: normalizedId, category });
    words.sort((a, b) => a.id.localeCompare(b.id));
    saveWords(words);
    
    console.log(`✅ Added "${normalizedId}" to category "${category}"`);
    console.log(`📊 Total words: ${words.length}`);
    
  } else {
    // Interactive mode
    await interactiveAdd();
  }
}

main().catch(console.error);
