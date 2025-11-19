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
import {
  savePuzzleResultLocal,
  loadPuzzleResultsLocal,
} from "@/storage/puzzle-results.local";

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

      // Sync backend results to local storage for game state restoration
      const existingLocalResults = await loadPuzzleResultsLocal();
      const existingLocalDates = new Set(
        existingLocalResults.map((result) => {
          const date =
            result.date instanceof Date
              ? result.date.toISOString().split("T")[0]
              : new Date(result.date).toISOString().split("T")[0];
          return date;
        })
      );

      // Save any backend results that aren't already in local storage
      let syncedToLocal = 0;
      for (const backendResult of resultsData) {
        const backendDate =
          backendResult.date instanceof Date
            ? backendResult.date.toISOString().split("T")[0]
            : new Date(backendResult.date).toISOString().split("T")[0];

        if (!existingLocalDates.has(backendDate)) {
          await savePuzzleResultLocal(backendResult);
          syncedToLocal++;
        }
      }

      // Sync local storage results to backend (upload missing local results)
      const existingBackendDates = new Set(
        resultsData.map((result) => {
          const date =
            result.date instanceof Date
              ? result.date.toISOString().split("T")[0]
              : new Date(result.date).toISOString().split("T")[0];
          return date;
        })
      );

      let syncedToBackend = 0;
      for (const localResult of existingLocalResults) {
        const localDate =
          localResult.date instanceof Date
            ? localResult.date.toISOString().split("T")[0]
            : new Date(localResult.date).toISOString().split("T")[0];

        if (!existingBackendDates.has(localDate)) {
          try {
            await puzzleHistoryApi.savePuzzleResult(user, localResult);
            setPuzzleResults((prev) => [localResult, ...prev]);
            syncedToBackend++;
          } catch (uploadError) {
            if (isPuzzleHistoryDebugEnabled()) {
              console.warn(
                "⚠️ Failed to sync local result to backend:",
                localResult.id,
                uploadError
              );
            }
            // Continue with other results even if one fails
          }
        }
      }

      if (isPuzzleHistoryDebugEnabled()) {
        console.log("Loaded puzzle results:", resultsData.length, "records");
        if (syncedToLocal > 0) {
          console.log(
            "Synced",
            syncedToLocal,
            "backend results to local storage"
          );
        }
        if (syncedToBackend > 0) {
          console.log(
            "Synced",
            syncedToBackend,
            "local storage results to backend"
          );
        }
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load puzzle results";
      setError(errorMessage);
      console.error("Failed to load puzzle results:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // External auto-load function that can be called from components
  const autoLoadResults = useCallback(
    (user: User | null, userLoading: boolean) => {
      if (user && !userLoading && !hasLoadedInitialData) {
        if (isPuzzleHistoryDebugEnabled()) {
          console.log("Auto-loading puzzle history for authenticated user");
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

        if (isPuzzleHistoryDebugEnabled()) {
          console.log("Context: Starting to save puzzle result:", puzzleResult);
        }

        // Save to local storage immediately for "already played" check
        savePuzzleResultLocal(puzzleResult);
        if (isPuzzleHistoryDebugEnabled()) {
          console.log("Context: Saved to local storage successfully");
        }

        // Update context state immediately for UI responsiveness
        setPuzzleResults((prev) => [puzzleResult, ...prev]);
        if (isPuzzleHistoryDebugEnabled()) {
          console.log("Context: Updated context state immediately");
        }

        // Save to backend (this can fail without affecting UI)
        if (isPuzzleHistoryDebugEnabled()) {
          console.log("Context: Saving to backend...");
        }
        await puzzleHistoryApi.savePuzzleResult(user, puzzleResult);

        // TODO: Replace console.log with proper logging service (e.g., Firebase Analytics, Sentry)
        if (isPuzzleHistoryDebugEnabled()) {
          console.log("Puzzle result saved successfully:", puzzleResult);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to save puzzle result";
        setError(errorMessage);
        // TODO: Replace console.error with proper error tracking service (e.g., Sentry, Crashlytics)
        console.error("Failed to save puzzle result:", err);

        // If backend save failed, don't revert the context state since local storage save succeeded
        // This ensures the UI remains responsive even if backend is temporarily unavailable
        if (isPuzzleHistoryDebugEnabled()) {
          console.log(
            "⚠️ Backend save failed, but keeping context state updated"
          );
        }

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
