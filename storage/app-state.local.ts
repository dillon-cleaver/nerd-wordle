import AsyncStorage from "@react-native-async-storage/async-storage";
import { isDebugLoggingEnabled } from "@/utils/dev-flags";

const INFO_MODAL_SHOWN_KEY = "nerd-wordle-info-modal-shown_v1";

export const saveInfoModalShown = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(INFO_MODAL_SHOWN_KEY, "true");
    if (isDebugLoggingEnabled()) {
      console.log("Saved InfoModal shown state to AsyncStorage");
    }
  } catch (error) {
    console.error(
      "Failed to save InfoModal shown state to AsyncStorage:",
      error
    );
  }
};

export const hasInfoModalBeenShown = async (): Promise<boolean> => {
  try {
    const shown = await AsyncStorage.getItem(INFO_MODAL_SHOWN_KEY);
    return shown === "true";
  } catch (error) {
    console.error(
      "Failed to read InfoModal shown state from AsyncStorage:",
      error
    );
    return false; // Default to showing the modal if we can't read the state
  }
};

export const clearInfoModalShownState = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(INFO_MODAL_SHOWN_KEY);
    if (isDebugLoggingEnabled()) {
      console.log("InfoModal shown state cleared");
    }
  } catch (error) {
    console.error("Failed to clear InfoModal shown state:", error);
  }
};
