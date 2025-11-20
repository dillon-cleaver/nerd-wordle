# Async useEffect Pattern: Preventing State Updates on Unmounted Components

## The Problem

When you have an async operation inside a `useEffect` hook that updates state, there's a risk that the component unmounts before the async operation completes. This causes React to show a warning:

> **Warning**: Can't perform a React state update on an unmounted component.

This is a memory leak indicator and can lead to unexpected behavior.

## The Pattern: Mounted Flag

The solution is to use a **mounted flag** to track whether the component is still mounted before updating state.

### Basic Implementation

```typescript
useEffect(() => {
  let mounted = true; // 1️⃣ Flag starts as true when effect runs

  const fetchData = async () => {
    const data = await loadSomething(); // 2️⃣ Async operation

    if (mounted) {
      // 3️⃣ Only update state if still mounted
      setState(data);
    }
  };

  fetchData();

  return () => {
    // 4️⃣ Cleanup function sets flag to false
    mounted = false;
  };
}, []);
```

## How It Works

### Successful Case (Component Stays Mounted)

1. Component mounts → `mounted = true`
2. Async operation starts
3. Async operation completes
4. Check `if (mounted)` → ✅ **true** → state updates safely
5. Component eventually unmounts → cleanup runs → `mounted = false`

### Early Unmount Case (Component Unmounts During Async)

1. Component mounts → `mounted = true`
2. Async operation starts (takes 500ms)
3. **User navigates away** → component unmounts after 100ms
4. Cleanup function runs → `mounted = false`
5. Async operation completes (after 500ms)
6. Check `if (mounted)` → ❌ **false** → **state update skipped** ✅

## Real-World Examples from NerdWord

### Example 1: Loading Local Storage Data

```typescript
// hooks/useCollectedWords.ts
useEffect(() => {
  let mounted = true;

  const loadResults = async () => {
    try {
      const results = await loadPuzzleResultsLocal();
      if (mounted) {
        setLocalResults(results);
      }
    } catch (error) {
      console.error("Failed to load local puzzle results:", error);
      // Keep existing localResults on error
    }
  };

  loadResults();

  return () => {
    mounted = false;
  };
}, [backendResults]);
```

### Example 2: Loading Daily Puzzle

```typescript
// hooks/useDailyPuzzle.ts
useEffect(() => {
  let mounted = true;

  const loadPuzzle = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const puzzle = await getTodaysPuzzle();

      if (mounted) {
        setDailyPuzzle(puzzle);
        const newGameState = initializeGame(puzzle.word);
        setGameState(newGameState);
      }
    } catch (err) {
      console.error("Failed to load daily puzzle:", err);
      if (mounted) {
        setError(err as Error);
      }
    } finally {
      if (mounted) {
        setIsLoading(false);
      }
    }
  };

  loadPuzzle();

  return () => {
    mounted = false;
  };
}, []);
```

### Example 3: Delayed Modal Display

```typescript
// components/DrawerNavigationWrapper.tsx
useEffect(() => {
  let timeoutId: NodeJS.Timeout | undefined;

  const checkModalStatus = async () => {
    if (isWeb) {
      const hasBeenShown = await hasInfoModalBeenShown();
      if (!hasBeenShown) {
        timeoutId = setTimeout(() => {
          setIsInfoModalVisible(true);
        }, animation.duration.long);
      }
    }
  };

  checkModalStatus();

  return () => {
    if (timeoutId) clearTimeout(timeoutId);
  };
}, [isWeb]);
```

## When to Use This Pattern

### ✅ Use the Mounted Flag When:

1. **Async data fetching** that updates state

   ```typescript
   const data = await fetchFromAPI();
   if (mounted) setState(data);
   ```

2. **Delayed state updates** with `setTimeout` or `setInterval`

   ```typescript
   setTimeout(() => {
     if (mounted) setState(newValue);
   }, 1000);
   ```

3. **Local storage/AsyncStorage reads** that update state

   ```typescript
   const saved = await AsyncStorage.getItem("key");
   if (mounted) setState(saved);
   ```

4. **Any async operation** that might take longer than the component's lifetime
   ```typescript
   const result = await longRunningOperation();
   if (mounted) setState(result);
   ```

