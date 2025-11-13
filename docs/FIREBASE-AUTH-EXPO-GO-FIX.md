# Firebase Auth Expo Go iOS Compatibility Fix

## Problem Statement

**Issue**: `Component auth has not been registered yet` error on Expo Go iOS with Hermes JavaScript engine

**Environment**:
- Firebase SDK: v11.8.1
- Expo SDK: v53.0.20
- Platform: iOS (Expo Go)
- JavaScript Engine: Hermes

### Root Cause

Firebase Auth v11+ requires the auth component to be properly registered before use. When `getAuth(app)` is called during global module initialization (at the top level of `firebaseConfig.ts`), the auth component may not be fully registered in Expo Go's Hermes environment on iOS, resulting in the error.

## Solution: Lazy Initialization

The fix implements a lazy initialization pattern that defers Firebase Auth setup until it's actually needed.

### Implementation

```typescript
// firebase/firebaseConfig.ts

// Lazy initialization for Firebase Auth
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

// Backward compatible proxy for existing code
export const auth = new Proxy({} as Auth, {
  get(_target, prop) {
    const instance = getAuthInstance();
    const value = instance[prop as keyof Auth];
    return typeof value === "function" ? value.bind(instance) : value;
  },
});
```

### How It Works

1. **Lazy Loading**: `getAuthInstance()` only initializes Firebase Auth on first call
2. **Singleton Pattern**: Once initialized, the same instance is reused
3. **Backward Compatibility**: The `auth` export uses a Proxy to maintain compatibility with existing code
4. **Debug Logging**: Logs when auth is initialized (when debug mode is enabled)

## Migration Guide

### For New Code (Recommended)

Use `getAuthInstance()` directly:

```typescript
import { getAuthInstance } from "@/firebase/firebaseConfig";

// In your component or hook
const auth = getAuthInstance();
const user = auth.currentUser;

// With auth state listener
onAuthStateChanged(getAuthInstance(), (user) => {
  // Handle auth state change
});
```

### For Existing Code (Backward Compatible)

The existing `auth` export continues to work via the Proxy pattern:

```typescript
import { auth } from "@/firebase/firebaseConfig";

// This still works - auth is initialized on first access
const user = auth.currentUser;
```

**Note**: While the Proxy approach maintains backward compatibility, it's recommended to migrate to `getAuthInstance()` for better clarity and performance.

## Benefits

### 1. Fixes Expo Go iOS Issue
- Auth component initializes when needed, not at module load time
- Prevents "Component auth has not been registered yet" error
- Compatible with Hermes JavaScript engine

### 2. Better Performance
- Auth only initializes if authentication features are used
- Reduces startup overhead for users who don't immediately need auth

### 3. Backward Compatible
- Existing code continues to work without changes
- Gradual migration path available

### 4. Future-Proof
- Follows Firebase v11+ best practices for React Native
- Aligns with lazy loading patterns used in modern React applications

## Testing

### Test on Expo Go iOS

1. Install Expo Go on iOS device
2. Scan QR code from `expo start`
3. Verify app loads without auth errors
4. Test authentication flow (Google Sign-In)
5. Verify auth state persists across app restarts

### Test on Web

1. Run `expo start --web`
2. Verify auth initialization in browser console
3. Test authentication flow
4. Verify no regressions in web behavior

### Test on Android

1. Install Expo Go on Android device
2. Scan QR code from `expo start`
3. Verify auth works correctly
4. Compare behavior with iOS

## Files Modified

### Core Implementation
- `firebase/firebaseConfig.ts` - Lazy auth initialization with Proxy for backward compatibility

### Updated Imports
- `context/UserContext.tsx` - Uses `getAuthInstance()`
- `hooks/useAuthListener.ts` - Uses `getAuthInstance()`
- `hooks/useGoogleSignIn.ts` - Uses `getAuthInstance()`
- `utils/game-completion.ts` - Uses `getAuthInstance()`
- `storage/puzzle-results.ts` - Uses `getAuthInstance()`

## Alternative Solutions Considered

### Option 1: Downgrade to Firebase v10
**Pros**: Avoids compatibility issues
**Cons**: Loses v11 features, security updates, and improvements

### Option 2: Use `initializeAuth` with React Native Persistence
**Issue**: `getReactNativePersistence` not available in Firebase v11.8.1 for Expo

### Option 3: Platform Detection
**Issue**: Doesn't solve core registration timing issue

### ✅ Chosen Solution: Lazy Initialization
**Why**: Best balance of compatibility, performance, and maintainability

## Troubleshooting

### Auth Still Not Working

1. **Clear Expo Cache**: `expo start --clear`
2. **Check Firebase Config**: Ensure `.env.local` has correct Firebase credentials
3. **Verify Imports**: Ensure using `getAuthInstance()` or `auth` from `@/firebase/firebaseConfig`

### Proxy Issues

If you encounter issues with the Proxy pattern:

```typescript
// Replace this:
import { auth } from "@/firebase/firebaseConfig";
const user = auth.currentUser;

// With this:
import { getAuthInstance } from "@/firebase/firebaseConfig";
const user = getAuthInstance().currentUser;
```

### Debug Mode

Enable debug logging to see auth initialization:

```bash
# Set in .env.local
EXPO_PUBLIC_ENABLE_DEBUG_LOGS=true
```

Look for: `🔧 Firebase Auth initialized (lazy)` in console

## References

- [Firebase Documentation](https://firebase.google.com/docs/auth/web/start)
- [Expo + Firebase Guide](https://docs.expo.dev/guides/using-firebase/)
- [React Native Firebase Best Practices](https://rnfirebase.io/)

## Support

If you encounter issues:
1. Check the console for error messages
2. Enable debug logging
3. Verify Firebase configuration
4. Test on multiple platforms
5. Create an issue with detailed environment info

---

**Status**: ✅ Implemented and Tested
**Date**: November 13, 2025
**Version**: Firebase v11.8.1, Expo SDK v53.0.20
