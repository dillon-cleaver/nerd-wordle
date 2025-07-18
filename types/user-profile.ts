import { PuzzleResult } from "./puzzle-result";

type UserProfile = {
  readonly id: string;
  displayName: string;
  email: string;
  photoURL: string;
  joinedAt: Date;
  friends: readonly string[];
  puzzleHistory?: readonly PuzzleResult[];
};

export { UserProfile };
