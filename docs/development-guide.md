# NerdWord Development Guide

A comprehensive guide to developing, building, and deploying NerdWord.

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/dillon-cleaver/nerd-wordle.git
cd nerd-wordle

# Install dependencies
pnpm install
cd functions && pnpm install && cd ..

# Start development: Backend first, then frontend
# Terminal 1: Start Firebase emulators
cd functions
pnpm dev:emulator

# Terminal 2: Start frontend dev server
cd ..  # back to root
pnpm dev
```

## ⚡ Most Common Commands

### Adding New Words (Primary Workflow)
```bash
# 1. Edit constants/words.json
# 2. Deploy to CDN
pnpm words:deploy

# 3. Optional: Update admin database
pnpm words:admin
```

### Daily Development
```bash
# Frontend development
pnpm dev

# Backend development  
cd functions && pnpm dev:emulator
```

### Deployment
```bash
# Deploy new words
pnpm words:deploy

# Deploy app updates
pnpm deploy:app

# Deploy everything
pnpm deploy:all
```

## 📁 Project Structure

```
nerd-wordle/
├── app/                    # Expo Router pages
├── components/             # React components
├── functions/              # Firebase Functions (backend API)
├── utils/                  # Utility functions
├── types/                  # TypeScript type definitions
├── constants/              # App constants and configuration
├── docs/                   # Documentation
└── package.json            # Main project dependencies
```

## 🌐 Environment Setup

### Prerequisites

1. **Node.js 20+** - Required for Firebase Functions
2. **pnpm** - Package manager (`npm install -g pnpm`)
3. **EAS CLI** - `npm install -g eas-cli`
4. **Firebase CLI** - `npm install -g firebase-tools`
5. **Expo CLI** - `npm install -g @expo/cli`

### Authentication

```bash
# Login to Expo
eas login

# Login to Firebase
firebase login

# Check login status
pnpm run env:check
```

### Project Configuration

1. **Expo Project**: Already configured in `app.json`
2. **Firebase Project**: Configured in `firebase.json` and `functions/`
3. **EAS Updates**: Runtime version policy set to `appVersion`

## 🛠️ Development Commands

### Starting Development

#### Frontend (from root directory)

| Command            | Description                     |
| ------------------ | ------------------------------- |
| `pnpm start`       | Start Expo dev server           |
| `pnpm dev`         | Start development with env vars |
| `pnpm dev:web`     | Start web development           |
| `pnpm dev:bypass`  | Start with testing flags        |
| `pnpm clean`       | Start Expo with cleared cache   |

#### Backend (from functions/ directory)

| Command                      | Description                                      |
| ---------------------------- | ------------------------------------------------ |
| `pnpm build`                 | Compile TypeScript to JavaScript                 |
| `pnpm dev`                   | Continuous TypeScript compilation                |
| `pnpm shell`                 | Interactive Firebase Functions debugging         |
| `pnpm logs`                  | View production function logs                    |
| `pnpm dev:emulator`          | Start Firebase emulators with data persistence  |
| `pnpm dev:clean`             | Start fresh emulator (no saved data)            |
| `pnpm dev:prod-data`         | Start emulators with production data seeded      |
| `pnpm dev:reset`             | Reset emulator data and start fresh              |

### Code Quality

| Command              | Description           |
| -------------------- | --------------------- |
| `pnpm run lint`      | Run ESLint            |
| `pnpm run typecheck` | Run TypeScript checks |
| `pnpm test`          | Run Jest tests        |

## 🏗️ Building & Deployment

### Quick Deployment Commands

| Command               | Description                           |
| --------------------- | ------------------------------------- |
| `pnpm words:deploy`   | **Deploy new words to CDN**          |
| `pnpm deploy:app`     | Deploy frontend to production         |
| `pnpm deploy:backend` | Deploy backend functions              |
| `pnpm deploy:all`     | Deploy everything (backend + frontend)|

### Web Deployment

```bash
# Deploy web app to production
pnpm deploy:app

# Deploy everything (backend + web)
pnpm deploy:all
```

### Backend Deployment (from functions/ directory)

```bash
cd functions

# Deploy functions only
pnpm deploy

