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
pnpm run emulator:start

# Terminal 2: Start frontend dev server
cd ..  # back to root
pnpm start
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
| `pnpm run clean`   | Start Expo with cleared cache   |
| `pnpm run android` | Open on Android device/emulator |
| `pnpm run ios`     | Open on iOS device/simulator    |
| `pnpm run web`     | Open in web browser             |

#### Backend (from functions/ directory)

| Command                      | Description                                      |
| ---------------------------- | ------------------------------------------------ |
| `pnpm run emulator:start`    | Start Firebase emulators (Firestore + Functions) |
| `pnpm run dev:prod-data`     | Start emulators with production data seeded      |
| `pnpm run emulator:reset`    | Reset emulator data and start fresh              |
| `pnpm run migrate:from-prod` | Import production data to local emulator         |

### Code Quality

| Command              | Description           |
| -------------------- | --------------------- |
| `pnpm run lint`      | Run ESLint            |
| `pnpm run typecheck` | Run TypeScript checks |
| `pnpm test`          | Run Jest tests        |

## 🏗️ Building & Deployment

### Web Deployment

```bash
# Deploy web app to production
pnpm run deploy:web

# Deploy everything (backend + web)
pnpm run deploy:all
```

### Backend Deployment (from functions/ directory)

```bash
cd functions

# Deploy functions only
pnpm run deploy:functions

# Deploy all Firebase services (functions + rules + indexes)
pnpm run deploy:firebase

# Deploy specific services
pnpm run deploy:functions
pnpm run deploy:rules
pnpm run deploy:indexes
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

### Local Development Database

```bash
# Import production data to local emulator (from functions/ directory)
cd functions
pnpm run migrate:from-prod

# Or start emulator with production data seeded
cd functions
pnpm run dev:prod-data
```

### Production Database Setup

```bash
# Import production data to emulator for development
cd functions
pnpm run dev:prod-data
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

1. Update data in `constants/words.json` or equivalent
2. Run migrations: `pnpm run migrate` (production)
3. Deploy backend: `cd functions && pnpm run deploy:functions`
4. Test the changes

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
