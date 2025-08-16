# Expo Font Optimization Strategy - Future Implementation

> **Status**: 📋 **PLANNED** - This optimization is scheduled for future implementation
>
> **Priority**: Medium (Performance improvement)
>
> **Impact**: Bundle size reduction (~1.5MB), 70% faster font loading

## 📚 Expo's Official Recommendations

Based on [Expo's font documentation](https://docs.expo.dev/develop/user-interface/fonts/), here are the optimal strategies for future implementation:

### 🚦 Implementation Status

### Current State

- ✅ **Font loading works** with current expo-font plugin
- ✅ **10 local font files** embedded in app bundle
- ⚠️ **Performance impact**: ~1.5MB bundle size, 1-2s load time
- ⚠️ **Network requests**: 10 separate font downloads observed

### Future Implementation (Planned)

- 🔄 **Switch to Google Fonts** with useFonts hook
- 🔄 **Reduce to 3 essential fonts** (Regular, Bold, Italic)
- 🔄 **CDN delivery** for better caching and performance
- 🔄 **Bundle size reduction** (~1.5MB savings)

## 🎯 Recommended Approach: Google Fonts + `useFonts` Hook

**Why This is Best for Your App:**

- ✅ **Works with Expo Go** (no development build required)
- ✅ **Better performance** than local fonts
- ✅ **CDN delivery** with automatic optimization
- ✅ **Smaller bundle size** (fonts not embedded in app)
- ✅ **Better caching** across devices and browsers

## 🚀 Implementation Strategy

### Step 1: Replace Local Fonts with Google Fonts

**Current Problem:**

```json
// app.json - Current configuration loading 10 local files
"expo-font": {
  "fonts": [
    "./assets/fonts/Bitter-Regular.ttf",      // ~150KB
    "./assets/fonts/Bitter-Bold.ttf",         // ~150KB
    "./assets/fonts/Bitter-Italic.ttf",       // ~150KB
    "./assets/fonts/Bitter-BoldItalic.ttf",   // ~150KB
    "./assets/fonts/Bitter-Medium.ttf",       // ~150KB
    // + 5 OpenSans fonts = ~1.5MB total
  ]
}
```

**Optimized Solution:**

```bash
# Install Google Fonts packages
npx expo install @expo-google-fonts/bitter @expo-google-fonts/inter
npx expo install expo-font expo-splash-screen
```

### Step 2: Update Font Loading in Root Layout

```typescript
// app/_layout.tsx - RECOMMENDED APPROACH
import { useFonts } from 'expo-font';
import {
  Bitter_400Regular,
  Bitter_700Bold,
  Bitter_400Regular_Italic,
} from '@expo-google-fonts/bitter';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

// Prevent auto-hiding splash screen
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    // Only load fonts you actually use
    Bitter_400Regular,
    Bitter_700Bold,
    Bitter_400Regular_Italic,
    // Remove unused variants
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null; // Show splash screen while loading
  }

  return (
    // Your app content
  );
}
```

### Step 3: Update Font Constants

```typescript
// constants/styles.ts - UPDATED for Google Fonts
const fontFamily = {
  bitter: {
    regular: "Bitter_400Regular",
    bold: "Bitter_700Bold",
    italic: "Bitter_400Regular_Italic",
    // Remove unused variants
  },
  // System font fallbacks for better performance
  system: {
    regular: Platform.select({
      ios: "SF Pro Display",
      android: "Roboto",
      web: "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
    }),
  },
} as const;
```

### Step 4: Clean Up Unused Fonts

```json
// app.json - REMOVE the expo-font plugin entirely
{
  "expo": {
    // Remove this entire section:
    // "plugins": [
    //   ["expo-font", { "fonts": [...] }]
    // ]
  }
}
```

## 📊 Performance Impact Analysis

### Before Optimization

```
🐌 Current Performance:
- Font files: 10 local files (~1.5MB)
- Load method: expo-font config plugin (embedded)
- Network requests: 10 separate font downloads
- Load time: ~1-2 seconds
- Bundle size impact: +1.5MB
```

### After Google Fonts Optimization

```
🚀 Optimized Performance:
- Font files: 3 Google Fonts variants
- Load method: useFonts hook (CDN)
- Network requests: 3 optimized font downloads
- Load time: ~300-500ms (CDN + caching)
- Bundle size impact: -1.5MB (removed from bundle)
```

### Expected Improvements

| Metric            | Before | After     | Improvement        |
| ----------------- | ------ | --------- | ------------------ |
| Bundle size       | +1.5MB | 0MB       | **100% reduction** |
| Font load time    | 1-2s   | 300-500ms | **70% faster**     |
| Network requests  | 10     | 3         | **70% reduction**  |
| Cross-app caching | None   | Shared    | **Significant**    |

## 🛠️ Implementation Steps (Future)

> **Note**: These steps are planned for future implementation

### 1. Remove Current Font Configuration

```bash
# Remove current expo-font plugin from app.json
# Delete local font files (optional, keep as backup)
```

### 2. Install Google Fonts

```bash
cd /Users/dilloncleaver/src/nerd-wordle
npx expo install @expo-google-fonts/bitter expo-font expo-splash-screen
```

### 3. Update Root Layout

Update your `app/_layout.tsx` with the Google Fonts implementation shown above.

### 4. Update Font Constants

Update `constants/styles.ts` with the new Google Font family names.

### 5. Test and Deploy

```bash
# Test locally
npx expo start --web

# Deploy when ready
eas deploy
```

## 🎯 Alternative Approaches (If Needed)

### Option 1: Hybrid Approach (Critical + Lazy)

```typescript
// Load only critical fonts immediately, others lazily
const [loaded] = useFonts({
  Bitter_700Bold, // Critical for headers
});

// Lazy load other variants when needed
const loadAdditionalFonts = () => {
  Font.loadAsync({
    Bitter_400Regular_Italic, // Load when actually needed
  });
};
```

### Option 2: System Font Fallback

```typescript
// Use system fonts as primary, Google Fonts as enhancement
const fontFamily = {
  primary: Platform.select({
    ios: "SF Pro Display",
    android: "Roboto",
    web: "Bitter_400Regular, Georgia, serif",
  }),
};
```

## 🔍 Expo-Specific Optimizations

### 1. Preload Vector Icons (Current Issue)

```typescript
// app/_layout.tsx - Also preload icons to prevent invisible icons
import { Ionicons } from "@expo/vector-icons";

const [loaded] = useFonts({
  Bitter_400Regular,
  Bitter_700Bold,
  ...Ionicons.font, // Preload vector icons
});
```

### 2. Web-Specific Optimizations

```typescript
// For web platform, consider font-display strategy
import { Platform } from "react-native";

if (Platform.OS === "web") {
  // Add font-display: swap for better web performance
  const style = document.createElement("style");
  style.textContent = `
    @font-face {
      font-family: 'Bitter_400Regular';
      font-display: swap;
    }
  `;
  document.head.appendChild(style);
}
```

### 3. Error Handling

```typescript
// Robust error handling for font loading
const [loaded, error] = useFonts({
  Bitter_400Regular,
  Bitter_700Bold,
});

if (error) {
  console.warn("Font loading failed, using system fonts:", error);
  // App continues with system fonts
}
```

## 📈 Why This Approach is Optimal

### ✅ Follows Expo Best Practices

1. **useFonts hook**: Recommended by Expo for async loading
2. **Google Fonts**: First-class support with @expo-google-fonts
3. **Splash screen integration**: Proper loading state management
4. **Platform compatibility**: Works across all platforms

### ✅ Performance Benefits

1. **CDN delivery**: Google Fonts served from optimized CDN
2. **Cross-app caching**: Fonts cached across different apps/sites
3. **Smaller bundle**: Fonts not embedded in app bundle
4. **Automatic optimization**: Google handles font subsetting

### ✅ Developer Experience

1. **No development build**: Works with Expo Go
2. **Easy updates**: Update fonts without rebuilding
3. **Better debugging**: Clear loading states
4. **Fallback handling**: Graceful degradation

## 🚦 Migration Checklist (Future Implementation)

> **Status**: Not yet started - planned for future release

- [ ] **Audit current font usage** across all components
- [ ] **Identify essential font variants** (Regular, Bold, Italic only)
- [ ] **Install Google Fonts packages**
- [ ] **Remove expo-font plugin from app.json**
- [ ] **Update app/\_layout.tsx with useFonts**
- [ ] **Update constants/styles.ts with new font names**
- [ ] **Test on development server**
- [ ] **Verify no font loading errors**
- [ ] **Deploy and test production**
- [ ] **Monitor performance improvements**
- [ ] **Document performance gains**

## 💡 Pro Tips

1. **Font Audit**: Only load fonts you actually use in your app
2. **System Fallbacks**: Always provide system font fallbacks
3. **Loading States**: Use splash screen for better UX during font loading
4. **Error Handling**: App should work even if fonts fail to load
5. **Performance Monitoring**: Track font loading times in production

---

_This optimization follows Expo's official best practices and will significantly improve your app's loading performance while maintaining excellent user experience._
