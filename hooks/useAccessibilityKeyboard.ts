import { useEffect, useContext } from "react";
import { useDevice } from "@/hooks/useDevice";
import { GameContext } from "@/context/GameContext";
import { isDebugLoggingEnabled } from "@/utils/dev-flags";

/**
 * Global keyboard shortcuts for navigation and accessibility
 * Only active on desktop devices
 */
export const useAccessibilityKeyboard = (callbacks: {
  onEscape?: () => void;
  onHelp?: () => void;
  onFocus?: () => void;
  [key: string]: (() => void) | undefined;
}) => {
  const { isDesktop } = useDevice();
  const { gameStatus } = useContext(GameContext);

  useEffect(() => {
    if (!isDesktop) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when user is typing in the game
      const isTyping =
        gameStatus === "running" &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.altKey;

      // Handle different key combinations
      switch (event.key) {
        case "Escape":
          event.preventDefault();
          if (callbacks.onEscape) {
            callbacks.onEscape();
          }

          if (isDebugLoggingEnabled()) {
            console.log(
              "🔑 Accessibility: Escape key pressed - closing modals"
            );
          }
          break;

        case "h":
        case "H":
          // Ctrl/Cmd + H = Toggle help/info modal
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            if (callbacks.onHelp) {
              callbacks.onHelp();
            }

            if (isDebugLoggingEnabled()) {
              console.log(
                "🔑 Accessibility: Ctrl+H pressed - opening info modal"
              );
            }
          }
          break;

        case "g":
        case "G":
          // Ctrl/Cmd + G = Focus game input (for screen readers)
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            if (callbacks.onFocus) {
              callbacks.onFocus();
            }

            if (isDebugLoggingEnabled()) {
              console.log("🔑 Accessibility: Ctrl+G pressed - focusing game");
            }
          }
          break;

        case "?":
          // Shift + ? = Show help (alternative to Ctrl+H)
          if (event.shiftKey && !isTyping) {
            event.preventDefault();
            if (callbacks.onHelp) {
              callbacks.onHelp();
            }

            if (isDebugLoggingEnabled()) {
              console.log("🔑 Accessibility: ? pressed - opening help");
            }
          }
          break;

        default:
          // Don't handle other keys
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    if (isDebugLoggingEnabled()) {
      console.log("🔑 Accessibility keyboard shortcuts enabled");
      console.log("   • Escape: Close modals");
      console.log("   • Ctrl+H or ?: Open help");
      console.log("   • Ctrl+G: Focus game");
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);

      if (isDebugLoggingEnabled()) {
        console.log("🔑 Accessibility keyboard shortcuts disabled");
      }
    };
  }, [isDesktop, gameStatus, callbacks]);
};
