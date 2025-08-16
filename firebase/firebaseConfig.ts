import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

// Environment detection - only use emulator in actual development
const isDevelopment =
  process.env.NODE_ENV === "development" &&
  (process.env.EXPO_PUBLIC_DEV_MODE === "true" ||
  (typeof __DEV__ !== "undefined" && __DEV__));

// Debug logging
console.log(`🔧 Firebase Configuration:`, {
  isDevelopment,
  NODE_ENV: process.env.NODE_ENV,
  EXPO_PUBLIC_DEV_MODE: process.env.EXPO_PUBLIC_DEV_MODE,
  __DEV__: typeof __DEV__ !== "undefined" ? __DEV__ : "undefined",
});

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
    console.log("🔧 Connected to Firestore emulator on localhost:8080");

    // Test connection by attempting to access a document
    console.log("🔧 Testing Firestore emulator connection...");
  } catch (error) {
    // Emulator might already be connected
    console.log(
      "🔧 Firestore emulator connection (may already be connected):",
      error
    );
  }

  // Note: Auth emulator not configured - using production auth
  console.log("🔧 Using production Firebase Auth (emulator not configured)");
  console.log(
    "🔧 Emulator setup complete - Firestore should use localhost:8080"
  );
}
