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
- **Firestore**: Database operations, daily puzzles, admin functions
- **Independence**: Each system serves different purposes and must be deployed separately

## 🔄 Complete Word Addition Workflow

### 1. Add a New Word

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
- ✅ Updates version tracking
- ❌ Does NOT update Firestore (separate step)

### 2. Commit Your Changes

```bash
git add .
git commit -m "Add GRAZE to dictionary"
```

**What gets committed:**

- `data/words.json` - Source data update
- `public/dict/v*/` - New/updated CDN dictionary files
- `public/dict/current-version.json` - Version tracking

### 3. Deploy to Production

**Option A: Complete Deployment (Recommended)**

```bash
# Deploy to both CDN and Firestore
pnpm run words:deploy:all
```

**Option B: Step-by-Step Deployment**

```bash
# Step 1: Deploy to CDN (for user-facing app)
pnpm run words:deploy

# Step 2: Deploy to Firestore (for server operations)
pnpm run words:firestore
```

### 4. Verify Deployment

```bash
# Check both systems are synchronized
pnpm run words:verify [WORD]

# Example: pnpm run words:verify GRAZE
```

## 📋 Script Reference

### Word Management

- `pnpm run words:add` - Interactive word addition
- `pnpm run words:validate` - Validate word data structure

### Deployment

- `pnpm run words:deploy:all` - Deploy to both CDN and Firestore ⭐
- `pnpm run words:deploy` - Deploy to CDN only
- `pnpm run words:firestore` - Deploy to Firestore only

### Verification

- `pnpm run words:verify [WORD]` - Check word exists in both systems
- `pnpm run words:check-bundle` - Verify words aren't bundled (CDN working)

### Analysis

- `pnpm run analyze:bundle` - Bundle size analysis
- `pnpm run analyze:deps` - Dependency analysis

## 🚨 Common Issues

### "Word not showing up in live app"

**Symptoms:**

- Word exists in `data/words.json`
- CDN deployed successfully
- But word doesn't appear in live application

**Cause:** Only CDN was deployed, Firestore wasn't updated

**Solution:**

```bash
pnpm run words:firestore
# or
pnpm run words:deploy:all
```

### "Version mismatch errors"

**Symptoms:**

- App loading old word list
- Version conflicts in browser

**Solution:**

```bash
# Clear and rebuild everything
pnpm run words:deploy:all
```

### "Bundle size too large"

**Symptoms:**

- Web export > 3MB
- Words appear to be bundled

**Solution:**

```bash
# Verify CDN optimization is working
pnpm run words:check-bundle

# Should show: "Word data in bundle: ✅ None"
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
pnpm run words:firestore

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
