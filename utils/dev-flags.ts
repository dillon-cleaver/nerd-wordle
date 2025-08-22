/**
 * Development Utilities and Feature Flags
 * Simple build-time configurations for development features
 */

/**
 * Check if dev mode is enabled
 */
export const isDevModeEnabled = (): boolean => {
  return process.env.EXPO_PUBLIC_DEV_MODE === "true";
};

/**
 * Check if daily limit bypass is enabled
 */
export const isDailyLimitBypassEnabled = (): boolean => {
  return process.env.EXPO_PUBLIC_BYPASS_DAILY_LIMIT === "true";
};

/**
 * Check if dev badge should be shown
 */
export const shouldShowDevBadge = (): boolean => {
  return process.env.EXPO_PUBLIC_SHOW_DEV_BADGE === "true";
};

/**
 * Check if debug logging is enabled
 */
export const isDebugLoggingEnabled = (): boolean => {
  return process.env.EXPO_PUBLIC_ENABLE_DEBUG_LOGS === "true";
};

/**
 * Developer override to bypass daily puzzle lock
 * Returns true if the user should be allowed to play multiple times per day
 */
export const canBypassDailyLock = (): boolean => {
  return isDevModeEnabled() && isDailyLimitBypassEnabled();
};

/**
 * Get development environment info for debugging
 */
export function getDevEnvironmentInfo() {
  return {
    devMode: isDevModeEnabled(),
    bypassDailyLimit: process.env.EXPO_PUBLIC_BYPASS_DAILY_LIMIT === "true",
    debugLogging: process.env.EXPO_PUBLIC_ENABLE_DEBUG_LOGS === "true",
    showDevBadge: shouldShowDevBadge(),
    firestoreMode: getFirestoreMode(),
  };
}

/**
 * Get current Firestore connection mode
 */
export function getFirestoreMode(): "emulator" | "production" {
  // In development mode, we attempt to connect to emulator
  const isDevelopment = process.env.EXPO_PUBLIC_DEV_MODE === "true";
  return isDevelopment ? "emulator" : "production";
}
