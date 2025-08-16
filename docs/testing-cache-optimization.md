# Testing the Firestore Cache Optimization

## 🧪 Testing Strategy Overview

This document outlines how to test and verify that our two-layer caching system is working correctly and achieving the expected performance improvements.

## 🎯 What We're Testing

1. **Client-side localStorage caching** (24-hour TTL)
2. **Server-side in-memory caching** (1-hour TTL)
3. **Cache hit/miss behavior**
4. **Performance improvements**
5. **Firestore read reduction**

## 🛠️ Testing Tools & Setup

### 1. Browser Developer Tools

**Chrome DevTools Setup:**

- Open your app: `https://nerd-wordle--dz6aj1wgbl.expo.app/`
- Press `F12` or `Cmd+Option+I` (Mac)
- Navigate to:
  - **Console**: Monitor cache hit/miss logs
  - **Application > Local Storage**: Inspect cached data
  - **Network**: Monitor API calls
  - **Performance**: Measure load times

### 2. Firebase Console Monitoring

**Firestore Usage Dashboard:**

- Go to: https://console.firebase.google.com/project/nerd-word-cfda3/firestore/usage
- Monitor read operations in real-time

**Functions Logs:**

- Go to: https://console.firebase.google.com/project/nerd-word-cfda3/functions/logs
- Filter by "api" function to see cache logs

## 🧪 Test Cases

### Test 1: Client-Side Cache (localStorage)

**Objective**: Verify that words are cached in localStorage and served on subsequent visits.

**Steps:**

1. **Clear localStorage** (fresh start):

   ```javascript
   // In browser console
   localStorage.removeItem("nerd-wordle-words_v1");

   // OR use the utility function (if available in console)
   // clearWordsCache();
   ```

2. **First load** (should be cache miss):

   - Refresh the page
   - Check console for: `"Cache miss, fetching from API"`
   - Check Network tab for API call to `/words`
   - Verify localStorage contains data:
     ```javascript
     // In browser console - new utility-based cache structure
     const cachedData = localStorage.getItem("nerd-wordle-words_v1");
     if (cachedData) {
       const parsed = JSON.parse(cachedData);
       console.log("Cached words:", parsed.words.length);
       console.log("Cache timestamp:", new Date(parsed.timestamp));
       console.log(
         "Cache age (hours):",
         (Date.now() - parsed.timestamp) / (1000 * 60 * 60)
       );
     }
     ```

3. **Second load** (should be cache hit):
   - Refresh the page again
   - Check console for: `"Loading words from localStorage cache"`
   - Verify NO API call in Network tab

**Expected Results:**

- ✅ First load: API call + console shows "Cache miss"
- ✅ Second load: No API call + console shows "Loading from localStorage cache"
- ✅ localStorage contains words data and timestamp

### Test 2: Server-Side Cache

**Objective**: Verify that multiple users benefit from server-side caching.

**Steps:**

1. **Clear localStorage** and **restart Functions** (to clear server cache):

   ```bash
   # In terminal
   cd /Users/dilloncleaver/src/nerd-wordle
   pnpm firebase:deploy
   ```

2. **First user request**:

   - Clear localStorage in browser
   - Load app and check Functions logs for: `"Cache miss, fetching words from Firestore"`

3. **Second user simulation** (within 1 hour):
   - Open incognito window OR different browser
   - Load app and check Functions logs for: `"Serving words from cache"`

**Expected Results:**

- ✅ First request: Functions log shows "Cache miss, fetching words from Firestore"
- ✅ Second request: Functions log shows "Serving words from cache"
- ✅ Firestore reads only happen on first request

### Test 3: Cache Expiration

**Objective**: Verify that caches expire correctly.

**Client Cache Expiration (Fast Test):**

1. **Manually expire localStorage cache**:

   ```javascript
   // Get current cache data
   const currentCache = localStorage.getItem("nerd-wordle-words_v1");
   if (currentCache) {
     const parsed = JSON.parse(currentCache);
     // Set timestamp to 25 hours ago
     parsed.timestamp = Date.now() - 25 * 60 * 60 * 1000;
     localStorage.setItem("nerd-wordle-words_v1", JSON.stringify(parsed));
   }
   ```

2. **Refresh page**:
   - Should see "Cache miss, fetching from API"
   - Should make new API call

**Server Cache Expiration (1 hour wait):**

- Wait 1 hour after server cache is populated
- Make request and check Functions logs for cache miss

### Test 4: Performance Measurement

**Objective**: Measure actual performance improvements.

**Tools:**

```javascript
// Add this to browser console to measure load times
console.time("Words Loading");
// Then refresh page
// Check console for timing results
```

**Metrics to Track:**

