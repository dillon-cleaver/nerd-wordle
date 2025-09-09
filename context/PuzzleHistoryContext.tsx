import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { User } from "firebase/auth";
import { puzzleHistoryApi } from "../utils/api";
import { PuzzleResult } from "@/types/puzzle-result";
import { isPuzzleHistoryDebugEnabled } from "@/utils/dev-flags";

interface PuzzleHistoryContextType {
  puzzleResults: PuzzleResult[];
  loading: boolean;
  error: string | null;
  savePuzzleResult: (user: User, puzzleResult: PuzzleResult) => Promise<void>;
  loadPuzzleResults: (user: User) => Promise<void>;
  clearError: () => void;
  autoLoadResults: (user: User | null, userLoading: boolean) => void;
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
  const [hasLoadedInitialData, setHasLoadedInitialData] = useState(false);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const loadPuzzleResults = useCallback(async (user: User) => {
    try {
      setLoading(true);
      setError(null);

      const resultsData = await puzzleHistoryApi.getPuzzleHistory(user);
      setPuzzleResults(resultsData);

      if (isPuzzleHistoryDebugEnabled()) {
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

  // External auto-load function that can be called from components
  const autoLoadResults = useCallback(
    (user: User | null, userLoading: boolean) => {
      if (user && !userLoading && !hasLoadedInitialData) {
        if (isPuzzleHistoryDebugEnabled()) {
          console.log("🔄 Auto-loading puzzle history for authenticated user");
        }
        loadPuzzleResults(user)
          .then(() => {
            setHasLoadedInitialData(true);
          })
          .catch(() => {
            setHasLoadedInitialData(true); // Still mark as tried to avoid infinite retries
          });
      } else if (!user && hasLoadedInitialData) {
        // Reset when user logs out
        setPuzzleResults([]);
        setHasLoadedInitialData(false);
      }
    },
    [hasLoadedInitialData, loadPuzzleResults]
  );

  const savePuzzleResult = useCallback(
    async (user: User, puzzleResult: PuzzleResult) => {
      try {
        setLoading(true);
        setError(null);

        await puzzleHistoryApi.savePuzzleResult(user, puzzleResult);
        setPuzzleResults((prev) => [puzzleResult, ...prev]);

        // TODO: Replace console.log with proper logging service (e.g., Firebase Analytics, Sentry)
        if (isPuzzleHistoryDebugEnabled()) {
          console.log("✅ Puzzle result saved successfully:", puzzleResult);
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

  const value: PuzzleHistoryContextType = {
    puzzleResults,
    loading,
    error,
    savePuzzleResult,
    loadPuzzleResults,
    clearError,
    autoLoadResults,
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
