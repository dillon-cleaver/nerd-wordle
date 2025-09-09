import { isDebugLoggingEnabled } from "@/utils/dev-flags";

const INFO_MODAL_SHOWN_KEY = "nerd-wordle-info-modal-shown_v1";

export const saveInfoModalShown = (): void => {
  try {
    localStorage.setItem(INFO_MODAL_SHOWN_KEY, "true");
    if (isDebugLoggingEnabled()) {
      console.log("✅ Saved InfoModal shown state to localStorage");
    }
  } catch (error) {
    console.error("Failed to save InfoModal shown state to localStorage:", error);
  }
};

export const hasInfoModalBeenShown = (): boolean => {
  try {
    const shown = localStorage.getItem(INFO_MODAL_SHOWN_KEY);
    return shown === "true";
  } catch (error) {
    console.error("Failed to read InfoModal shown state from localStorage:", error);
    return false; // Default to showing the modal if we can't read the state
  }
};

export const clearInfoModalShownState = (): void => {
  try {
    localStorage.removeItem(INFO_MODAL_SHOWN_KEY);
    if (isDebugLoggingEnabled()) {
      console.log("✅ InfoModal shown state cleared");
    }
  } catch (error) {
    console.error("Failed to clear InfoModal shown state:", error);
  }
};
