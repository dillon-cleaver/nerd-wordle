# Letter Tracking Feature Documentation

## Overview

The letter tracking feature tracks which letters are guessed per row in the Wordle game and saves this data **nested within puzzle results** using the same UUID as the game session. This ensures consistent puzzle IDs and keeps related game data together.

## Final Architecture: Nested Storage ✅ COMPLETED

### 🎯 **Architecture Decision: Nested in Puzzle Results**

**Problem**: Original implementation had separate storage with different ID systems and property name confusion:

- Puzzle Results: Random UUIDs (`8803366b-a36d-4e6b-beb0-fc2a5a1e1a99`)
- Letter Tracking: Date-based IDs (`daily-2025-08-26`)
- Property confusion: "attempts" used for both attempt count and guess count

**Solution**: **Nest letter tracking within puzzle result documents with semantic clarity**

- ✅ Single UUID for both game result and letter tracking
- ✅ Related data stays together
- ✅ No ID mismatches
- ✅ More efficient queries
- ✅ Clear property semantics: `guesses` (1-6) vs `attempts` (1+)

### 🔧 Implementation Changes

1. **Local State Collection** - Letter tracking collected in GameContext during game session
2. **Nested Storage** - Letters saved as `letterTracking` field in puzzle results
3. **No Separate Storage** - Removed dedicated letter tracking storage files
4. **Unified Data Model** - Single puzzle result contains both outcome and letter data
5. **Semantic Properties** - Fixed property names: `guesses` (per session) vs `attempts` (per puzzle)

## Files Created

### Types

- `types/letter-tracking.ts` - TypeScript types for letter tracking data
- Updated `types/puzzle-result.ts` - Added optional `letterTracking` field

### Storage Layer

- `storage/letter-tracking.local.ts` - Local storage implementation (supports both web and native AsyncStorage)
- `storage/letter-tracking.firestore.ts` - Firestore implementation for cloud sync
- `storage/letter-tracking.ts` - Main storage interface that combines local and cloud storage

### Hooks

- `hooks/useLetterTracking.ts` - React hook for managing letter tracking state and operations

### Components

- `components/LetterTrackingDisplay.tsx` - Development component to visualize tracked letters

### Integration

- Updated `context/GameContext.tsx` to include letter tracking functionality and use enhanced game logic
- Updated `components/DrawerDevInfo.tsx` to display letter tracking in development mode
- Enhanced `utils/game-logic.ts` with letter tracking integration

## Data Structure

### LetterGuess

```typescript
type LetterGuess = {
  letter: string; // The letter that was guessed (uppercase)
  row: number; // Which row/attempt the guess was made
  position: number; // Position within the word (0-4)
  timestamp: Date; // When the guess was made
};
```

### LetterTrackingData

```typescript
type LetterTrackingData = {
  puzzleId: string; // Word ID (e.g., "POLAR", "ZELDA")
  date: string; // Date string for the puzzle
  guesses: LetterGuess[]; // Array of all letter guesses
  lastUpdated: Date; // When this data was last updated
};
```

### Enhanced PuzzleResult

```typescript
type PuzzleResult = {
  // ... existing fields ...
  letterTracking?: LetterGuess[]; // Complete letter tracking data
};
```

## API Methods

### From useLetterTracking hook:

- `letterGuesses: LetterGuess[]` - All tracked letter guesses
- `isLoading: boolean` - Loading state
- `addLetterGuess(letter, row, position)` - Add a new letter guess
- `getGuessesForRow(row)` - Get all guesses for a specific row
- `hasLetterBeenGuessed(letter)` - Check if a letter has been guessed
- `getFirstRowForLetter(letter)` - Get the first row where a letter was guessed
- `getGuessedLetters()` - Get all unique letters that have been guessed

### From GameContext (now includes letter tracking):

All the above methods are available through the GameContext as well.

## Storage Behavior

1. **Local Storage**: Always saves data locally for offline support

   - Web: Uses browser's `localStorage` API (for web compatibility)
   - Native: Uses `AsyncStorage`

2. **Cloud Storage**: Saves to Firestore if user is authenticated

   - Data is stored under `users/{uid}/letterTracking/{wordId}`
   - Automatic retry and error handling

3. **Puzzle Integration**:
   - Letter tracking data is included in puzzle results when games complete
   - Both win and loss scenarios capture complete letter tracking history
   - Data persists in both dedicated letter tracking storage and puzzle results

## Platform Support

The feature supports both web and native platforms:

- **Web**: Uses browser's `localStorage` API (for web compatibility)
- **iOS/Android**: Uses `@react-native-async-storage/async-storage`
- **Automatic detection**: Platform.OS is used to choose the correct storage method

## Integration with Game

- Letter tracking is automatically triggered when a guess is submitted
- Each letter in a submitted word is tracked with its row and position using `Promise.all()` for simultaneous processing
- Data is saved immediately after each guess
- Letter tracking data is included in final puzzle results
- Uses word ID as puzzle identifier for more precise tracking

## Development & Testing

- Letter tracking is visible in the development drawer when dev mode is enabled
- Shows current puzzle ID (word) and tracked letters by row
- Full TypeScript support with proper type checking
- Follows existing codebase patterns and conventions

## Future Enhancements

Potential extensions for this feature:

- Letter frequency analysis across multiple puzzles
- Typing pattern detection and speed metrics
- Strategy analysis (which letters are tried first)
- Guess time tracking with millisecond precision
- Cross-puzzle learning patterns

## Dependencies Added

- `@react-native-async-storage/async-storage` - For native local storage support
