import { User } from 'firebase/auth';

// API base URL - update this for production deployment
const API_BASE_URL = 'http://127.0.0.1:5001/nerd-word-cfda3/us-central1/api';

export type WinRecord = {
  id: string;
  word: string;
  attempts: number;
  date: string;
  edition?: number;
  hintIndex?: number;
};

export type WinHistoryResponse = {
  wins: WinRecord[];
};

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function makeAuthenticatedRequest<T>(
  user: User,
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    // Get fresh Firebase ID token
    const token = await user.getIdToken(true);
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new ApiError(response.status, `API Error: ${response.status} - ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new Error(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export const winHistoryApi = {
  /**
   * Save a win record to the backend
   */
  async saveWin(user: User, winRecord: Omit<WinRecord, 'date'>): Promise<void> {
    await makeAuthenticatedRequest(user, '/win', {
      method: 'POST',
      body: JSON.stringify({
        ...winRecord,
        date: new Date().toISOString(),
      }),
    });
  },

  /**
   * Get all win records for the authenticated user
   */
  async getWins(user: User): Promise<WinRecord[]> {
    const response = await makeAuthenticatedRequest<WinHistoryResponse>(user, '/win', {
      method: 'GET',
    });
    return response.wins;
  },
};
