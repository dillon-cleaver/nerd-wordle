/**
 * Emergency fallback word set for when CDN loading fails
 * This is a minimal set of words that allows the app to function
 * Users will get a degraded experience but the app won't be completely broken
 */

import { WordEntry } from "@/types/word";

export const FALLBACK_WORDS: WordEntry[] = [
  // Common words for basic functionality
  { id: "WORDS", category: "common" },
  { id: "GAMES", category: "common" },
  { id: "TESTS", category: "common" },
  { id: "CODED", category: "common" },
  { id: "LOGIC", category: "common" },
  { id: "DEBUG", category: "common" },
  { id: "ERROR", category: "common" },
  { id: "FIXED", category: "common" },
  { id: "PATCH", category: "common" },
  { id: "BUILD", category: "common" },

  // A few nerd words for basic functionality
  {
    id: "LINUX",
    category: "techAndInternetCulture",
    edition: 1,
    summary: "Popular open-source operating system",
    hints: ["Operating system", "Open source", "Command line"],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Linux",
  },
  {
    id: "REACT",
    category: "techAndInternetCulture",
    edition: 1,
    summary: "JavaScript library for building user interfaces",
    hints: ["JavaScript library", "Facebook", "Components"],
    wikipediaUrl: "https://en.wikipedia.org/wiki/React_(JavaScript_library)",
  },
  {
    id: "PIXEL",
    category: "techAndInternetCulture",
    edition: 1,
    summary: "Picture element, smallest unit of a digital image",
    hints: ["Image element", "Screen", "Digital"],
    wikipediaUrl: "https://en.wikipedia.org/wiki/Pixel",
  },
];

export const FALLBACK_WORDS_COUNT = FALLBACK_WORDS.length;
