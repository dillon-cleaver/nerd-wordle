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

# Start development server with Firebase emulators
pnpm run dev:full
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

| Command                   | Description                     |
| ------------------------- | ------------------------------- |
| `pnpm start`              | Start Expo dev server only      |
| `pnpm run dev:full`       | Start Expo + Firebase emulators |
| `pnpm run dev:clean`      | Start with cleared cache        |
| `pnpm run firebase:serve` | Start Firebase emulators only   |

### Platform-Specific Development

| Command            | Description                     |
| ------------------ | ------------------------------- |
| `pnpm run android` | Open on Android device/emulator |
| `pnpm run ios`     | Open on iOS device/simulator    |
| `pnpm run web`     | Open in web browser             |

### Code Quality

| Command              | Description           |
| -------------------- | --------------------- |
| `pnpm run lint`      | Run ESLint            |
| `pnpm run typecheck` | Run TypeScript checks |
| `pnpm test`          | Run Jest tests        |

## 🏗️ Building & Deployment

### Web Deployment (EAS Hosting)

```bash
# Export web build and deploy to production
pnpm run web:deploy:prod

# Or step by step:
pnpm run expo:export    # Export static files
pnpm run eas:deploy     # Deploy to EAS Hosting
```

### Mobile App Updates (EAS Update)

```bash
# Deploy to production channel
pnpm run eas:update

# Deploy to preview channel for testing
pnpm run eas:update:preview

# Check deployment status
pnpm run eas:status
```

### App Store Builds (EAS Build)

```bash
# Build for app stores
pnpm run eas:build:all      # Both platforms
pnpm run eas:build:android  # Android only
pnpm run eas:build:ios      # iOS only

# Preview builds for testing
pnpm run eas:build:preview

# Submit to app stores
pnpm run eas:submit:all
```

### Backend Deployment (Firebase)

```bash
# Deploy API functions only
pnpm run firebase:deploy

# Deploy everything (functions, hosting, etc.)
pnpm run firebase:deploy:all

# View function logs
pnpm run firebase:logs
```

## 🗄️ Database Management & Setup

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

### Local Development

```bash
# Seed local Firestore with words and puzzles
pnpm run migrate:all

# Seed individual collections
pnpm run migrate:words    # Word dictionary (3,800+ words)
pnpm run migrate:puzzles  # Daily puzzles
```

### Production Database Setup

```bash
# Seed production Firestore (USE WITH CAUTION)
pnpm run migrate:all:prod

# Seed individual collections in production
pnpm run migrate:words:prod
pnpm run migrate:puzzles:prod
```

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

## 🔧 Common Workflows

### Daily Development

```bash
# 1. Start development environment
pnpm run dev:full

# 2. Make your changes...

# 3. Test locally
pnpm run lint
pnpm run typecheck
```

### Deploying Updates

```bash
# Quick deployment of all platforms
pnpm run deploy:all

# Or deploy individually:
pnpm run deploy:backend  # Firebase Functions
pnpm run deploy:web      # Web app
pnpm run deploy:mobile   # Mobile app update
```

### Adding New Words/Puzzles

1. Update data in `constants/words.json` or equivalent
2. Run migrations: `pnpm run migrate:all:prod`
3. Deploy backend: `pnpm run firebase:deploy`
4. Test the changes

### Troubleshooting

```bash
# Clear all caches and reset
pnpm run clean

# Check for dependency issues
pnpm run deps:check

# Upgrade Expo SDK
pnpm run deps:upgrade

# Reset project to template state
pnpm run dev:reset
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
5. Deploy to preview: `pnpm run eas:update:preview`
6. Create pull request

## 🆘 Need Help?

- Check `pnpm run env:check` for authentication issues
- Use `pnpm run firebase:logs` for backend debugging
- Run `pnpm run deps:check` for dependency conflicts
- See Firebase console for production monitoring

---

**Happy coding! 🎮**
