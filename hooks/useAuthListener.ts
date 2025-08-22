import { useEffect } from "react";
import { onAuthStateChanged, getAuth, User } from "firebase/auth";
import { createUserIfNotExists } from "../firebase/CreateUserIfNotExists";

export function useAuthListener() {
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      if (user) {
        if (process.env.EXPO_PUBLIC_ENABLE_DEBUG_LOGS === "true") {
          console.log("Auth state changed: user signed in:", user.displayName);
        }
        await createUserIfNotExists(user);
      } else {
        if (process.env.EXPO_PUBLIC_ENABLE_DEBUG_LOGS === "true") {
          console.log("Auth state changed: user signed out");
        }
      }
    });

    return () => unsubscribe();
  }, []);
}
