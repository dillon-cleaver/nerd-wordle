import Constants from "expo-constants";
import { initializeApp } from "firebase/app";
import { getAuth, Auth, initializeAuth } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { Platform } from "react-native";

// Check if running in Expo Go (as opposed to a dev build or web)
const isExpoGo = Constants.appOwnership === "expo";

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
let authInitPromise: Promise<Auth> | undefined;
let firestoreInstance: ReturnType<typeof getFirestore> | null = null;

// Async version for safe initialization in React Native/Expo Go
export async function getAuthInstanceAsync(): Promise<Auth> {
  if (authInstance) {
    return authInstance;
  }

  // If already initializing, wait for that to complete
  if (authInitPromise) {
    return authInitPromise;
  }

  authInitPromise = (async () => {
    // Check if running in Expo Go - Firebase Auth doesn't work there
    if (isExpoGo && Platform.OS !== "web") {
      console.warn("Firebase Auth is not supported in Expo Go on iOS/Android.");
      console.warn("   To use authentication, create a development build:");
      console.warn(
        "   https://docs.expo.dev/develop/development-builds/create-a-build/"
      );
      console.warn("   The app will continue to work without authentication.");

      authInitPromise = undefined;
      throw new Error("Firebase Auth not supported in Expo Go");
    }

    // For development builds and web: wait for environment to be ready
    await new Promise((resolve) => setTimeout(resolve, 100));

    try {
      // Use proper initialization for each platform
      if (Platform.OS === "web") {
        authInstance = getAuth(app);
      } else {
        // For React Native (iOS/Android), use initializeAuth
        // Note: Without native Firebase, we can't use AsyncStorage persistence
        // Auth will work but won't persist between app restarts
        authInstance = initializeAuth(app);
      }

      if (ENABLE_DEBUG) {
        console.log(`Firebase Auth initialized successfully (${Platform.OS})`);
      }

      return authInstance!;
    } catch (error: any) {
      // If auth was already initialized, just get the instance
      if (error?.code === "auth/already-initialized") {
        authInstance = getAuth(app);
        if (ENABLE_DEBUG) {
          console.log(`Firebase Auth already initialized (${Platform.OS})`);
        }
        return authInstance!;
      }

      console.error(
        "Firebase Auth initialization failed:",
        error.code || error.message
      );

      authInitPromise = undefined; // Reset so app can retry later if needed
      throw error;
    }
  })();

  return authInitPromise;
}

// Synchronous version - returns the auth instance if already initialized
// Returns undefined if not yet initialized. Use getAuthInstanceAsync() for guaranteed initialization.
export function getAuthInstance(): Auth | undefined {
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
