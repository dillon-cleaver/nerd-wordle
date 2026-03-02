import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getAuthInstance } from "@/firebase/firebaseConfig";

export function signInWithGoogle() {
  const auth = getAuthInstance();
  if (!auth) {
    console.error("Auth not initialized. Cannot sign in with Google.");
    return;
  }
  const provider = new GoogleAuthProvider();

  signInWithPopup(auth, provider)
    .then((result) => {
      // result.user contains your signed-in user
      if (process.env.EXPO_PUBLIC_ENABLE_DEBUG_LOGS === "true") {
        console.log("Logged in as", result.user.displayName);
      }
      // Extract credential and tokens
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential) {
        if (process.env.EXPO_PUBLIC_ENABLE_DEBUG_LOGS === "true") {
          console.log("ID Token:", credential.idToken);
          console.log("Access Token:", credential.accessToken);
        }
      } else {
        if (process.env.EXPO_PUBLIC_ENABLE_DEBUG_LOGS === "true") {
          console.warn("No credential returned from Google sign-in");
        }
      }
    })
    .catch((error) => {
      console.error("Google sign-in error:", error);
    });
}

export function signOutGoogle() {
  const auth = getAuthInstance();
  if (!auth) {
    console.error("Auth not initialized. Cannot sign out.");
    return;
  }
  signOut(auth)
    .then(() => {
      if (process.env.EXPO_PUBLIC_ENABLE_DEBUG_LOGS === "true") {
        console.log("User signed out successfully");
      }
    })
    .catch((error) => {
      console.error("Sign-out error:", error);
    });
}
