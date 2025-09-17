# Word Management Guide

This guide explains how to add, deploy, and verify words in the NerdWord application. Understanding the difference between CDN and Firestore deployment is crucial.

## 🏗️ Architecture Overview

NerdWord uses a **dual-source architecture** for word data:

```
data/words.json (Source of Truth)
    ↓
├── CDN (Primary) ──────── Browser loads words for gameplay
│   └── https://nerd-word-cfda3.web.app/dict/v7/
│
└── Firestore (Fallback) ── Server-side operations & admin functions
    └── Cloud Firestore: words collection
```

### Why Both Systems?

- **CDN**: Fast, cached word loading for users (243KB, browser cached)
- **Firestore**: Database operations, daily puzzles, admin APIs
- **Independence**: Each system serves different purposes and must be deployed separately

## 🔄 Complete Word Addition Workflow

### 1. Add a New Word (Local Changes Only)

```bash
# Interactive word addition (recommended)
pnpm run words:add

# Follow prompts:
# - Enter word: GRAZE
# - Select category: common
# - Confirm addition
```

**What this does:**

- ✅ Updates `data/words.json` (source of truth)
- ✅ Rebuilds CDN dictionary files with auto-versioning
- ✅ Updates version tracking in `public/dict/current-version.json`
- ❌ **Does NOT deploy anywhere** - files are local only!

### 2. Commit Your Changes (Essential Step)

```bash
git add .
git commit -m "Add GRAZE to dictionary"
```

**What gets committed:**

- `data/words.json` - Source data update
- `public/dict/v*/words.json` - New/updated CDN dictionary file
- `public/dict/v*/metadata.json` - Dictionary metadata
- `public/dict/current-version.json` - Version tracking

**Why commit before deploying?**

- Ensures version consistency across systems
- Creates backup of all changes
- Required for proper CDN versioning

### 3. Deploy to Production (The Critical Step)

**Option A: Complete Deployment (Strongly Recommended)**

```bash
# Deploy to BOTH CDN and Firestore in sequence
pnpm run words:deploy:all
```

This runs:

1. `words:deploy:cdn` - CDN deployment first
2. `words:deploy:firestore` - Firestore deployment second

**Option B: Manual Step-by-Step (If You Need Control)**

```bash
# Step 1: Deploy to CDN (for user-facing app)
pnpm run words:deploy:cdn
   # ✅ Users can now see/play with new words
   # ❌ Server operations still don't know about them

# Step 2: Deploy to Firestore (for server operations)
pnpm run words:deploy:firestore
   # ✅ Now server can generate daily puzzles with new words
   # ✅ Admin APIs can look up new words
```

### 4. Verify Deployment (Always Do This)

```bash
# Check both systems are synchronized
pnpm run words:verify [WORD]

# Example output for successful deployment:
# 🔍 Verifying word: GRAZE
# ✅ Found in CDN (v9)
# ✅ Found in Firestore
# 🎉 Word is properly deployed to both systems!
```

## 📋 Script Reference

### Word Management

- `pnpm run words:add` - Interactive word addition
- `pnpm run words:validate` - Validate word data structure

### Deployment

- `pnpm run words:deploy:all` - Deploy to both CDN and Firestore ⭐
- `pnpm run words:deploy:cdn` - Deploy to CDN only
- `pnpm run words:deploy:firestore` - Deploy to Firestore only

### Verification

- `pnpm run words:verify [WORD]` - Check word exists in both systems
- `pnpm run words:check-bundle` - Verify words aren't bundled (CDN working)

### Analysis

- `pnpm run analyze:bundle` - Bundle size analysis
- `pnpm run analyze:deps` - Dependency analysis

## 🚨 Common Issues & Solutions

### "Word not showing up in live app"

**Symptoms:**

- Word exists in `data/words.json` ✅
- `pnpm run words:deploy:cdn` completed successfully ✅
- But word doesn't appear in live application ❌

**Root Cause:** Only CDN was deployed, Firestore database wasn't updated