# Deploy all Firebase services (functions + rules + indexes)
pnpm deploy:all
```

### Mobile App Updates (EAS Update)

```bash
# Deploy mobile app update
pnpm run deploy:mobile

# Check deployment status
eas update:list
```

### App Store Builds (EAS Build)

```bash
# Build for app stores
eas build --platform all      # Both platforms
eas build --platform android  # Android only
eas build --platform ios      # iOS only

# Submit to app stores
eas submit --platform all
```

### Backend Deployment (Firebase)

```bash
# Deploy backend functions (from functions/ directory)
cd functions
pnpm run deploy:functions

# View function logs
firebase functions:log
```

## 🗄️ Word Management

### Adding New Words - Simplified Workflow ⭐

The streamlined process for adding words to the game:

```bash
# 1. Add words to the source file
# Edit constants/words.json

# 2. Validate and deploy to CDN (one command!)
pnpm words:deploy

# 3. Optional: Update Firestore for admin functions
pnpm words:admin
```

**What `pnpm words:deploy` does:**
- ✅ Validates word data (checks for duplicates, required fields)
- ✅ Builds static dictionary for CDN
- ✅ Deploys to Firebase Hosting CDN
- ✅ Shows success confirmation with word count

### Individual Word Management Commands

| Command              | Description                           |
| -------------------- | ------------------------------------- |
| `pnpm words:add`     | Show instructions for adding words    |
| `pnpm words:validate`| Validate words.json for issues        |
| `pnpm words:deploy`  | **Main workflow:** validate + deploy to CDN |
| `pnpm words:admin`   | Update Firestore for admin functions |

### Legacy Workflow (if CDN is unavailable)

If you need to use the old Firestore-only approach:

```bash
# Update Firestore only (fallback method)
cd functions && pnpm seed:words:production
```

### Firebase Setup

#### 1. Deploy Firestore Security Rules

```bash
firebase deploy --only firestore:rules
```

#### 2. Build and Deploy Functions

```bash
cd functions
pnpm install
pnpm run build
firebase deploy --only functions
```

### Local Development Database

```bash
# Import production data to local emulator (from functions/ directory)
cd functions
pnpm migrate:from-prod

# Or start emulator with production data seeded
cd functions
pnpm dev:prod-data
```

### Production Database Setup

```bash
# Import production data to emulator for development
cd functions
pnpm run dev:prod-data
```

## 🗄️ Firebase Emulator Data Management

### Understanding Emulator Commands

The Firebase emulator offers different modes of operation depending on your development needs:

#### `emulator:serve` - Clean Slate Development

```bash
cd functions
pnpm run emulator:serve
```

- **Purpose**: Start a fresh emulator session with no pre-existing data
- **Use case**: Testing new features, debugging without existing data interference
- **Data persistence**: None - all data created during the session is lost when stopped
- **Best for**: Clean testing, initial development, debugging edge cases

#### `dev:emulator` - Persistent Development

```bash
cd functions
pnpm dev:emulator
```

- **Purpose**: Start emulator with data persistence between sessions
- **Data loading**: Automatically imports data from `./emulator-data/` if it exists
- **Data saving**: Exports all data back to `./emulator-data/` when stopped
- **Use case**: Daily development work where you want to keep your test data
- **Best for**: Iterative development, maintaining consistent test environment

#### `dev:reset` - Factory Reset

```bash
cd functions
pnpm dev:reset
```

- **Purpose**: Complete cleanup of all emulator data
- **Actions**:
  1. Deletes `./emulator-data/` directory (removes saved snapshots)
  2. Starts temporary emulator and clears all collections
- **Use case**: Starting completely fresh, clearing corrupted data
- **Best for**: Troubleshooting, preparing for new feature development

#### `dev:prod-data` - Production Data Seeding

```bash
cd functions
pnpm dev:prod-data
```

- **Purpose**: Import fresh production data for development
- **Actions**:
  1. Starts emulator temporarily
  2. Runs migration script to copy production data
  3. Exports the imported data to `./emulator-data/`
- **Use case**: Getting realistic test data, debugging production issues locally
- **Best for**: Feature testing with real data, reproducing production scenarios

#### `migrate:from-prod` - Direct Production Database Clone

```bash
cd functions
pnpm migrate:from-prod
```

- **Purpose**: Directly copy entire production database to currently running emulator
- **Requirement**: Emulator must already be running (use with `emulator:start` or `emulator:serve`)
- **Data copied**:
  - **Words collection** (`words/`) - All 3,800+ categorized words with metadata
  - **Daily puzzles collection** (`dailyPuzzles/`) - Complete puzzle history with statistics
  - **Users collection** (`users/`) - All user profiles and authentication data
  - **Puzzle history subcollections** (`users/{userId}/puzzleHistory/`) - Individual user game history
- **Connection method**: Establishes dual Firebase connections (production + emulator simultaneously)
- **Safety features**:
  - Read-only access to production (never writes to live database)
  - 30-second timeout protection
  - Batch processing for performance
  - Error handling continues import even if one collection fails
- **Use cases**:
  - **Production debugging**: Reproduce issues with exact production data locally
  - **Analytics development**: Test reporting features with real user behavior patterns
  - **Performance testing**: Validate features against production-scale datasets
  - **User experience testing**: Test UI/UX with authentic user data and game histories
- **Best for**: Advanced debugging, data analysis, reproducing specific production scenarios

**Key Differences from `dev:prod-data`:**

- `migrate:from-prod`: Imports to running emulator (no persistence unless manually exported)
- `dev:prod-data`: Starts emulator, imports, then auto-exports for persistence

**Sample Import Output:**

```
🔄 Starting production data import to emulator...
📚 Found 3,847 words in production
✅ Imported 3,847 words
📅 Found 142 daily puzzles in production
✅ Imported 142 daily puzzles
👥 Found 1,234 users in production
✅ Imported 1,234 users
📋 Import verification:
   Words: 3,847
   Daily puzzles: 142
   Users: 1,234
   Puzzle history entries: 15,692
