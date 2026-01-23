# NerdWord - Claude Instructions

> **Primary Reference**: See [.github/copilot-instructions.md](.github/copilot-instructions.md) for comprehensive documentation.

## Quick Reference

| Item            | Value                                      |
| --------------- | ------------------------------------------ |
| Package Manager | `pnpm` (NOT npm/yarn)                      |
| Node Version    | 20+                                        |
| Stack           | React Native/Expo 53, Firebase, TypeScript |
| Entry Point     | `app/_layout.tsx`                          |

## Essential Commands

```bash
# Setup (run once)
pnpm install                          # 75 seconds - NEVER CANCEL
cd functions && pnpm install && cd .. # 14 seconds - NEVER CANCEL

# Validate (run before/after changes)
pnpm run lint && pnpm run typecheck   # 10 seconds total

# Build
npx expo export --platform web        # 80 seconds - NEVER CANCEL

# Word management
pnpm run words:validate               # Check word count
pnpm run words:deploy:all             # Deploy to CDN + Firestore
```

## Critical Rules

### ❌ NEVER Do These

1. **Cancel long-running commands** - Builds take 80s, installs take 75s, this is normal
2. **Edit `.env.local` directly** - Use `pnpm run env:development|testing|production`
3. **Edit `public/dict/v*/` directly** - Generated files; edit `data/words.json` instead
4. **Edit `functions/lib/`** - Compiled output; edit `functions/src/` instead
5. **Store word data in AsyncStorage** - CDN handles caching, metadata only in storage
6. **Change Context Provider order** - Must be: User → PuzzleHistory → Suspense → WordData → Game → GameReadyGate

### ✅ ALWAYS Do These

1. **Run validation before committing**: `pnpm run lint && pnpm run typecheck`
2. **Deploy words to BOTH systems**: `pnpm run words:deploy:all` (CDN + Firestore)
3. **Set timeouts 2x the expected time** for builds and installs
4. **Check `pnpm run words:validate`** after word changes

## Architecture Summary

```
CDN (Firebase Hosting)          Firebase Backend
├── Word dictionary (~3800+)    ├── User auth
├── Browser HTTP cache          ├── Puzzle history
└── Instant updates             └── Daily puzzles
```

**Context Provider Hierarchy** (in `app/_layout.tsx`):

```
UserProvider → PuzzleHistoryProvider → Suspense → WordDataProvider → GameProvider → GameReadyGate
```

## Validation Checklist

Before completing any task, run:

```bash
# Frontend
pnpm run lint && pnpm run typecheck

# Backend (if changed)
cd functions && pnpm run build && npx eslint src/ && cd ..

# Words (if changed)
pnpm run words:validate
```

## Command Timing Reference

| Command                          | Time | Timeout |
| -------------------------------- | ---- | ------- |
| `pnpm install`                   | 75s  | 120s+   |
| `cd functions && pnpm install`   | 14s  | 60s+    |
| `npx expo export --platform web` | 80s  | 180s+   |
| `pnpm run lint && typecheck`     | 10s  | 30s+    |
| `cd functions && pnpm run build` | 5s   | 30s+    |

## File Locations

| Purpose                     | Location          |
| --------------------------- | ----------------- |
| Word data (source of truth) | `data/words.json` |
| App screens                 | `app/`            |
| Components                  | `components/`     |
| Backend API                 | `functions/src/`  |
| Documentation               | `docs/`           |
