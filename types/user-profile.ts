import { PuzzleResult } from "./puzzle-result";

type UserProfile = {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  joinedAt: number; // timestamp
  friends: string[]; // list of user UIDs
  puzzleHistory?: PuzzleResult[]; // Optional local cache only
};

export { UserProfile };