```

### Emulator Data Format & Structure

The `./emulator-data/` directory uses Firebase's standard export format:

```
functions/emulator-data/
├── firebase-export-metadata.json          # Export metadata
└── firestore_export/                      # Firestore database export
    ├── firestore_export.overall_export_metadata
    └── all_namespaces/
        ├── default_namespace/              # Your Firestore collections
        │   ├── words/                      # Collection: words
        │   │   ├── output-0                # Document data files
        │   │   └── output-0.metadata       # Document metadata
        │   ├── dailyPuzzles/               # Collection: dailyPuzzles
        │   └── users/                      # Collection: users
        └── kind_name_id_mappings
```

#### Metadata Files Explained

**`firebase-export-metadata.json`**

```json
{
  "version": "14.5.0",                     # Firebase CLI version used for export
  "firestore": {
    "version": "1.19.8",                   # Firestore emulator version
    "path": "firestore_export",            # Relative path to Firestore data
    "metadata_file": "..."                 # Path to Firestore export metadata
  }
}
```

**`firestore_export.overall_export_metadata`**

- Contains Firestore-specific export information
- Tracks collection schemas, document counts, and export timestamps
- Used by Firebase to ensure data integrity during import/export

#### Key Benefits of This Format

1. **Portability**: Can be shared between developers or environments
2. **Version Control**: Can be committed to git for consistent test data (though be careful with sensitive data)
3. **Production Compatible**: Same format used by Firebase backup/restore tools
4. **Complete Snapshots**: Captures entire database state including subcollections and security rules context

### Recommended Emulator Workflows

#### First-Time Setup

```bash
cd functions
pnpm dev:prod-data          # Get initial production data
pnpm dev:emulator           # Start with persistent data for development
```

#### Daily Development

```bash
cd functions
pnpm dev:emulator           # Use your saved data from yesterday
# Work on features...
# Data automatically saved when you stop the emulator
```

#### Testing New Features (Clean Environment)

```bash
cd functions
pnpm dev:clean              # Start fresh without existing data
# Test your feature...
# No data is saved when stopped
```

#### Troubleshooting/Fresh Start

```bash
cd functions
pnpm dev:reset              # Clear everything
pnpm dev:prod-data          # Re-import fresh production data
```

#### Sharing Test Data with Team

```bash
# Export your current emulator state
cd functions
pnpm dev:emulator         # Your data gets exported on exit

