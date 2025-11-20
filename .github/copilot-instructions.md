# NerdWord Development Instructions

**ALWAYS follow these instructions first and only fallback to additional search and context gathering if the information here is incomplete or found to be in error.**

## Architecture Overview

NerdWord is a React Native/Expo word game with dual data systems:

- **CDN-First Word Loading**: Words loaded from Firebase Hosting CDN (browser cache) with metadata-only AsyncStorage
- **Firebase Backend**: User auth, puzzle history, admin functions via Cloud Functions
- **Context-Heavy State**: React Context providers manage game state, user data, word data, and puzzle history
- **Expo Router**: File-based routing in `app/` directory with drawer navigation wrapper

Key architectural decisions:

- Word dictionary (3812 words, 243KB) externalized from bundle to CDN for instant updates
- Browser HTTP cache handles word caching, AsyncStorage stores only metadata (99.96% storage reduction)
- Letter tracking system for detailed game analytics stored in Firestore
- Environment-aware builds with dev/testing/production modes

## Critical Code Patterns

### Context Provider Hierarchy (Required Order)

```tsx
// app/_layout.tsx - MUST maintain this exact nesting order
<UserProvider>
  {" "}
  // Firebase auth state
  <PuzzleHistoryProvider>
    {" "}
    // User's game history
    <WordDataProvider>
      {" "}
      // CDN word loading
      <GameProvider>
        {" "}
        // Current game state
        <DrawerNavigationWrapper />
      </GameProvider>
    </WordDataProvider>
  </PuzzleHistoryProvider>
</UserProvider>
```

### Word Data Loading Pattern

- **Never** store full word data in AsyncStorage - use `storage/words.local.ts` pattern
- Browser cache handles heavy lifting via HTTP headers
- Only metadata (version, count, timestamp) stored in AsyncStorage
- Always fetch from versioned CDN: `public/dict/v*/words.json`

### Environment Configuration

- Use `scripts/env-helper.js` presets, never manually edit `.env.local`
- Three modes: `development` (local), `testing` (bypass limits), `production` (live)
- Dev flags in `utils/dev-flags.ts` control logging and cache behavior

### Firebase Functions Structure

- All API routes in `functions/src/index.ts` with Express + CORS
- Auth middleware `verifyToken` required for user-specific routes
- Firestore collections: `users/{uid}/puzzleHistory`, `words`, `dailyPuzzles`
- Letter tracking data included in all puzzle result requests

## Working Effectively

Bootstrap, build, and validate the repository:

```bash
# 1. Install package manager (if not available)
npm install -g pnpm

# 2. Install dependencies - takes 75 seconds. NEVER CANCEL. Set timeout to 120+ seconds.
pnpm install

# 3. Install backend dependencies - takes 14 seconds. NEVER CANCEL. Set timeout to 60+ seconds.
cd functions && pnpm install && cd ..

# 4. Build backend TypeScript - takes 5 seconds
cd functions && pnpm run build && cd ..

# 5. Setup development environment
pnpm run env:development

# 6. Validate setup with linting and typechecking - takes 5 seconds each
pnpm run lint && pnpm run typecheck
```

**Build and export web application:**

```bash
# Web build - takes 80 seconds. NEVER CANCEL. Set timeout to 180+ seconds.
npx expo export --platform web
```

**Test and validate changes:**

```bash
# Lint and typecheck (required before commits) - takes 10 seconds total
pnpm run lint && pnpm run typecheck

# Backend linting (source files only) - takes 3 seconds
cd functions && npx eslint src/ && cd ..

# Word validation and analysis - takes 1 second each
pnpm run words:validate
pnpm run analyze:bundle
pnpm run analyze:deps
```

## Word Management (CRITICAL)

**Adding words requires deploying to BOTH CDN and Firestore (separate systems):**

```bash
# Complete workflow (recommended)
pnpm run words:add                    # Interactive word addition
git add . && git commit -m "Add [WORD] to dictionary"
pnpm run words:deploy:all             # Deploy to both CDN + Firestore
pnpm run words:verify [WORD]          # Verify deployment

# Alternative: Deploy individually
pnpm run words:deploy                 # CDN only (user-facing app)
pnpm run words:firestore              # Firestore only (server operations)
```

**CRITICAL: If words aren't showing in live app, check both systems:**

- CDN: Fast loading for users (primary)
- Firestore: Server operations, admin functions (fallback)

See `docs/word-management-guide.md` for complete details.

## Validation Scenarios

**ALWAYS test these complete scenarios after making changes:**

### Frontend Changes

```bash
# 1. Build successfully
npx expo export --platform web  # 80 seconds, creates 2.69MB bundle

# 2. Verify bundle optimization
pnpm run analyze:bundle
# Expected: Bundle ~2.6MB, words externalized, no source maps

# 3. Check no unused dependencies
pnpm run analyze:deps
# Expected: May show expo-system-ui, expo-updates as unused (safe to ignore)
```

### Backend Changes

```bash
# 1. TypeScript compilation
cd functions && pnpm run build  # 5 seconds

# 2. Source code linting
cd functions && npx eslint src/  # 3 seconds, should pass cleanly

# 3. Test word management
cd .. && pnpm run words:validate  # 1 second, should show 3812 words
```

### Word Data Changes

```bash
# 1. Validate word data structure
pnpm run words:validate  # 1 second

# 2. Build dictionary for CDN
pnpm run build:dictionary  # 1 second, creates public/dict/v3/words.json (243KB)

# 3. Verify bundle excludes words
pnpm run words:check-bundle  # Requires prior build
```

## Critical Timing and Timeouts

