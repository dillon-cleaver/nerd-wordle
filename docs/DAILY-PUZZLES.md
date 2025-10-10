# Daily Puzzles - Simple Guide

## First Time: Deploy All Words Starting Tomorrow

```bash
cd functions && pnpm run seed:puzzles && cd ..
```

This schedules all ~126 words starting tomorrow, sorted by edition number (1, 2, 3... 126).

## When You Add New Words

When you add new words to your dictionary:

1. **Add and deploy the word**:

   ```bash
   pnpm run words:add          # Add word interactively
   pnpm run words:deploy:all   # Deploy to CDN + Firestore
   ```

2. **Schedule the new words**:
   ```bash
   cd functions && pnpm run seed:puzzles && cd ..
   ```

The script is smart:

- **First run:** Schedules all words starting tomorrow
- **Future runs:** Only adds new words (with higher edition numbers) after your existing schedule

## That's It

No cycles, no complexity. Just sequential words by edition number, automatically extending as you add more.
