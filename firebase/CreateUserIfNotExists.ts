import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";
import type { User } from "firebase/auth";
import type { UserProfile } from "@/types/user-profile";

export async function createUserIfNotExists(user: User) {
  const userRef = doc(db, "users", user.uid);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    const userProfile: UserProfile = {
      uid: user.uid,
      displayName: user.displayName || "Anonymous",
      email: user.email || "",
      photoURL: user.photoURL || "",
      joinedAt: Date.now(),
      friends: [],
    };

    await setDoc(userRef, userProfile);
    console.log("User profile created");
  } else {
    console.log("User already exists");
  }
}
