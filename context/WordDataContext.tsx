import { createContext, ReactNode, use, useContext, useMemo } from "react";
import { WordEntry, WordId } from "@/types/word";
import { loadWords } from "@/storage/words.local";

type WordDataContextType = {
  words: WordEntry[];
  getWordEntry: (id: WordId) => WordEntry | undefined;
  isValidWord: (word: string) => boolean;
};

const WordDataContext = createContext<WordDataContextType | null>(null);

// Create promise once at module level to prevent recreation
let wordsPromise: Promise<WordEntry[]> | null = null;

function getWordsPromise() {
  if (!wordsPromise) {
    wordsPromise = loadWords();
  }
  return wordsPromise;
}

export const WordDataProvider = ({ children }: { children: ReactNode }) => {
  // Suspend until words are loaded
  const words = use(getWordsPromise());

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => {
    const getWordEntry = (id: WordId): WordEntry | undefined => {
      return words.find((word) => word.id === id);
    };

    const isValidWord = (word: string): boolean => {
      return words.some((w) => w.id === word.toUpperCase());
    };

    return {
      words,
      getWordEntry,
      isValidWord,
    };
  }, [words]);

  return (
    <WordDataContext.Provider value={contextValue}>
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