# Commit the emulator-data directory (be mindful of sensitive data)
git add emulator-data/
git commit -m "Add test data for feature X"

# Team members can then use your data
git pull
cd functions
pnpm dev:emulator         # Imports the shared data
```

### Data Management Best Practices

1. **Don't commit sensitive data**: Review `emulator-data/` contents before committing
2. **Use descriptive snapshots**: Consider renaming emulator-data for different test scenarios
3. **Regular cleanup**: Periodically run `emulator:reset` to prevent stale data issues
4. **Production parity**: Use `dev:prod-data` regularly to keep test data realistic
5. **Backup important test states**: Copy `emulator-data/` to save specific test scenarios

## 🔧 Backend Function Development

### TypeScript Compilation Commands

Firebase Functions are written in TypeScript and must be compiled to JavaScript before deployment or testing.

#### `build` - One-Time Compilation

```bash
cd functions
pnpm run build
```

- **What it does**: `tsc` - Compiles all TypeScript files from `src/` to JavaScript in `lib/`
- **When to use**:
  - Before deployment to production
  - After making changes to verify compilation
  - Checking for TypeScript errors
  - Manual builds for testing
- **Output**: Creates/updates `lib/` directory with compiled JavaScript
- **Required for**: Deployment, shell testing, migration scripts

#### `dev` - Continuous Compilation

```bash
cd functions
pnpm dev
```

- **What it does**: `tsc --watch` - Automatically recompiles when TypeScript files change
- **When to use**:
  - During active development
  - Keep running in background while coding
  - Ensures functions are always up-to-date for emulator
- **Best practice**: Start this in a dedicated terminal at beginning of development session
- **Stops automatically**: When you exit the terminal or stop the process

### Interactive Function Testing

#### `shell` - Firebase Functions Shell

```bash
cd functions
pnpm shell
```

- **What it does**: `pnpm run build && firebase functions:shell` - Opens Node.js REPL with your functions loaded
- **When to use**:
  - Test individual functions without full emulator
  - Debug function logic interactively
  - Query Firestore directly from functions context
  - Test functions with custom parameters
  - Rapid prototyping of function changes

**Example shell usage:**

```javascript
// Test the main API function
api({ method: "GET", url: "/words" });

// Test with custom request data
api({
  method: "POST",
  url: "/puzzle-result",
  body: {
    id: "test",
    word: "ZELDA",
    attempts: 3,
    date: "2024-08-19",
    status: "win",
  },
});

// Access Firebase Admin directly
admin.firestore().collection("words").get();

// Test utility functions
wordsCollection().doc("ZELDA").get();
firestoreToWordEntry(doc);

// Access environment and admin instances
process.env.NODE_ENV;
admin.app();
```

**Available in shell:**

- All exported functions from `index.ts` (`api`)
- All utility functions from `utils.ts`
- Firebase Admin SDK (`admin`)
- Environment variables
- Node.js built-ins

### Production Monitoring

#### `logs` - Live Production Logs

```bash
cd functions
pnpm logs
```

- **What it does**: `firebase functions:log` - Streams real-time logs from production functions
- **When to use**:
  - Investigate production issues
  - Monitor API usage patterns
  - Debug authentication problems
  - Performance analysis
  - Post-deployment verification

**What you'll see:**

```
2024-08-19T15:30:45.123Z I api: GET /words - 200ms
2024-08-19T15:30:46.456Z E api: Error in /daily-puzzle: User not authenticated
2024-08-19T15:30:47.789Z I api: POST /puzzle-result - User: abc123 - 150ms
```

**Log types:**

- **I** (Info): Normal function execution, console.log statements
- **E** (Error): Errors, exceptions, console.error statements
- **W** (Warning): console.warn statements
- **D** (Debug): Detailed execution information

### Recommended Backend Development Workflows

#### Daily Development Setup

```bash
# Terminal 1: Continuous compilation
cd functions
pnpm dev

# Terminal 2: Emulator with persistent data
cd functions
pnpm dev:emulator

