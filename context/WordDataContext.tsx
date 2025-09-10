import {
  createContext,
  ReactNode,
  useState,
  useEffect,
  useContext,
} from "react";
import { WordEntry, WordId } from "@/types/word";
import { getDictionaryUrl } from "@/constants/api";
import { wordsApi } from "@/utils/api";
import {
  saveWordsLocal,
  loadWordsLocal,
  isWordsCacheValid,
} from "@/storage/words.local";
import { isDebugLoggingEnabled } from "@/utils/dev-flags";

type WordDataContextType = {
  words: WordEntry[];
  isLoading: boolean;
  error: Error | null;
  getWordEntry: (id: WordId) => WordEntry | undefined;
  isValidWord: (word: string) => boolean;
};

const WordDataContext = createContext<WordDataContextType>({
  words: [],
  isLoading: true,
  error: null,
  getWordEntry: () => undefined,
  isValidWord: () => false,
});

export const WordDataProvider = ({ children }: { children: ReactNode }) => {
  const [words, setWords] = useState<WordEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadWords = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Check if we have cached words
        const cachedData = loadWordsLocal();
        if (cachedData && isWordsCacheValid(cachedData)) {
          if (isDebugLoggingEnabled()) {
            console.log("Loading words from localStorage cache");
          }
          setWords(cachedData.words);
          setIsLoading(false);
          return;
        }

        // Cache miss or expired, try static hosting first, then fallback to API
        if (isDebugLoggingEnabled()) {
          console.log("Cache miss, trying static hosting first");
        }

        let firebaseWords: WordEntry[] = [];

        try {
          // Try Firebase Hosting CDN first
          const DICTIONARY_URL = getDictionaryUrl();

          if (isDebugLoggingEnabled()) {
            try {
              const urlObj = new URL(DICTIONARY_URL);
              // Only log origin and pathname, omitting query and sensitive info
              console.log(
                `Attempting to fetch from: ${urlObj.origin}${urlObj.pathname}`
              );
            } catch {
              // Fallback: log generic message if URL parsing fails
              console.log("Attempting to fetch from dictionary URL");
            }
          }

          const response = await fetch(DICTIONARY_URL);
          if (!response.ok) {
            throw new Error(
              `CDN fetch failed: ${response.status} ${response.statusText}`
            );
          }
          firebaseWords = await response.json();

          if (isDebugLoggingEnabled()) {
            console.log(`✅ Loaded ${firebaseWords.length} words from CDN`);
          }
        } catch (cdnError) {
          // Fallback to original API if CDN fails
          if (isDebugLoggingEnabled()) {
            console.log("CDN failed, falling back to API:", cdnError);
          }
          firebaseWords = await wordsApi.getAllWords();

          if (isDebugLoggingEnabled()) {
            console.log(
              `✅ Loaded ${firebaseWords.length} words from API (fallback)`
            );
          }
        }

        setWords(firebaseWords);

        // Cache the words using utility function
        saveWordsLocal(firebaseWords);

        if (isDebugLoggingEnabled()) {
          console.log(`📊 Words loaded and cached successfully`);
        }
      } catch (err) {
        console.error("Failed to load words:", err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    loadWords();
  }, []);

  const getWordEntry = (id: WordId): WordEntry | undefined => {
    return words.find((word) => word.id === id);
  };

  const isValidWord = (word: string): boolean => {
    return words.some((w) => w.id === word.toUpperCase());
  };

  return (
    <WordDataContext.Provider
      value={{
        words,
        isLoading,
        error,
        getWordEntry,
        isValidWord,
      }}
    >
      {children}
    </WordDataContext.Provider>
  );
};

export const useWordData = () => {
  const context = useContext(WordDataContext);
  if (!context) {
    throw new Error("useWordData must be used within a WordDataProvider");
  }
  return context;
};
