import { useEffect, useContext } from "react";
import { useDevice } from "@/hooks/useDevice";
import { GameContext } from "@/context/GameContext";
import { isDebugLoggingEnabled } from "@/utils/dev-flags";

/**
 * Global keyboard shortcuts for navigation and accessibility
 * Only active on desktop devices
 */
export const useAccessibilityKeyboard = (callbacks: {
  openInfoModal?: () => void;
  closeInfoModal?: () => void;
  closeHintModal?: () => void;
  focusGameInput?: () => void;
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
          // Priority: Close modals first, then other actions
          if (callbacks.closeHintModal) {
            callbacks.closeHintModal();
          } else if (callbacks.closeInfoModal) {
            callbacks.closeInfoModal();
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
            if (callbacks.openInfoModal) {
              callbacks.openInfoModal();
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
            if (callbacks.focusGameInput) {
              callbacks.focusGameInput();
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
            if (callbacks.openInfoModal) {
              callbacks.openInfoModal();
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
