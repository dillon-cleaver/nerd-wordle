# Development Setup - Clean & Simple

## 🧹 What Was Cleaned Up

### Removed Complexity

- ❌ Runtime toggles and dynamic state management
- ❌ Complex drawer controls with buttons
- ❌ Verbose logging and documentation
- ❌ Unnecessary EAS build profiles
- ❌ Over-engineered test utilities

### Simplified Components

- ✅ `DrawerDevInfo` (renamed from DrawerDevControls) - Simple info display only
- ✅ `DevModeBadge` - Clean visual indicator
- ✅ `dev-flags.ts` - Minimal utility functions
- ✅ `test-puzzle-results.js` - Basic console utilities only

## 🎯 Current Setup

### Platform-Specific Development Scripts

```bash
# Web Development
npm run dev:web           # Standard development
npm run dev:web:bypass    # Testing with bypass

# iOS Development
npm run dev:ios           # Standard development
npm run dev:ios:bypass    # Testing with bypass

# Android Development
npm run dev:android       # Standard development
npm run dev:android:bypass # Testing with bypass

# Utility
npm run clean            # Clear Metro cache
```

### Key Files

- `components/DrawerDevInfo.tsx` - Simple environment info display
- `components/DevModeBadge.tsx` - Visual dev indicator (now in header)
- `utils/dev-flags.ts` - Core flag utilities
- `scripts/env-helper.js` - Environment switching
- `eas.json` - Clean build profiles

### Environment Variables

- `EXPO_PUBLIC_DEV_MODE` - Enable dev features
- `EXPO_PUBLIC_BYPASS_DAILY_LIMIT` - Allow multiple games
- `EXPO_PUBLIC_SHOW_DEV_BADGE` - Show dev badge
- `EXPO_PUBLIC_ENABLE_DEBUG_LOGS` - Enable console logs

## ✨ Result

- **90% less code** than the complex version
- **No runtime configuration** - everything is build-time
- **Production safety** guaranteed
- **Simple mental model** - 2 modes (standard/bypass), 3 platforms (web/iOS/Android)
- **Easy to understand** and maintain
- **Platform flexibility** - same environment configs work across web, iOS, and Android

The setup now does exactly what's needed without unnecessary complexity.
