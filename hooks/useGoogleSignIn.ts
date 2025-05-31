import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

const auth = getAuth();
const provider = new GoogleAuthProvider();

export function signInWithGoogle() {
  signInWithPopup(auth, provider)
    .then((result) => {
      // result.user contains your signed-in user
      console.log("Logged in as", result.user.displayName);
      // Extract credential and tokens
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential) {
        console.log("ID Token:", credential.idToken);
        console.log("Access Token:", credential.accessToken);
      } else {
        console.warn("No credential returned from Google sign-in");
      }
    })
    .catch((error) => {
      console.error("Google sign-in error:", error);
    });
}

export function signOutGoogle() {
  signOut(auth)
    .then(() => {
      console.log("User signed out successfully");
    })
    .catch((error) => {
      console.error("Sign-out error:", error);
    });
}
