import Constants from "expo-constants";
import { initializeApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

type FirebaseConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string; // ← optional on web if no analytics
};

const extra = (Constants.expoConfig?.extra ?? {}) as Record<string, any>;
const extraFirebase = (extra.firebase ?? {}) as Partial<FirebaseConfig>;

// Flags: prefer Expo extra; fall back to env / __DEV__
const ENABLE_DEBUG =
  String(extra.EXPO_PUBLIC_ENABLE_DEBUG_LOGS) === "true" ||
  (typeof process !== "undefined" &&
    process.env?.EXPO_PUBLIC_ENABLE_DEBUG_LOGS === "true");

const isDevelopment =
  String(extra.EXPO_PUBLIC_DEV_MODE) === "true" ||
  (typeof __DEV__ !== "undefined" && __DEV__ === true) ||
  (typeof process !== "undefined" && process.env?.NODE_ENV === "development");

if (ENABLE_DEBUG) {
  console.log("🔧 Firebase flags", { isDevelopment });
}

export const firebaseConfig: FirebaseConfig = {
  apiKey: extraFirebase.apiKey as string,
  authDomain: extraFirebase.authDomain as string,
  projectId: extraFirebase.projectId as string,
  storageBucket: extraFirebase.storageBucket as string,
  messagingSenderId: extraFirebase.messagingSenderId as string,
  appId: extraFirebase.appId as string,
  measurementId: extraFirebase.measurementId,
};

// Guard so misconfigured envs fail fast
if (
  !firebaseConfig.apiKey ||
  !firebaseConfig.projectId ||
  !firebaseConfig.appId
) {
  throw new Error(
    "Missing Firebase config from Expo extra. Ensure .env is filled and app.config.ts maps EXPO_PUBLIC_* → extra.firebase."
  );
}

const app = initializeApp(firebaseConfig);

// Lazy initialization for Firebase Auth to fix Expo Go iOS + Hermes compatibility
// This prevents "Component auth has not been registered yet" error
let authInstance: Auth | null = null;

export function getAuthInstance(): Auth {
  if (!authInstance) {
    authInstance = getAuth(app);
    if (ENABLE_DEBUG) {
      console.log("🔧 Firebase Auth initialized (lazy)");
    }
  }
  return authInstance;
}

export const db = getFirestore(app);

// Emulators (optional)
if (isDevelopment) {
  try {
    connectFirestoreEmulator(db, "localhost", 8080);
    if (ENABLE_DEBUG) {
      console.log("🔧 Connected to Firestore emulator on localhost:8080");
    }
  } catch (e) {
    if (ENABLE_DEBUG) console.log("🔧 Firestore emulator connect:", e);
  }
}
