import { createContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { getAuthInstance, db } from "@/firebase/firebaseConfig";
import { createUserIfNotExists } from "@/firebase/CreateUserIfNotExists";
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
    const unsubscribe = onAuthStateChanged(getAuthInstance(), async (user) => {
      if (user) {
        // TODO: Remove before beta testing
        // Console log user information for debugging
        if (isDebugLoggingEnabled()) {
          console.log("=== User Authentication Info ===");
          console.log("Email:", user.email);
          console.log("UID:", user.uid);
          console.log("Display Name:", user.displayName);
          console.log("Provider:", user.providerData[0]?.providerId);
          console.log("=====================================");
        }

        try {
          await createUserIfNotExists(user);

          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          const profile = docSnap.exists()
            ? (docSnap.data() as UserProfile)
            : null;

          if (!docSnap.exists()) {
            console.warn("No Firestore profile found for user:", user.uid);
          }

          setUserState({
            authUser: user,
            userProfile: profile,
            loading: false,
          });
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setUserState({
            authUser: user,
            userProfile: null,
            loading: false,
          });
        }
      } else {
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
