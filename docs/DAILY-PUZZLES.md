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

## When the Schedule Expires

If all scheduled puzzles have passed (app falls back to ZELDA every day), reseed from today:

```bash
cd functions && pnpm run seed:puzzles:reseed-today && cd ..
```

This is non-destructive — it only writes new documents starting from today (edition 1 → N). Old puzzle documents and user data are never touched. Safe to run even if some future dates already have puzzles (it will overwrite them).

## That's It

No cycles, no complexity. Just sequential words by edition number, automatically extending as you add more.
