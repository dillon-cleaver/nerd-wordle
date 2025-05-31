import { useEffect } from "react";
import { onAuthStateChanged, getAuth, User } from "firebase/auth";
import { createUserIfNotExists } from "../firebase/CreateUserIfNotExists";

export function useAuthListener() {
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      if (user) {
        console.log("Auth state changed: user signed in:", user.displayName);
        await createUserIfNotExists(user);
      } else {
        console.log("Auth state changed: user signed out");
      }
    });

    return () => unsubscribe();
  }, []);
}
