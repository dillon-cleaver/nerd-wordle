import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/firebaseConfig";
import type { UserProfile } from "@/types/UserProfile";

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
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setAuthUser(user);
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserProfile(docSnap.data() as UserProfile);
        } else {
          console.warn("No Firestore profile found for user:", user.uid);
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ authUser, userProfile, loading }}>
      {children}
    </UserContext.Provider>
  );
}
