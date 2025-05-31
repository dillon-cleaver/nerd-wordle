import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const auth = getAuth();
const provider = new GoogleAuthProvider();

export function signInWithGoogle() {
  signInWithPopup(auth, provider)
    .then((result) => {
      // result.user contains your signed-in user
      console.log("Logged in as", result.user.displayName);
    })
    .catch((error) => {
      console.error("Google sign-in error:", error);
    });
}
