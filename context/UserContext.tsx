import { createContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/firebaseConfig";
import type { UserProfile } from "@/types/user-profile";
import { isDebugLoggingEnabled } from "@/utils/dev-flags";

type UserContextType = {
  authUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
};

export const UserContext = createContext<UserContextType>({
  authUser: null,
  userProfile: null,
  loading: true,
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [userState, setUserState] = useState<UserContextType>({
    authUser: null,
    userProfile: null,
    loading: true,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // TODO: Remove before beta testing
        // 🧪 Console log user information for debugging
        if (isDebugLoggingEnabled()) {
          console.log("=== User Authentication Info ===");
          console.log("Email:", user.email);
          console.log("UID:", user.uid);
          console.log("Display Name:", user.displayName);
          console.log("Provider:", user.providerData[0]?.providerId);
          console.log("=====================================");
        }

        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          // Simple, safe type assertion with error handling
          const profile = docSnap.exists() 
            ? (docSnap.data() as UserProfile) 
            : null;

          if (!docSnap.exists()) {
            console.warn("No Firestore profile found for user:", user.uid);
          }

          // Single atomic state update
          setUserState({
            authUser: user,
            userProfile: profile,
            loading: false,
          });
        } catch (error) {
          console.error("Error fetching user profile:", error);
          // Still set user as authenticated even if profile fetch fails
          setUserState({
            authUser: user,
            userProfile: null,
            loading: false,
          });
        }
      } else {
        // User is signed out - single atomic update
        setUserState({
          authUser: null,
          userProfile: null,
          loading: false,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={userState}>{children}</UserContext.Provider>
  );
}
