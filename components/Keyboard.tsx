import {
  borderRadius,
  colors,
  fontFamily,
  fontSize,
  spacing,
} from "@/constants/styles";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useContext } from "react";
import { GameContext } from "@/context/GameContext";
import { getKeyboardLetterState } from "@/utils/letter-validation";
import { useDevice } from "@/hooks/useDevice";
import { isDebugLoggingEnabled } from "@/utils/dev-flags";

const KEY_HEIGHT = 50;
const KEY_MIN_WIDTH = 28;
const KEY_MAX_WIDTH = 32;
const WIDE_KEY_MIN_WIDTH = 56;
const WIDE_KEY_MAX_WIDTH = 64;

const KEYBOARD_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"],
];

export const Keyboard = () => {
  const { guesses, answer, handleKeyPress } = useContext(GameContext);
  const { isDesktop, isTablet } = useDevice();

  // Increase key sizes by 50% for desktop/tablet
  const isLargerDevice = isDesktop || isTablet;
  const scaleFactor = isLargerDevice ? 1.33 : 1;
  const keyMinWidth = KEY_MIN_WIDTH * scaleFactor;
  const keyMaxWidth = KEY_MAX_WIDTH * scaleFactor;
  const wideKeyMinWidth = WIDE_KEY_MIN_WIDTH * scaleFactor;
  const wideKeyMaxWidth = WIDE_KEY_MAX_WIDTH * scaleFactor;
  const keyHeight = KEY_HEIGHT * scaleFactor;

  const getKeyStatus = (key: string) => {
    const guessStrings = guesses.map((guess) => guess.id);
    return getKeyboardLetterState(key, guessStrings, answer);
  };

  // Handle layout measurement to log actual rendered width
  const handleLayout = (event: any) => {
    const { width } = event.nativeEvent.layout;
    if (isDebugLoggingEnabled()) {
      console.log(`⌨️ Keyboard: Actual rendered width: ${width}px`);
    }
  };

  return (
    <View style={styles.container} onLayout={handleLayout}>
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.keyboardRow}>
          {row.map((key, keyIndex) => {
            const status = getKeyStatus(key);
            const isWideKey = key === "ENTER" || key === "BACKSPACE";

            return (
              <TouchableOpacity
                key={keyIndex}
                style={[
                  styles.key,
                  {
                    minWidth: isWideKey ? wideKeyMinWidth : keyMinWidth,
                    maxWidth: isWideKey ? wideKeyMaxWidth : keyMaxWidth,
                    height: keyHeight,
                  },
                  status === "correct" && {
                    backgroundColor: colors.semantic.success,
                  },
                  status === "present" && styles.presentKey,
                  status === "absent" && styles.absentKey,
                ]}
                onPress={() => handleKeyPress(key)}
              >
                <Text style={styles.keyText}>
                  {key === "BACKSPACE" ? "DEL" : key}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: spacing.sm,
  },
  keyboardRow: {
    flexDirection: "row",
    gap: spacing.xs,
    justifyContent: "center",
  },
  key: {
    backgroundColor: colors.neutral.lightGray,
    borderRadius: borderRadius.sm,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  keyText: {
    fontSize: fontSize.body.base,
    fontFamily: fontFamily.openSans.bold,
    color: colors.neutral.black,
  },
  presentKey: {
    backgroundColor: colors.tiles.wrongPlace,
  },
  absentKey: {
    backgroundColor: colors.neutral.darkGray,
  },
});
