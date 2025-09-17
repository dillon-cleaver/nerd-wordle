# Word Management Quick Reference

## ⚡ TL;DR - Just Tell Me What To Do!

**For most users:** Use `pnpm run words:deploy:all` - it always works and never breaks anything.

**If you want to optimize:**

- Daily puzzles enabled? → Need Firestore (`words:deploy:all`)
- Just testing locally? → CDN only is fine (`words:deploy:cdn`)

## 🚀 Complete Workflow (Start Here!)

```bash
# 1. Add word interactively (updates local files only)
pnpm run words:add
   # → Prompts for word and category
   # → Updates data/words.json and rebuilds CDN files
   # → Does NOT deploy to production yet

# 2. Commit your changes (always commit after adding words)
git add . && git commit -m "Add [WORD] to dictionary"
   # → Commits source data + generated CDN files

# 3. Deploy to BOTH systems (this is the key step!)
pnpm run words:deploy:all
   # → Deploys to CDN (Firebase Hosting)
   # → Deploys to Firestore database (runs even if CDN fails)
   # → Both systems needed for full functionality
   # → Reports status of each deployment with recovery instructions

# 4. Verify everything worked
pnpm run words:verify [WORD]
   # → Checks both CDN and Firestore
   # → Should show ✅ for both systems
```

## ⚡ Shortcuts & Helpers

```bash
# Quick status check: word count + recent commits
pnpm run words:status

# Show all available commands with explanations
pnpm run words:help

# Check CDN optimization is working
pnpm run words:check-bundle
```

## 🤔 When Do I Need Each Deployment?

### ✅ CDN Only (`words:deploy:cdn`)

**Use when:**

- Testing new words locally without server features
- Updating word definitions, hints, or categories
- UI development and frontend changes
- You only need users to see/play with words

**What works:** Word gameplay, word display, client-side features
**What breaks:** Daily puzzles, admin APIs, server word lookups

### ✅ Firestore Only (`words:deploy:firestore`)

**Use when:**

- Setting up daily puzzles (server needs to know about words)
- Using admin word lookup APIs (`/word/:id` endpoint)
- CDN is already updated but server is behind
- Testing server-side features

**What works:** Daily puzzle generation, admin functions, server APIs
**What breaks:** Users can't see new words in gameplay

### ✅ Both Systems (`words:deploy:all`) ⭐ **RECOMMENDED**

**Use when:**

- Adding new words for production use
- You want everything to work everywhere
- When in doubt (safest option)
- Complete word management workflow

**What works:** Everything! Both user-facing and server-side features

### 🚫 When You Can Skip Deployment Entirely

- Just editing documentation
- Making changes to build scripts
- Updating package.json or other config files
- Word data hasn't actually changed

## 🌍 Real-World Scenarios

**"I added 5 new words and want them in production"**

```bash
pnpm run words:deploy:all  # Deploy to both systems
```

**"I'm testing new words locally, no server features needed"**

```bash
pnpm run words:deploy:cdn  # Users can play with them
```

**"Daily puzzles are broken but words show up fine"**

```bash
pnpm run words:deploy:firestore  # Fix server-side word access
```

**"I updated a word's definition/hints"**

```bash
pnpm run words:deploy:cdn  # Users see the updated info
# Firestore deployment not needed unless you use server word lookups
```

**"I'm not sure what I need"**

```bash
pnpm run words:deploy:all  # Always works, never breaks anything
```

## 📋 Script Quick Reference

### 🎯 Essential Commands (Use These!)

- `pnpm run words:add` - Add new word interactively (local only)
- `pnpm run words:deploy:all` - Deploy to both CDN and Firestore ⭐ **CRITICAL**
- `pnpm run words:verify [WORD]` - Verify word exists in both systems

### 🔧 Individual Deployment (Advanced)

- `pnpm run words:deploy:cdn` - CDN only (user-facing app)
  - Use when: Only updating word display/loading
  - Missing: Server operations won't see new words
- `pnpm run words:deploy:firestore` - Firestore only (server operations)
  - Use when: Only updating backend/admin functions
  - Missing: Users won't see new words in app

### 🔍 Validation & Analysis

- `pnpm run words:validate` - Validate word data structure and count
- `pnpm run words:check-bundle` - Verify CDN optimization is working
- `pnpm run analyze:bundle` - Full bundle size analysis
- `pnpm run words:status` - Quick overview: word count + recent changes

### 🆘 Getting Help

- `pnpm run words:help` - Show all commands with explanations

## 🧠 Understanding the Two Systems

**Why do we need both CDN AND Firestore?**

1. **CDN (Firebase Hosting)** = Fast word loading for users

   - 243KB word file cached in browser
   - Instant game startup
   - Primary source for gameplay

2. **Firestore (Database)** = Server operations
   - Daily puzzle generation
   - Admin functions
   - Word lookup APIs

**Missing either system = broken functionality!**

## 🚨 Critical Points

1. **Two Systems, Two Deployments**: CDN ≠ Firestore (they're completely separate!)
2. **ALWAYS use `words:deploy:all`**: Prevents the common "word not showing up" issue
3. **Commit before deploying**: Word addition creates multiple file changes
4. **Always verify with specific word**: `words:verify [WORD]` shows exactly what worked

## 🔧 Troubleshooting

**Word not in live app after `words:deploy:cdn`?**

```bash
# Problem: Only CDN was deployed, Firestore is missing
pnpm run words:deploy:firestore  # Fix: Deploy to Firestore too
# or better yet:
pnpm run words:deploy:all  # Fix: Do complete deployment
```

**Word verification shows mixed results?**

```bash
pnpm run words:verify [WORD]
# ✅ CDN: Found
# ❌ Firestore: Not found  ← This is the problem!

# Fix:
pnpm run words:deploy:firestore
```

**Bundle too large after adding words?**

```bash
pnpm run words:check-bundle   # Should show "None" for word data
# If it shows words in bundle, CDN deployment may have failed
```

## 💡 Pro Tips

- **Use the verification command** with the specific word you added
- **Don't skip the commit step** - it's needed for proper versioning
- **Check both systems** if anything seems wrong
- **CDN takes ~30 seconds to propagate globally** after deployment
- **Use `pnpm run words:help`** to see all available commands anytime
