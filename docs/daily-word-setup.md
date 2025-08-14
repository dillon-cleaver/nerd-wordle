# Daily Word List Management Setup

This guide will help you set up and populate the Firebase backend for daily word management.

## Prerequisites

1. Firebase project set up with Firestore and Functions enabled
2. Firebase CLI installed and authenticated
3. Node.js and pnpm installed

## Setup Steps

### 1. Deploy Firestore Security Rules

```bash
firebase deploy --only firestore:rules
```

### 2. Build and Deploy Functions

```bash
cd functions
pnpm install
pnpm run build
firebase deploy --only functions
```

### 3. Populate the Database

#### Option A: Run migrations locally with emulator (Recommended for development)

```bash
# Start the Firebase emulator
cd functions
pnpm run serve

# In another terminal, run the migrations
pnpm run migrate:all
```

#### Option B: Run migrations against production

```bash
cd functions
pnpm run build

# Migrate words collection
pnpm run migrate:words

# Migrate daily puzzles (creates 11 days of test puzzles for Alpha)
pnpm run migrate:puzzles
```

## API Endpoints

Once deployed, your app will have the following endpoints:

### Public Endpoints (no authentication required)

- `GET /words` - Get all words
- `GET /words/:id` - Get specific word
- `GET /daily-puzzle/today` - Get today's puzzle
- `GET /daily-puzzle/:date` - Get puzzle for specific date (YYYY-MM-DD)

### Authenticated Endpoints

- `POST /puzzle-result` - Save puzzle result
- `GET /puzzle-history` - Get user's puzzle history
- `POST /daily-puzzle` - Schedule a daily puzzle (Alpha only - manual scheduling)

## Frontend Integration

The frontend uses a custom React hook for clean puzzle loading:

```typescript
import { useDailyPuzzle } from "@/hooks/useDailyPuzzle";

// In your component
const { dailyPuzzle, isLoading, error } = useDailyPuzzle();
```

The GameContext automatically handles puzzle loading and state management:

```typescript
// GameContext provides the daily puzzle to all game components
// No manual API calls needed in components
```

For direct API access when needed:

```typescript
import { wordsApi, dailyPuzzleApi } from "@/utils/api";

// Get today's puzzle
const puzzle = await dailyPuzzleApi.getTodaysPuzzle();

// Get all words
const words = await wordsApi.getAllWords();
```

## Database Structure

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

## Next Steps

1. **Test the API**: Use the Firebase emulator to test the new endpoints
2. **Frontend Integration**: The app now automatically loads daily puzzles via the `useDailyPuzzle` hook
3. **Error Handling**: Built-in fallback to "ZELDA" puzzle if API is unavailable
4. **Alpha Testing**: 11 daily puzzles are pre-seeded for testing the daily cycling
5. **Production Deployment**: Update API_BASE_URL in `utils/api.ts` for production
6. **Scheduling**: For production, implement intelligent puzzle generation algorithm
7. **Monitoring**: Set up monitoring for the new API endpoints

## Alpha Limitations & TODOs

The current implementation includes several "ALPHA ONLY" features marked with TODOs:

- **Hardcoded API URL**: `utils/api.ts` uses localhost for emulator testing
- **Permissive Firestore Rules**: `firestore.rules` allows all read/write for testing
- **Manual Puzzle Scheduling**: Production should use automated puzzle generation
- **Limited Word Set**: Only 11 puzzles seeded for alpha testing
- **Fallback Logic**: Hardcoded "ZELDA" fallback in `utils/daily-puzzle.ts`

## Development Workflow

### For Local Development:

1. Start emulator: `cd functions && pnpm run serve`
2. Start frontend: `pnpm start`
3. App automatically connects to emulator API

### For Production:

1. Update `API_BASE_URL` in `utils/api.ts`
2. Deploy functions: `firebase deploy --only functions`
3. Update Firestore rules for production security

## Troubleshooting

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

### Missing Word ID Error

If you see `dailyPuzzle.word.id` is undefined:

- Ensure you've run the latest migrations with the updated `wordEntryToFirestore` function
- Re-run `pnpm run migrate:puzzles` to update existing puzzle data
