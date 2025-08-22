/**
 * Simple test utilities for debugging daily puzzle results
 * Available in browser console when dev mode is enabled
 */

// Only load test utilities when dev mode is enabled
if (
  typeof window !== "undefined" &&
  process.env.EXPO_PUBLIC_DEV_MODE === "true"
) {
  /**
   * Clear localStorage puzzle results
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

  console.log("🧪 Test utilities loaded:");
  console.log("- clearPuzzleResults() - Clear localStorage");
  console.log("- viewLocalPuzzleResults() - View current results");
}