**Solution:**

```bash
# Quick fix - deploy to Firestore
pnpm run words:deploy:firestore

# Better approach - always use complete deployment
pnpm run words:deploy:all

# Verify it worked
pnpm run words:verify [YOUR_WORD]
```

**Prevention:** Always use `words:deploy:all` instead of just `words:deploy:cdn`

**Quick Decision:** Are users playing daily puzzles? If yes → need Firestore deployment

### "Partial deployment detected"

**Symptoms from `words:verify`:**

```
✅ CDN: Found
❌ Firestore: Not found
```

**Root Cause:** Incomplete deployment process

**Solution:**

```bash
# Complete the missing deployment
pnpm run words:deploy:firestore

# Verify both systems now work
pnpm run words:verify [YOUR_WORD]
# Should show ✅ for both CDN and Firestore
```

### "Version mismatch errors"

**Symptoms:**

- App loading old word list
- Browser shows cached old version
- Version conflicts in developer tools

**Solution:**

```bash
# Force complete redeployment
pnpm run words:deploy:all

# Clear browser cache or wait ~30 seconds for CDN propagation
```

### "Bundle size too large"

**Symptoms:**

- Web export > 3MB (should be ~2.6MB)
- Words appear to be bundled instead of loading from CDN

**Diagnosis:**

```bash
# Check if CDN optimization is working
pnpm run words:check-bundle
# Should show: "Word data in bundle: ✅ None"
```

**Solution:**

```bash
# If words are in bundle, redeploy to CDN
pnpm run words:deploy:cdn

# Verify optimization
pnpm run words:check-bundle
```

## 🛠️ Advanced Usage

### Development Environment

```bash
# Set development mode (uses emulators)
pnpm run env:development

# Deploy to emulator only
FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 pnpm run words:firestore
```

### Production Environment

```bash
# Set production mode
pnpm run env:production

# Deploy to production Firestore
pnpm run words:deploy:firestore

# Reset to development mode
pnpm run env:development
```

### Bulk Operations

```bash
# Add multiple words (requires script modification)
node scripts/add-word.js WORD1 WORD2 WORD3

# Validate and deploy all at once
pnpm run words:validate && pnpm run words:deploy:all
```

## 📊 Monitoring

### Check Current Status

```bash
# CDN version and word count
curl -s "https://nerd-word-cfda3.web.app/dict/current-version.json" | jq

# Local word count
jq 'length' data/words.json

# Bundle optimization status
pnpm run words:check-bundle
```

### Debug Logging

Enable debug logging in development:

```bash
pnpm run env:development
# Logs will show CDN fetching: "🔄 Fetching words from CDN: ..."
```

## 🔄 Complete Example Workflow

```bash
# 1. Add word
pnpm run words:add
# Enter: GRAZE, category: common

# 2. Commit changes
git add . && git commit -m "Add GRAZE to dictionary"

# 3. Deploy everywhere
pnpm run words:deploy:all

# 4. Verify it worked
pnpm run words:verify GRAZE
# Should show: ✅ CDN: Found, ✅ Firestore: Found

# 5. Check bundle optimization
pnpm run words:check-bundle
# Should show: ✅ None (words loaded from CDN)
```

This workflow ensures your word appears in both the user-facing application (via CDN) and server-side operations (via Firestore).

## 🎯 Deployment Decision Guide

Understanding when to deploy to which system saves time and prevents confusion:

### Daily Puzzle Users?

- **Yes** → Need `words:deploy:all` (server fetches puzzles from Firestore)
- **No** → `words:deploy:cdn` sufficient for gameplay

### Using Admin APIs?

- **Yes** → Need `words:deploy:firestore` (server word lookups)
- **No** → CDN deployment handles user-facing features

### Production vs Testing?

- **Production** → Always use `words:deploy:all` (safest)
- **Local testing** → `words:deploy:cdn` usually enough

### When in doubt?

- Use `words:deploy:all` → Never breaks anything, always works
