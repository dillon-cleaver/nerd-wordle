import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { winHistoryApi, WinRecord } from '../utils/api';

interface PuzzleHistoryContextType {
  puzzleResults: WinRecord[];
  loading: boolean;
  error: string | null;
  savePuzzleResult: (user: User, puzzleResult: Omit<WinRecord, 'date'>) => Promise<void>;
  loadPuzzleResults: (user: User) => Promise<void>;
  clearError: () => void;
}

const PuzzleHistoryContext = createContext<PuzzleHistoryContextType | undefined>(undefined);

interface PuzzleHistoryProviderProps {
  children: ReactNode;
}

export function PuzzleHistoryProvider({ children }: PuzzleHistoryProviderProps) {
  const [puzzleResults, setPuzzleResults] = useState<WinRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const savePuzzleResult = useCallback(async (user: User, puzzleResult: Omit<WinRecord, 'date'>) => {
    try {
      setLoading(true);
      setError(null);
      
      await winHistoryApi.saveWin(user, puzzleResult);
      
      // Add the new puzzle result to local state
      const newResult: WinRecord = {
        ...puzzleResult,
        date: new Date().toISOString(),
      };
      setPuzzleResults(prev => [newResult, ...prev]);
      
      console.log('✅ Puzzle result saved successfully:', newResult);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save puzzle result';
      setError(errorMessage);
      console.error('❌ Failed to save puzzle result:', err);
      throw err; // Re-throw so caller can handle if needed
    } finally {
      setLoading(false);
    }
  }, []);

  const loadPuzzleResults = useCallback(async (user: User) => {
    try {
      setLoading(true);
      setError(null);
      
      const resultsData = await winHistoryApi.getWins(user);
      setPuzzleResults(resultsData);
      
      console.log('✅ Loaded puzzle results:', resultsData.length, 'records');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load puzzle results';
      setError(errorMessage);
      console.error('❌ Failed to load puzzle results:', err);
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
    throw new Error('usePuzzleHistory must be used within a PuzzleHistoryProvider');
  }
  return context;
}
