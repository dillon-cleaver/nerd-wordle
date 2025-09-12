# CDN-First Word Loading Architecture

## 🚀 Overview

This document explains the CDN-first word loading architecture implemented to optimize bundle size, improve performance, and enable instant word updates without app redeployment.

## 📊 Performance Gains

### Before (localStorage Heavy)

- **Bundle Size**: +243KB (words.json included)
- **localStorage Usage**: 243KB per user
- **App Startup**: Parse 243KB JSON on every load
- **Word Updates**: Required full app redeployment
- **Cache Strategy**: Manual localStorage management

### After (CDN-First)

- **Bundle Size**: -243KB (words.json excluded)
- **localStorage Usage**: ~100 bytes (metadata only)
- **App Startup**: Instant load from browser cache
- **Word Updates**: Instant via CDN auto-versioning
- **Cache Strategy**: Browser cache + HTTP headers

**Result: 99.96% reduction in localStorage usage, faster startup, instant updates**

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

- `constants/words.ts` - Build-time only (server functions)
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

1. **Content Detection**: SHA-256 hash detects changes
2. **Version Increment**: `v6` → `v7` automatically
3. **Client Update**: `storage/words.local.ts` updated to fetch `v7`
4. **CDN Deploy**: New version deployed to Firebase Hosting
5. **Cache Busting**: New URL ensures immediate updates

### User Experience

| User Type                            | Experience                       |
| ------------------------------------ | -------------------------------- |
| **New users**                        | Get latest version immediately   |
| **Existing users (current session)** | Continue with cached version     |
| **Existing users (next session)**    | Automatically get latest version |

## 🔧 File Structure

```
public/dict/
├── current-version.json          # Version tracking
├── v3/
│   ├── words.json               # Legacy version
│   └── metadata.json
├── v6/
│   ├── words.json               # Current production
│   └── metadata.json
└── v7/
    ├── words.json               # New version
    └── metadata.json

scripts/
├── auto-version-dictionary.js   # Auto-versioning logic
├── add-word.js                  # Interactive word addition
└── build-dictionary.js         # Manual dictionary build

storage/
└── words.local.ts               # CDN-first loading logic

context/
└── WordDataContext.tsx          # React context for word data
```

## 🎯 Cache Strategy

### HTTP Headers (Firebase Hosting)

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

**Aggressive caching works because:**

- URL changes when content changes (`v6` → `v7`)
- Old versions remain cached (no unnecessary downloads)
- New versions download fresh (immediate updates)

### localStorage Usage

```javascript
// Before: 243KB of word data
localStorage.setItem("words_v3", JSON.stringify(allWords));

// After: ~100 bytes of metadata
localStorage.setItem(
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

- **99.96% smaller localStorage footprint**
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

### Version Tracking

```bash
# Check current version
cat public/dict/current-version.json

# Check client version
grep "version: string =" storage/words.local.ts
```

### Testing Auto-Versioning

```bash
# Add test word
npm run words:add TESTS videoGames

# Check if version increments
node scripts/auto-version-dictionary.js
# Should show: v6 → v7

# Restore and check no-change behavior
git checkout data/words.json
node scripts/auto-version-dictionary.js
# Should show: No changes detected
```

### Debug Logging

```typescript
// Enable debug logging in dev mode
const isDebugLoggingEnabled = () => process.env.NODE_ENV === "development";

// Logs show:
// 🔄 Fetching words from CDN: https://nerd-word-cfda3.web.app/dict/v7/words.json
// ✅ Loaded 3813 words from CDN (browser cache)
```

This architecture provides the optimal balance of performance, reliability, and development velocity for managing the word dictionary.
