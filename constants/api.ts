/**
 * API and URL configuration constants
 */

export const API_URLS = {
  // Default CDN URL for dictionary fallback
  DICTIONARY_FALLBACK: "https://nerd-word-cfda3.web.app/dict/v3/words.json",
} as const;

export const getDictionaryUrl = (): string => {
  return process.env.EXPO_PUBLIC_DICTIONARY_URL || API_URLS.DICTIONARY_FALLBACK;
};
