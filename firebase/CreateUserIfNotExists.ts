import { doc, getDoc, setDoc } from "firebase/firestore";
import { getFirestoreInstance } from "./firebaseConfig";
import type { User } from "firebase/auth";
import type { UserProfile } from "@/types/user-profile";
import { isDebugLoggingEnabled } from "@/utils/dev-flags";

export async function createUserIfNotExists(user: User) {
  const db = getFirestoreInstance();
  const userRef = doc(db, "users", user.uid);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    const userProfile: UserProfile = {
      id: user.uid,
      displayName: user.displayName || "Anonymous",
      email: user.email || "",
      photoURL: user.photoURL || "",
      joinedAt: new Date(),
      friends: [],
    };

    await setDoc(userRef, userProfile);
    if (isDebugLoggingEnabled()) {
      console.log("User profile created");
    }
  } else {
    if (isDebugLoggingEnabled()) {
      console.log("User already exists");
    }
  }
}
