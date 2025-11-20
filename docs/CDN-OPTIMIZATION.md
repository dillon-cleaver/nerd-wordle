# CDN-First Word Loading Architecture

## 🚀 Overview

This document explains the CDN-first word loading architecture implemented to optimize bundle size, improve performance, and enable instant word updates without app redeployment.

**Key Innovation**: Instead of storing 243KB of word data in AsyncStorage, we leverage the browser's built-in HTTP cache and serve words from Firebase Hosting CDN at `https://nerd-word-cfda3.web.app/dict/`.

## 🌐 Understanding Browser HTTP Cache vs AsyncStorage

### What is HTTP Cache?

The **HTTP cache** (browser cache) is a built-in browser feature that automatically stores responses from web requests (images, CSS, JavaScript, JSON files). It's completely separate from AsyncStorage and much more powerful.

**Think of it like:**

- **AsyncStorage**: A small 5-10MB storage box you manually manage with JavaScript
- **HTTP cache**: A massive 50-100MB+ automatic warehouse the browser manages for you

### How It Works in This App

```
┌─────────────────────────────────────────────────┐
│ App Starts → fetch(...dict/v7/words.json)      │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│ Browser checks HTTP cache:                      │
│ "Do I already have dict/v7/words.json?"         │
└─────────────────────────────────────────────────┘
        ↓ YES                           ↓ NO
┌──────────────────┐          ┌─────────────────────┐
│ Return from      │          │ Download from CDN   │
│ HTTP cache       │          │ (243KB)             │
│ (INSTANT!)       │          └─────────────────────┘
└──────────────────┘                    ↓
                              ┌─────────────────────┐
                              │ Store in HTTP cache │
                              │ (automatic)         │
                              └─────────────────────┘
                                        ↓
                              ┌─────────────────────┐
                              │ Save metadata only  │
                              │ to AsyncStorage     │
                              │ (~100 bytes)        │
                              └─────────────────────┘
```

### AsyncStorage vs HTTP Cache

| Feature              | AsyncStorage                    | HTTP Cache                      |
| -------------------- | ------------------------------- | ------------------------------- |
| **Size Limit**       | ~5-10MB total                   | ~50-100MB+ per domain           |
| **Management**       | Manual (you write code)         | Automatic (browser handles it)  |
| **Speed**            | Fast, but requires JSON.parse() | Instant (pre-parsed by browser) |
| **Network-aware**    | No (offline only)               | Yes (respects cache headers)    |
| **Storage Location** | Same as app data                | Separate cache storage          |

### The Two-Storage System

1. **HTTP Cache** (Heavy lifting): Stores the full 243KB word dictionary
2. **AsyncStorage** (Metadata only): Stores ~100 bytes of tracking info

```typescript
// HTTP Cache (automatic by browser)
fetch("https://nerd-word-cfda3.web.app/dict/v7/words.json", {
  cache: "force-cache", // Browser caches automatically
});

// AsyncStorage (manual, just metadata)
AsyncStorage.setItem(
  "words_metadata_v3",
  JSON.stringify({
    version: "v7",
    totalWords: 3813,
    lastUpdated: "2025-10-10...",
  })
); // Only ~100 bytes!
```

## 📊 Performance Gains

### Before (AsyncStorage Heavy)

- **Bundle Size**: +243KB (words.json included)
- **AsyncStorage Usage**: 243KB per user
- **App Startup**: Parse 243KB JSON on every load
- **Word Updates**: Required full app redeployment
- **Cache Strategy**: Manual AsyncStorage management

### After (CDN-First)

- **Bundle Size**: -243KB (words.json excluded)
- **AsyncStorage Usage**: ~100 bytes (metadata only)
- **App Startup**: Instant load from browser cache
- **Word Updates**: Instant via CDN auto-versioning
- **Cache Strategy**: Browser cache + HTTP headers

**Result: 99.96% reduction in AsyncStorage usage, faster startup, instant updates**

## 🏗️ Architecture Components

### 1. Auto-Versioning System

```javascript
// Auto-detects content changes via SHA-256 hash
npm run words:deploy
// 🚀 Content changed! Upgrading v6 → v7
// ✅ Updated client to use v7
// ✅ New words deployed to CDN with auto-versioning!
```

**Files:**

- `scripts/auto-version-dictionary.js` - Auto-versioning script
- `public/dict/v{N}/words.json` - Versioned word files
- `public/dict/current-version.json` - Version tracking

### 2. CDN-First Loading

```typescript
// storage/words.local.ts
export async function fetchWordsFromCDN(version: string = "v6") {
  const url = `https://nerd-word-cfda3.web.app/dict/${version}/words.json`;

  const response = await fetch(url, {
    cache: "force-cache", // Aggressive browser cache
  });

  // Save only metadata (not full word data)
  saveWordsMetadata({
    version,
    lastUpdated: new Date().toISOString(),
    totalWords: words.length,
  });
}
```

**Benefits:**

- Browser cache handles 243KB efficiently
- HTTP cache headers work as designed
- No JSON parsing on app startup
- Reliable offline support

### 3. Bundle Exclusion

```javascript
// metro.config.js
config.resolver.blockList = [/constants\/words\.json$/];
```

**Result:**

- `functions/src/data/words.ts` - Build-time only (server functions)
- Client runtime never imports bundled words
- 243KB eliminated from app bundle

### 4. Context Optimization

```typescript
// context/WordDataContext.tsx
useEffect(() => {
  const loadWordsData = async () => {
    // Browser cache handles the heavy lifting
    const wordsData = await loadWords();
    setWords(wordsData);
  };
  loadWordsData();
}, []);
```

**Benefits:**

- Single data source (CDN)
- No double downloads
- Consistent loading pattern

## 📦 Deployment Workflow

### Adding New Words

```bash
# 1. Add word interactively
npm run words:add
# Enter: ROBOT, videoGames

