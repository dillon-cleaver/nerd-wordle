import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

// Environment detection
const isDevelopment =
  process.env.NODE_ENV === "development" ||
  process.env.EXPO_PUBLIC_DEV_MODE === "true";

// Initialize Firebase - PRODUCTION CONFIG
// Firestore behavior:
// - When FIRESTORE_EMULATOR_HOST is set (emulator running): Uses local emulator
// - When FIRESTORE_EMULATOR_HOST is not set: Uses production Firestore
// - Firebase SDK automatically detects the environment variable
export const firebaseConfig = {
  apiKey: "AIzaSyCFKMe4vTWkUKr83E-T_i7wmrhG7cx29zY",
  authDomain: "nerd-word-cfda3.firebaseapp.com",
  projectId: "nerd-word-cfda3",
  storageBucket: "nerd-word-cfda3.firebasestorage.app",
  messagingSenderId: "1095647998196",
  appId: "1:1095647998196:web:7bbee77f52a04d286c2ea1",
  measurementId: "G-2VYYRXBD02",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Connect to emulators in development
if (isDevelopment) {
  // Only connect if not already connected
  try {
    connectFirestoreEmulator(db, "localhost", 8080);
    connectAuthEmulator(auth, "http://localhost:9099");
    console.log("🔧 Connected to Firebase emulators");
  } catch (error) {
    // Emulators might already be connected
    console.log(
      "🔧 Firebase emulators connection (may already be connected):",
      error
    );
  }
}