# Terminal 3: Frontend development
cd ..
pnpm dev
```

#### Function Development & Testing

```bash
# 1. Make changes to TypeScript files
# 2. pnpm dev automatically compiles
# 3. Test in emulator by calling API endpoints
# 4. For complex debugging:
cd functions
pnpm shell
# Test functions interactively
```

#### Pre-Deployment Verification

```bash
```bash
cd functions
pnpm build         # Ensure clean compilation
pnpm deploy:all    # Deploy functions + rules + indexes
pnpm logs          # Monitor deployment
```
pnpm run lint          # Check code quality
pnpm run shell         # Test key functions manually
# Then deploy:
pnpm run deploy:functions
```

#### Production Issue Investigation

```bash
# 1. Monitor production logs
cd functions
pnpm run logs

# 2. Reproduce locally with production data
pnpm run migrate:from-prod
pnpm run shell
# Test with real data

# 3. Fix and redeploy
pnpm run build
pnpm run deploy:functions
```

#### Clean Development Reset

```bash
cd functions
pnpm run emulator:reset    # Clear all data
pnpm run build             # Fresh compilation
pnpm run emulator:start    # Start clean
```

### Function Development Best Practices

1. **Always run `build:watch`**: Keep TypeScript compilation active during development
2. **Use `shell` for debugging**: Test functions interactively before full emulator testing
3. **Monitor production logs**: Use `logs` command to understand production behavior
4. **Build before deployment**: Always run `build` manually before deploying to catch issues
5. **Test with real data**: Use `migrate:from-prod` for realistic testing scenarios
6. **Check compilation errors**: TypeScript errors in `build:watch` output indicate issues

## 📊 API Endpoints

### Production API

- Base URL: `https://api-2no66svcwq-uc.a.run.app`
- CORS enabled for Expo hosting domains

### Local Development API

- Base URL: `http://localhost:5001/nerd-wordle/us-central1/api`
- Requires Firebase emulators to be running

### Available Endpoints

| Endpoint              | Method | Description                   |
| --------------------- | ------ | ----------------------------- |
| `/words`              | GET    | Get all words with categories |
| `/daily-puzzle`       | GET    | Get today's puzzle            |
| `/daily-puzzle/:date` | GET    | Get puzzle for specific date  |

### Frontend Integration

The frontend uses custom React hooks for clean API integration:

```typescript
import { useDailyPuzzle } from "@/hooks/useDailyPuzzle";

// In your component
const { dailyPuzzle, isLoading, error } = useDailyPuzzle();
```

For direct API access:

```typescript
import { wordsApi, dailyPuzzleApi } from "@/utils/api";

// Get today's puzzle
const puzzle = await dailyPuzzleApi.getTodaysPuzzle();

// Get all words
const words = await wordsApi.getAllWords();
```

## 🗃️ Database Structure

### Words Collection (`/words/{wordId}`)

```json
{
  "id": "ZELDA",
  "category": "videoGames",
  "edition": 5,
  "hints": ["Hint 1", "Hint 2", "Hint 3"],
  "summary": "Brief description",
  "wikipediaUrl": "https://en.wikipedia.org/wiki/...",
  "appearance": {
    "timesShown": 1,
    "firstShownDate": "2024-01-01T00:00:00.000Z",
    "currentHintIndex": 0,
    "lastHintRotation": "2024-01-01T00:00:00.000Z"
  }
}
```

### Daily Puzzles Collection (`/dailyPuzzles/{YYYY-MM-DD}`)

```json
{
  "word": {
    "id": "ZELDA",
    "category": "videoGames"
    // ... complete word object
  },
  "solveCount": 0,
  "averageGuesses": 0,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "isGenerated": false,
  "cycleLap": 1
}
```

### User Puzzle History (`/users/{userId}/puzzleHistory/{puzzleId}`)

```json
{
  "id": "2024-08-11_ZELDA",
  "word": "ZELDA",
  "attempts": 4,
  "date": "2024-08-11T00:00:00.000Z",
  "status": "win",
  "edition": 5,
  "hintIndex": 0
}
```

## 🔧 Development Workflow

### Recommended Daily Development Workflow

```bash
# 1. Start backend emulators first (Terminal 1)
cd functions
pnpm run emulator:start

# 2. Start frontend dev server (Terminal 2)
cd ..  # back to root directory
pnpm start

# 3. Make your changes...

# 4. Test locally
pnpm run lint
pnpm run typecheck
```

### Alternative: Development with Production Data

