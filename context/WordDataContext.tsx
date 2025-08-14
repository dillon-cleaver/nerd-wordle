import {
  createContext,
  ReactNode,
  useState,
  useEffect,
  useContext,
} from "react";
import { WordEntry, WordId } from "@/types/word";
import { wordsApi } from "@/utils/api";

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

        // Try to load from Firebase first
        const firebaseWords = await wordsApi.getAllWords();
        setWords(firebaseWords);
        console.log(`Loaded ${firebaseWords.length} words from Firebase`);
      } catch (err) {
        console.error("Failed to load words from Firebase:", err);
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
