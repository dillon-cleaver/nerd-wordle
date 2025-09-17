import {
  createContext,
  ReactNode,
  useState,
  useEffect,
  useContext,
} from "react";
import { WordEntry, WordId } from "@/types/word";
import { loadWords } from "@/storage/words.local";
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
    const loadWordsData = async () => {
      try {
        if (isDebugLoggingEnabled()) {
          console.log("🔄 WordDataContext: Starting word loading...");
        }
        setIsLoading(true);
        setError(null);

        if (isDebugLoggingEnabled()) {
          console.log("🔄 Loading words from CDN (browser cache first)...");
        }

        // Browser cache handles the heavy lifting
        const wordsData = await loadWords();
        if (isDebugLoggingEnabled()) {
          console.log(
            `✅ WordDataContext: Successfully loaded ${wordsData.length} words`
          );
        }
        setWords(wordsData);

        if (isDebugLoggingEnabled()) {
          console.log(`✅ Loaded ${wordsData.length} words successfully`);
        }
      } catch (err) {
        console.error("❌ WordDataContext: Failed to load words:", err);
        setError(err as Error);
      } finally {
        if (isDebugLoggingEnabled()) {
          console.log("🔄 WordDataContext: Setting loading to false");
        }
        setIsLoading(false);
      }
    };

    if (isDebugLoggingEnabled()) {
      console.log(
        "🔄 WordDataContext: useEffect triggered, calling loadWordsData"
      );
    }
    loadWordsData();
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
