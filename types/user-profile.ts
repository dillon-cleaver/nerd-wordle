import { PuzzleResult } from "./puzzle-result";
import { UserWordCollections } from "./word-collection";

type UserProfile = {
  readonly id: string;
  displayName: string;
  email: string;
  photoURL: string;
  joinedAt: Date;
  friends: readonly string[];
  puzzleHistory?: readonly PuzzleResult[]; // All puzzle attempts (wins/losses)
  wordCollections?: UserWordCollections; // Achievement/collection data
};

export { UserProfile };
