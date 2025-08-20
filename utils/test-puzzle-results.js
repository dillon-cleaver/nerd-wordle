/**
 * Test utilities for debugging daily puzzle result detection
 * Use these functions in the browser console to test different scenarios
 */

/**
 * Clear localStorage puzzle results (simulates new browser/device)
 */
window.clearPuzzleResults = () => {
  localStorage.removeItem("puzzleResults_v1");
  console.log("🧹 Cleared localStorage puzzle results");
  window.location.reload();
};

/**
 * View current localStorage puzzle results
 */
window.viewLocalPuzzleResults = () => {
  const results = localStorage.getItem("puzzleResults_v1");
  if (results) {
    const parsed = JSON.parse(results);
    console.log("📱 Local puzzle results:", parsed);
    return parsed;
  } else {
    console.log("📱 No local puzzle results found");
    return [];
  }
};

/**
 * Add a fake puzzle result for today (for testing)
 */
window.addTodaysPuzzleResult = (
  word = "JOKER",
  status = "win",
  attempts = 1
) => {
  const results = JSON.parse(localStorage.getItem("puzzleResults_v1") || "[]");
  const today = new Date().toISOString();
  const fakeResult = {
    id: crypto.randomUUID(),
    word: word,
    edition: 1,
    date: today,
    guesses: attempts,
    hintIndex: 0,
    status: status,
  };

  // Remove any existing result for today
  const filtered = results.filter(
    (r) => new Date(r.date).toDateString() !== new Date().toDateString()
  );

  filtered.push(fakeResult);
  localStorage.setItem("puzzleResults_v1", JSON.stringify(filtered));
  console.log("🎮 Added fake puzzle result for today:", fakeResult);
  window.location.reload();
};

/**
 * Test cross-browser scenario: Remove local results but keep user logged in
 */
window.simulateDifferentBrowser = () => {
  window.clearPuzzleResults();
  console.log(
    "🌐 Simulated different browser - localStorage cleared but user still authenticated"
  );
};

console.log("🧪 Test utilities loaded! Available functions:");
console.log("- clearPuzzleResults() - Clear localStorage puzzle results");
console.log(
  "- viewLocalPuzzleResults() - View current localStorage puzzle results"
);
console.log(
  "- addTodaysPuzzleResult(word, status, attempts) - Add fake result for today"
);
console.log(
  "- simulateDifferentBrowser() - Clear local data but keep user logged in"
);
