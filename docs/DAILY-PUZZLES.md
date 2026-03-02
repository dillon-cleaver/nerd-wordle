# Daily Puzzles - Simple Guide

## First Time Setup

```bash
cd functions && pnpm run seed:puzzles && cd ..
```

Schedules all nerd words starting tomorrow, sorted by edition number (1, 2, 3... N).

---

## Adding More Words to the End of the Schedule

1. Add the new words and deploy them:
   ```bash
   pnpm run words:add          # repeat for each new word
   pnpm run words:deploy:all   # deploy to CDN + Firestore
   ```

2. Schedule the new words:
   ```bash
   cd functions && pnpm run seed:puzzles && cd ..
   ```

The script finds the last scheduled edition and appends the new words starting the day after the current schedule ends. Only words with higher edition numbers are added — existing scheduled puzzles are never touched.

---

## Starting Over (Schedule Expired)

If all scheduled puzzles have passed (app falls back to ZELDA every day):

```bash
cd functions && pnpm run seed:puzzles:reseed-today && cd ..
```

Writes edition 1 → N starting from **today** (Central Time), overwriting any existing `dailyPuzzles` entries for those dates. Puzzle documents before today and all user data are never touched.

---

## That's It

Sequential words by edition number. Extend with `seed:puzzles`, restart with `seed:puzzles:reseed-today`.