**NEVER CANCEL these operations. Always set appropriate timeouts:**

- **Dependency installation**: 75 seconds (main), 14 seconds (functions) - Set timeout to 120+ seconds
- **Web build**: 80 seconds - Set timeout to 180+ seconds
- **TypeScript build**: 5 seconds - Set timeout to 30+ seconds
- **Linting**: 5 seconds each - Set timeout to 30+ seconds
- **Word validation**: 1 second - Set timeout to 15+ seconds

## Environment Setup

**Required tools and versions:**

- Node.js 20+ (tested with 20.19.5)
- pnpm package manager: `npm install -g pnpm`
- Expo CLI (optional): `npm install -g @expo/cli`
- Firebase CLI (optional): `npm install -g firebase-tools`

**Environment configuration:**

```bash
# Development mode
pnpm run env:development
# Creates .env.local with debug flags and emulator URLs

# Testing mode (bypasses daily limits)
pnpm run env:testing

# Production mode
pnpm run env:production
```

## Build Commands

### Frontend Development

```bash
# Start development server (requires manual interaction - not suitable for automation)
pnpm start  # Interactive Expo dev server

# Alternative automated development
pnpm run dev  # Sets development env and starts Expo

# Web-only development
pnpm run dev:web
```

### Backend Development

```bash
# Compile TypeScript - 5 seconds
cd functions && pnpm run build

# Continuous compilation during development
cd functions && pnpm run dev  # Runs tsc --watch

# Lint source code - 3 seconds
cd functions && npx eslint src/
```

### Production Builds

```bash
# Web application build - 80 seconds. NEVER CANCEL.
npx expo export --platform web
# Output: dist/ directory with 2.69MB bundle + static assets

# Backend build for deployment
cd functions && pnpm run build
```

## Word Management

**Primary workflow for adding/updating words:**

```bash
# 1. Validate current word data - 1 second
pnpm run words:validate

# 2. Build dictionary for CDN deployment - 1 second
pnpm run build:dictionary

# 3. Deploy to CDN (requires Firebase auth)
pnpm run words:deploy
```

**Analysis and optimization:**

```bash
# Check bundle doesn't include word data
pnpm run words:check-bundle

# Full bundle analysis with build - 80+ seconds
pnpm run words:verify-bundle

# Dependency analysis - 3 seconds
pnpm run analyze:deps
```

## Quality Assurance

**Always run before committing changes:**

```bash
# Frontend validation - 10 seconds total
pnpm run lint && pnpm run typecheck

# Backend validation - 8 seconds total
cd functions && pnpm run build && npx eslint src/ && cd ..

# Word data validation - 1 second
pnpm run words:validate
```

## Repository Structure

```
nerd-wordle/
├── app/                    # Expo Router pages and screens
├── components/             # Reusable React components
├── data/                   # Source data (words.json - single source of truth)
├── functions/              # Firebase Cloud Functions (backend)
│   ├── src/               # TypeScript source code
│   └── lib/               # Compiled JavaScript (do not lint)
├── public/dict/           # CDN-deployed word dictionaries (versioned)
├── scripts/               # Build and word management scripts
├── constants/             # Frontend constants (no word data)
├── storage/               # CDN-first loading logic
├── utils/                 # Shared utility functions
└── docs/                  # Documentation
```

## Important Files and Locations

### Frequently Modified Files

- `data/words.json` - Single source of truth for all word data (3812 words, 243KB)
- `app/` - Main application screens and navigation
- `components/` - Reusable UI components
- `functions/src/` - Backend API and database logic

### Build and Configuration

- `package.json` - Main project dependencies and scripts
- `functions/package.json` - Backend dependencies and deployment scripts
- `app.json` - Expo configuration
- `eas.json` - Build and deployment configuration
- `firebase.json` - Firebase hosting and functions configuration

### Generated/Compiled (Do Not Edit)

- `dist/` - Web build output (deleted on each build)
- `functions/lib/` - Compiled JavaScript (generated from TypeScript)
- `public/dict/v*/` - Built dictionary files for CDN

## Common Issues and Solutions

### Build Failures

```bash
# Clear caches and rebuild
pnpm run clean  # Clears Expo cache

# Clean backend build
cd functions && rm -rf lib && pnpm run build
```

### Dependency Issues

```bash
# Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Backend dependencies
cd functions && rm -rf node_modules pnpm-lock.yaml && pnpm install
```

### Environment Issues

```bash
# Reset environment configuration
pnpm run env:development

# Check current environment
node scripts/env-helper.js show
```

## Development Workflow Best Practices

1. **Always run validation before making changes**: `pnpm run lint && pnpm run typecheck`
2. **Test word changes immediately**: `pnpm run words:validate` after editing data/words.json
3. **Verify bundle optimization**: `pnpm run analyze:bundle` after significant changes
4. **Use appropriate timeouts**: 180+ seconds for builds, 30+ seconds for linting
5. **Never cancel long-running builds**: Builds may take 80+ seconds and this is normal
6. **Always check both frontend and backend**: Changes may affect multiple components

## Performance Notes

**Current optimization status:**

- Bundle size: 2.69MB (optimized from ~3.2MB)
- Word dictionary: 243KB externalized to CDN (not in bundle)
- Total savings: ~600KB through CDN + icon optimization
- Build time: 80 seconds (normal for React Native web export)

**Expected file sizes:**

- Main bundle: ~2.6-2.7MB
- Word dictionary: 243KB (separate CDN file)
- Individual pages: ~21KB each

The build and timing values in these instructions have been validated and measured. Always use the specified timeout values to prevent premature cancellation of normal operations.
