type UserProfile = {
  displayName: string;
  email: string;
  photoURL: string;
  joinedAt: number; // timestamp
  friends: string[]; // list of user UIDs
};

export { UserProfile };