- **Time to Interactive**: How long until words are available
- **API Response Time**: Server response duration
- **Total Load Time**: From page load to words ready

**Expected Improvements:**

- ✅ Cache hit: < 100ms total load time
- ✅ Cache miss: Varies based on network, but faster API response due to server cache

### Test 5: Firestore Read Count Verification

**Objective**: Confirm dramatic reduction in Firestore reads.

**Steps:**

1. **Baseline measurement**:

   - Note current Firestore read count in console
   - Record timestamp

2. **Simulate user activity**:

   - Load app multiple times
   - Use different browsers/incognito windows
   - Have friends test the app

3. **Measure after 24 hours**:
   - Check Firestore usage dashboard
   - Calculate reads per user

**Expected Results:**

- ✅ Reads should be ~3000 per day (not per user)
- ✅ Multiple users within same hour = only 1 set of Firestore reads

## 🚨 Troubleshooting Common Issues

### Cache Not Working

**Symptoms:**

- Every page load shows "Cache miss"
- API calls on every refresh
- No data in localStorage

**Debug Steps:**

1. Check browser console for errors
2. Verify localStorage is enabled (not in private browsing)
3. Check if Functions deployment was successful
4. Verify API endpoint is correct

### Server Cache Not Persisting

**Symptoms:**

- Functions logs always show "Cache miss, fetching words from Firestore"
- Multiple users trigger Firestore reads

**Debug Steps:**

1. Check Functions logs for deployment success
2. Verify cache variables are declared outside request handlers
3. Consider cold start behavior (Functions may restart)

### Performance Not Improved

**Symptoms:**

- Load times still slow
- API responses taking >1 second

**Debug Steps:**

1. Check Network tab for actual response times
2. Verify cache is being used (check console logs)
3. Test with cache explicitly cleared vs. cache hit scenarios

## 📊 Success Metrics

### Quantitative Metrics

**Before Optimization:**

- Firestore reads: 3000 per app load
- API response time: 2-3 seconds
- Load time: 3+ seconds

**After Optimization (Target):**

- Firestore reads: <100 per day total
- API response time: <100ms (cache hit)
- Load time: <500ms (cache hit)

### Qualitative Indicators

**Console Logs to Look For:**

- ✅ `"Loading words from localStorage cache"` (client cache hit)
- ✅ `"Serving words from cache"` (server cache hit)
- ✅ `"Cache miss, fetching from API"` (expected occasionally)
- ✅ `"Cache miss, fetching words from Firestore"` (expected rarely)

**Firebase Dashboard:**

- ✅ Firestore reads graph shows dramatic drop
- ✅ Functions execution count may increase, but Firestore reads decrease
- ✅ Overall Firebase costs decrease significantly

## 🔄 Automated Testing (Future)

### Unit Tests

```typescript
// Example test for cache logic
describe("WordDataContext Caching", () => {
  it("should load from localStorage when cache is valid", () => {
    // Mock localStorage with recent timestamp
    // Verify no API call is made
  });

  it("should fetch from API when cache is expired", () => {
    // Mock localStorage with old timestamp
    // Verify API call is made
  });
});
```

### Integration Tests

```typescript
// Example test for server cache
describe("API Caching", () => {
  it("should serve from cache on subsequent requests", async () => {
    // Make first request, verify Firestore read
    // Make second request, verify no Firestore read
  });
});
```

## 🎯 Quick Test Script

Copy and paste this into your browser console for a quick test:

```javascript
// Quick Cache Test Script
console.log("🧪 Testing Cache System...");

// Check localStorage cache using new utility structure
const cachedData = localStorage.getItem("nerd-wordle-words_v1");

if (cachedData) {
  try {
    const parsed = JSON.parse(cachedData);
    const age = Date.now() - parsed.timestamp;
    const hoursOld = (age / (1000 * 60 * 60)).toFixed(1);
    console.log(`✅ localStorage cache exists (${hoursOld} hours old)`);
    console.log(`📝 Cached ${parsed.count || parsed.words.length} words`);
    console.log(`🔍 Cache structure:`, {
      wordsCount: parsed.words?.length,
      timestamp: new Date(parsed.timestamp).toLocaleString(),
      isValid: age < 24 * 60 * 60 * 1000,
    });
  } catch (error) {
    console.log("❌ Cache data corrupted:", error);
  }
} else {
  console.log("❌ No localStorage cache found");
}

// Monitor network requests
const originalFetch = window.fetch;
window.fetch = function (...args) {
  if (args[0].includes("/words")) {
    console.log("🌐 API call made to /words endpoint");
  }
  return originalFetch.apply(this, args);
};

console.log("✅ Test setup complete. Refresh page to see cache behavior.");
```

---

_Run these tests regularly to ensure your optimization continues working as expected!_
