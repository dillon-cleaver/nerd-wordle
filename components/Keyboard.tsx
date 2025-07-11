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
import { getCategoryColor } from "@/utils/game";

// TODO: Clean up this code: make it more modular, etc.

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
  const { guesses, answer, handleKeyPress, originalCategory } =
    useContext(GameContext);

  const tileBackgroundColor = getCategoryColor(originalCategory);

  const getKeyStatus = (key: string) => {
    const hasBeenUsed = guesses.some((guess) => guess.includes(key));
    if (!hasBeenUsed) return null;

    const isCorrect = guesses.some((guess) =>
      guess
        .split("")
        .some((letter, index) => letter === key && key === answer[index])
    );
    if (isCorrect) return "correct";

    const isPresent = answer.includes(key);
    if (isPresent) return "present";

    return "absent";
  };

  return (
    <View style={styles.container}>
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
                  isWideKey && styles.wideKey,
                  status === "correct" && {
                    backgroundColor: tileBackgroundColor,
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
    // TODO: Make a base key component --->
    backgroundColor: colors.neutral.lightGray,
    borderRadius: borderRadius.sm,
    flex: 1,
    height: KEY_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
    // ^^ include these props in that base
    minWidth: KEY_MIN_WIDTH,
    maxWidth: KEY_MAX_WIDTH,
  },
  wideKey: {
    minWidth: WIDE_KEY_MIN_WIDTH,
    maxWidth: WIDE_KEY_MAX_WIDTH,
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