# 2. Deploy to CDN (auto-versioning)
npm run words:deploy
```

**What happens:**

1. **Content Detection**: SHA-256 hash detects changes in `data/words.json`
2. **Version Increment**: `v6` → `v7` automatically
3. **Build Dictionary**: Creates `public/dict/v7/words.json`
4. **Update Version File**: Updates `public/dict/current-version.json` to `v7`
5. **CDN Deploy**: Deploys to Firebase Hosting CDN
6. **Cache Busting**: New URL (`/dict/v7/`) ensures users get fresh data

### Complete Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│ Developer adds word → data/words.json                       │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ npm run words:deploy                                        │
│ → Auto-version detects change (SHA-256 hash)                │
│ → Increments version: v7 → v8                               │
│ → Builds public/dict/v8/words.json                          │
│ → Updates public/dict/current-version.json                  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Firebase Hosting CDN                                        │
│ https://nerd-word-cfda3.web.app/dict/v8/words.json         │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ User opens app → loadWords()                                │
│ 1. Fetch current-version.json → "v8"                        │
│ 2. Fetch dict/v8/words.json (browser caches it)             │
│ 3. Save metadata to AsyncStorage (~100 bytes)               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ User closes and reopens app                                 │
│ → Browser returns cached v8 instantly (from HTTP cache)     │
│ → No re-download needed!                                    │
└─────────────────────────────────────────────────────────────┘
```

### User Experience

| User Type                            | Experience                       |
| ------------------------------------ | -------------------------------- |
| **New users**                        | Get latest version immediately   |
| **Existing users (current session)** | Continue with cached version     |
| **Existing users (next session)**    | Automatically get latest version |

## 🔧 File Structure

**Key files for CDN word loading:**

```
data/
└── words.json                   # Single source of truth (3,813 words)

public/dict/                     # Deployed to Firebase Hosting CDN
├── current-version.json          # Version tracking: {"version": "v7"}
└── v7/
    └── words.json               # Current production (243KB)

storage/
└── words.local.ts               # CDN-first loading logic

scripts/
├── auto-version-dictionary.js   # Auto-versioning logic
├── add-word.js                  # Interactive word addition
└── deploy-words.js              # Deploy to Firebase Hosting
```

**CDN URL**: `https://nerd-word-cfda3.web.app/dict/v7/words.json`

## 🎯 Cache Strategy

### HTTP Headers (Firebase Hosting)

Firebase Hosting serves the word dictionary with aggressive caching headers:

```json
{
  "source": "/dict/**",
  "headers": [
    {
      "key": "Cache-Control",
      "value": "public, max-age=31536000, immutable"
    }
  ]
}
```

**What these headers mean:**

- `public`: Can be cached by anyone (browser, CDN, proxies)
- `max-age=31536000`: Keep cached for 1 year (31,536,000 seconds)
- `immutable`: Content will NEVER change at this URL

**Why aggressive caching is safe:**

- URL changes when content changes (`v6` → `v7`)
- Old versions remain cached (no unnecessary re-downloads)
- New versions have new URLs (immediate fresh download)
- Cache busting is automatic via URL versioning

### AsyncStorage Usage

```javascript
// Before: 243KB of word data
AsyncStorage.setItem("words_v3", JSON.stringify(allWords));

// After: ~100 bytes of metadata
AsyncStorage.setItem(
  "words_metadata_v3",
  JSON.stringify({
    version: "v7",
    lastUpdated: "2025-09-12T13:33:49.001Z",
    totalWords: 3813,
  })
);
```

## 🚀 Benefits Summary

### Performance

- **99.96% smaller AsyncStorage footprint**
- **Faster app startup** (no 243KB JSON parsing)
- **Better mobile performance** (lower memory usage)
- **Proper HTTP caching** (browser cache optimization)

### Development Experience

- **Instant word updates** (no app redeployment)
- **Automated versioning** (content-based detection)
- **Decoupled deployments** (words vs. app features)
- **Reliable cache busting** (URL-based versioning)

### User Experience

- **Faster loading** (optimized caching)
- **Immediate updates** (next session gets new words)
- **Offline support** (browser cache reliability)
- **No app store updates** (for word additions)

## 🔍 Monitoring & Debugging

### Quick Checks

```bash
# Check current version
cat public/dict/current-version.json

# Test auto-versioning (dry run)
node scripts/auto-version-dictionary.js
```

### Debug in Browser

**Chrome DevTools** → Network tab → Reload page:

- Look for `words.json` request
- Status will show `(from disk cache)` or `(from memory cache)` if cached
- `200` status means fresh download

### Enable Debug Logging

Set `EXPO_PUBLIC_ENABLE_DEBUG_LOGS=true` in `.env.local` to see:

```
🔄 Fetching words from CDN: https://nerd-word-cfda3.web.app/dict/v7/words.json
✅ Loaded 3813 words from CDN (browser cache)
```

---

This architecture provides the optimal balance of performance, reliability, and development velocity for managing the word dictionary.
