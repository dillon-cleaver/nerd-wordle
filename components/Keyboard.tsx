import {
  borderRadius,
  colors,
  fontFamily,
  fontSize,
  lineHeight,
  spacing,
} from "@/constants/styles";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useContext } from "react";
import { GameContext } from "@/context/GameContext";
import { getKeyboardLetterState } from "@/utils/letter-validation";
import { useDevice } from "@/hooks/useDevice";
import { isDebugLoggingEnabled } from "@/utils/dev-flags";

const DESKTOP_KEYBOARD_GAP = 6;

const KEY_HEIGHT = 50;

const KEY_MIN_WIDTH = 28;
const KEY_MAX_WIDTH = 34;

const WIDE_KEY_MIN_WIDTH = 56;
const WIDE_KEY_MAX_WIDTH = 68;

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
  const scaleFactor = isLargerDevice ? 1.25 : 1;
  const keyMinWidth = KEY_MIN_WIDTH * scaleFactor;
  const keyMaxWidth = KEY_MAX_WIDTH * scaleFactor;
  const wideKeyMinWidth = WIDE_KEY_MIN_WIDTH * scaleFactor;
  const wideKeyMaxWidth = WIDE_KEY_MAX_WIDTH * scaleFactor;
  const keyHeight = KEY_HEIGHT * scaleFactor;
  const keyTextSize = fontSize.body.base * scaleFactor;
  const keyboardRowGap = isLargerDevice ? DESKTOP_KEYBOARD_GAP : spacing.xs;
  const keyboardContainerGap = isLargerDevice
    ? DESKTOP_KEYBOARD_GAP
    : spacing.xs;

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
    <View style={{ gap: keyboardContainerGap }} onLayout={handleLayout}>
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <View
          key={rowIndex}
          style={[styles.keyboardRow, { gap: keyboardRowGap }]}
        >
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
                <Text style={[styles.keyText, { fontSize: keyTextSize }]}>
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
  keyboardRow: {
    flexDirection: "row",
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
    lineHeight: lineHeight.body.base,
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
