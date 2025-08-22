import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { User } from "firebase/auth";
import { puzzleHistoryApi, PuzzleResult } from "../utils/api";
import { isDebugLoggingEnabled } from "@/utils/dev-flags";

interface PuzzleHistoryContextType {
  puzzleResults: PuzzleResult[];
  loading: boolean;
  error: string | null;
  savePuzzleResult: (
    user: User,
    puzzleResult: Omit<PuzzleResult, "date">
  ) => Promise<void>;
  loadPuzzleResults: (user: User) => Promise<void>;
  clearError: () => void;
}

const PuzzleHistoryContext = createContext<
  PuzzleHistoryContextType | undefined
>(undefined);

interface PuzzleHistoryProviderProps {
  children: ReactNode;
}

export function PuzzleHistoryProvider({
  children,
}: PuzzleHistoryProviderProps) {
  const [puzzleResults, setPuzzleResults] = useState<PuzzleResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const savePuzzleResult = useCallback(
    async (user: User, puzzleResult: Omit<PuzzleResult, "date">) => {
      try {
        setLoading(true);
        setError(null);

        await puzzleHistoryApi.savePuzzleResult(user, puzzleResult);

        // Add the new puzzle result to local state
        const newResult: PuzzleResult = {
          ...puzzleResult,
          date: new Date().toISOString(),
        };
        setPuzzleResults((prev) => [newResult, ...prev]);

        // TODO: Replace console.log with proper logging service (e.g., Firebase Analytics, Sentry)
        if (isDebugLoggingEnabled()) {
          console.log("✅ Puzzle result saved successfully:", newResult);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to save puzzle result";
        setError(errorMessage);
        // TODO: Replace console.error with proper error tracking service (e.g., Sentry, Crashlytics)
        console.error("❌ Failed to save puzzle result:", err);
        throw err; // Re-throw so caller can handle if needed
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const loadPuzzleResults = useCallback(async (user: User) => {
    try {
      setLoading(true);
      setError(null);

      const resultsData = await puzzleHistoryApi.getPuzzleHistory(user);
      setPuzzleResults(resultsData);

      if (isDebugLoggingEnabled()) {
        console.log("✅ Loaded puzzle results:", resultsData.length, "records");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load puzzle results";
      setError(errorMessage);
      console.error("❌ Failed to load puzzle results:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const value: PuzzleHistoryContextType = {
    puzzleResults,
    loading,
    error,
    savePuzzleResult,
    loadPuzzleResults,
    clearError,
  };

  return (
    <PuzzleHistoryContext.Provider value={value}>
      {children}
    </PuzzleHistoryContext.Provider>
  );
}

export function usePuzzleHistory(): PuzzleHistoryContextType {
  const context = useContext(PuzzleHistoryContext);
  if (context === undefined) {
    throw new Error(
      "usePuzzleHistory must be used within a PuzzleHistoryProvider"
    );
  }
  return context;
}