### ❌ Don't Use It When:

1. **Fire-and-forget operations** (no state update)

   ```typescript
   useEffect(() => {
     analytics.log("page_view"); // No await, no state
   }, []);
   ```

2. **Subscriptions with cleanup** (unsubscribe removes callbacks)

   ```typescript
   useEffect(() => {
     const unsubscribe = onAuthStateChanged(auth, (user) => {
       setUser(user); // Safe - subscription cleaned up
     });
     return () => unsubscribe();
   }, []);
   ```

3. **Synchronous operations only**
   ```typescript
   useEffect(() => {
     console.log("Component mounted"); // No async
   }, []);
   ```

## Advanced: Multiple State Updates

When you have multiple state updates, protect all of them:

```typescript
useEffect(() => {
  let mounted = true;

  const loadData = async () => {
    try {
      if (mounted) setLoading(true);

      const data = await fetchData();

      if (mounted) {
        setData(data);
        setError(null);
      }
    } catch (err) {
      if (mounted) {
        setError(err);
        setData(null);
      }
    } finally {
      if (mounted) setLoading(false);
    }
  };

  loadData();

  return () => {
    mounted = false;
  };
}, []);
```

## Why This Works: JavaScript Closures

The mounted flag works because of **JavaScript closures**:

```typescript
useEffect(() => {
  let mounted = true; // Variable in outer scope

  const asyncFunc = async () => {
    // This function "closes over" the mounted variable
    if (mounted) {
      /* ... */
    }
  };

  return () => {
    // Cleanup also "closes over" the same mounted variable
    mounted = false;
  };
}, []);
```

Both `asyncFunc` and the cleanup function reference the **same** `mounted` variable, so when cleanup sets it to `false`, the async function sees the change.

## Common Mistakes

### ❌ Wrong: Declaring mounted outside useEffect

```typescript
let mounted = true; // ❌ Shared across all instances!

function MyComponent() {
  useEffect(() => {
    // This won't work properly
  }, []);
}
```

### ✅ Correct: Declaring mounted inside useEffect

```typescript
function MyComponent() {
  useEffect(() => {
    let mounted = true; // ✅ Unique per effect instance
    // ...
  }, []);
}
```

### ❌ Wrong: Forgetting to check mounted

```typescript
useEffect(() => {
  let mounted = true;

  const fetch = async () => {
    const data = await loadData();
    setState(data); // ❌ Not checking mounted!
  };

  fetch();
  return () => {
    mounted = false;
  };
}, []);
```

### ✅ Correct: Always check before setState

```typescript
useEffect(() => {
  let mounted = true;

  const fetch = async () => {
    const data = await loadData();
    if (mounted) {
      // ✅ Check before setState
      setState(data);
    }
  };

  fetch();
  return () => {
    mounted = false;
  };
}, []);
```

## Alternative: AbortController (Advanced)

For fetch requests, you can use `AbortController` to actually cancel the request:

```typescript
useEffect(() => {
  const controller = new AbortController();

  const fetchData = async () => {
    try {
      const response = await fetch(url, {
        signal: controller.signal,
      });
      const data = await response.json();
      setState(data);
    } catch (err) {
      if (err.name === "AbortError") {
        // Request was cancelled
        return;
      }
      setError(err);
    }
  };

  fetchData();

  return () => {
    controller.abort(); // Cancel the request
  };
}, []);
```

However, the mounted flag pattern is simpler and works for all async operations, not just fetch.

## Summary

- **Use the mounted flag** for async operations that update state in `useEffect`
- **Declare `let mounted = true`** at the start of the effect
- **Check `if (mounted)`** before every state update
- **Set `mounted = false`** in the cleanup function
- This prevents React warnings and potential bugs from updating unmounted components

## References

- [React useEffect Documentation](https://react.dev/reference/react/useEffect)
- [React Beta Docs: Fetching Data](https://react.dev/learn/synchronizing-with-effects#fetching-data)
- NerdWord examples: `useCollectedWords.ts`, `useDailyPuzzle.ts`, `DrawerNavigationWrapper.tsx`

---

**Status**: ✅ Pattern implemented across NerdWord codebase  
**Date**: November 2025 (PR #99)