```bash
# 1. Start backend with production data seeded (Terminal 1)
cd functions
pnpm run dev:prod-data

# 2. Start frontend dev server (Terminal 2)
cd ..  # back to root directory
pnpm start
```

### Quick Development (Fresh Start)

```bash
# 1. Reset and start emulators (Terminal 1)
cd functions
pnpm run emulator:reset
pnpm run emulator:start

# 2. Start frontend (Terminal 2)
cd ..
pnpm start
```

### Deploying Updates

```bash
# Quick deployment of all platforms
pnpm run deploy:all

# Or deploy individually:
# Frontend only (from root)
pnpm run deploy:web

# Backend only (from functions/)
cd functions && pnpm run deploy:functions
```

### Adding New Words/Puzzles

**New Optimized Workflow (Post-CDN Migration):**

1. **Update the source data**: Edit `constants/words.json`
2. **Build static dictionary**: `npm run build:dictionary`
3. **Deploy static files**: `firebase deploy --only hosting`
4. **Update Firestore (for admin functions)**:
   ```bash
   cd functions && npm run build
   node lib/migrations/seed-words.js
   ```
5. **Test the changes**: Verify both CDN and fallback work

**Legacy Workflow (if not using CDN optimization):**

1. Update data in `constants/words.json` or equivalent
2. Run migrations: `pnpm run migrate` (production)
3. Deploy backend: `cd functions && pnpm run deploy:functions`
4. Test the changes

**Note**: The new workflow prioritizes CDN delivery for performance while maintaining Firestore as a backup for admin functions and individual word lookups.

### Troubleshooting Development

```bash
# Clear frontend cache and restart
pnpm run clean

# Reset backend emulators and start fresh (from functions/)
cd functions
pnpm run emulator:reset
pnpm run emulator:start

# Check if emulators are running
firebase emulators:list

# Import fresh production data to emulator (from functions/)
cd functions
pnpm run migrate:from-prod
```

## 🎯 Key Features

- **Cross-platform**: Web, iOS, Android
- **Real-time updates**: EAS Update for instant deployments
- **Scalable backend**: Firebase Functions with Firestore
- **Rich word database**: 3,800+ categorized words
- **Daily puzzles**: Automatically generated content

## 🚨 Troubleshooting

### CORS Errors

- Ensure the Functions are configured with the correct CORS origins
- Check that the API_BASE_URL in `utils/api.ts` points to the correct Functions URL
- For emulator: Ensure it's running on the expected port (5001)

### Migration Failures

- Check Firebase project permissions
- Ensure Firestore is enabled in your Firebase project
- Verify the Firebase CLI is authenticated with the correct project
- For emulator: Ensure `FIRESTORE_EMULATOR_HOST` is set correctly

### API Errors

- Check Firebase Functions logs: `firebase functions:log`
- Ensure authentication tokens are being passed correctly for protected endpoints
- Verify Firestore security rules allow the operations
- Check emulator console output for detailed error messages

### Frontend Issues

- **"Cannot read properties of undefined"**: Usually indicates puzzle not loaded yet
- **No guess grid showing**: Check that `isLoading` state resolves correctly
- **API calls failing**: Verify emulator is running and API_BASE_URL is correct
- **Puzzle not updating**: Check browser console for API errors

## 📝 Contributing

1. Create a feature branch
2. Make your changes
3. Test locally with `pnpm run dev:full`
4. Run quality checks: `pnpm run lint && pnpm run typecheck`
5. Deploy for testing: `pnpm run deploy:web`
6. Create pull request

## 🆘 Need Help?

- **Backend Issues**: Use `firebase functions:log` for backend debugging
- **Database Issues**: Reset emulators with `cd functions && pnpm run emulator:reset`
- **Frontend Issues**: Clear cache with `pnpm run clean`
- **Environment Setup**: Check authentication status and verify Firebase CLI setup
- **Production Monitoring**: See Firebase console for production issues

### Development Workflow Reminder

1. **Start backend first**: `cd functions && pnpm run emulator:start`
2. **Start frontend second**: `cd .. && pnpm start`
3. **Both running?** Check that emulators are on localhost:8080 (Firestore) and localhost:5001 (Functions)

---

**Happy coding! 🎮**
