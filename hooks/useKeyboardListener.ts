import { useEffect, useContext } from "react";
import { GameContext } from "@/context/GameContext";
import { useDevice } from "@/hooks/useDevice";
import { isDebugLoggingEnabled } from "@/utils/dev-flags";

/**
 * Hook that adds keyboard event listeners for desktop users
 * Maps physical keyboard input to the game's handleKeyPress function
 * Only active on desktop devices and when game is running
 */
export const useKeyboardListener = () => {
  const { handleKeyPress, gameStatus } = useContext(GameContext);
  const { isDesktop } = useDevice();

  useEffect(() => {
    // Only enable keyboard listening on desktop when game is running
    if (!isDesktop || gameStatus !== "running") {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toUpperCase();

      // Don't intercept keys when modifier keys are pressed
      // This allows browser shortcuts like Cmd+R, Ctrl+R, Cmd+F, etc. to work
      if (event.ctrlKey || event.metaKey || event.altKey) {
        return; // Let the browser handle these combinations
      }

      // Handle letter keys (A-Z) - only when no modifiers are pressed
      if (/^[A-Z]$/.test(key)) {
        event.preventDefault(); // Prevent default browser behavior
        handleKeyPress(key);

        if (isDebugLoggingEnabled()) {
          console.log(`Keyboard: Letter key pressed: ${key}`);
        }
      }
      // Handle Enter key
      else if (key === "ENTER") {
        event.preventDefault();
        handleKeyPress("ENTER");

        if (isDebugLoggingEnabled()) {
          console.log(`Keyboard: Enter key pressed`);
        }
      }
      // Handle Backspace/Delete
      else if (key === "BACKSPACE") {
        event.preventDefault();
        handleKeyPress("BACKSPACE");

        if (isDebugLoggingEnabled()) {
          console.log(`Keyboard: Backspace key pressed`);
        }
      }
    };

    // Add event listener to document for global keyboard capture
    document.addEventListener("keydown", handleKeyDown);

    if (isDebugLoggingEnabled()) {
      console.log(`Keyboard: Listener attached for desktop device`);
    }

    // Cleanup function to remove event listener
    return () => {
      document.removeEventListener("keydown", handleKeyDown);

      if (isDebugLoggingEnabled()) {
        console.log(`Keyboard: Listener removed`);
      }
    };
  }, [handleKeyPress, gameStatus, isDesktop]);
};
