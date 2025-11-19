import Constants from "expo-constants";
import { initializeApp } from "firebase/app";
import { initializeAuth, getAuth, Auth } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { Platform } from "react-native";

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
  console.log("Firebase flags", { isDevelopment });
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

// Delayed initialization for auth to work with Hermes engine
// Auth must be initialized on first access, not at module load time
let authInstance: Auth | undefined;
let firestoreInstance: ReturnType<typeof getFirestore> | null = null;

export function getAuthInstance(): Auth {
  if (!authInstance) {
    // For React Native: use initializeAuth to properly register auth component
    // For web: use getAuth
    if (Platform.OS === "web") {
      authInstance = getAuth(app);
    } else {
      try {
        authInstance = initializeAuth(app);
      } catch (error: any) {
        // If already initialized (shouldn't happen with our pattern, but just in case)
        if (error?.code === "auth/already-initialized") {
          authInstance = getAuth(app);
        } else {
          console.error("Failed to initialize Firebase Auth:", error);
          // Fallback to getAuth as a last resort
          try {
            authInstance = getAuth(app);
          } catch (fallbackError) {
            console.error("Failed to get auth instance:", fallbackError);
            throw error; // Re-throw original error
          }
        }
      }
    }

    if (ENABLE_DEBUG) {
      console.log(`Firebase Auth initialized (${Platform.OS})`);
    }
  }
  return authInstance;
}

export function getFirestoreInstance() {
  if (!firestoreInstance) {
    firestoreInstance = getFirestore(app);

    // Connect to emulator if in development
    if (isDevelopment) {
      try {
        connectFirestoreEmulator(firestoreInstance, "localhost", 8080);
        if (ENABLE_DEBUG) {
          console.log("Connected to Firestore emulator on localhost:8080");
        }
      } catch (e) {
        if (ENABLE_DEBUG) console.log("Firestore emulator connect:", e);
      }
    }

    if (ENABLE_DEBUG) {
      console.log("Firestore initialized");
    }
  }
  return firestoreInstance;
}
