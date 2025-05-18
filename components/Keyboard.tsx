import {
  borderRadius,
  colors,
  fontFamily,
  fontSize,
  spacing,
} from "@/constants/styles";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

const KEY_HEIGHT = 50;
const KEY_MIN_WIDTH = 32;
const WIDE_KEY_MIN_WIDTH = 52;

const KEYBOARD_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"],
];
type KeyboardProps = {
  guesses: string[];
  answer: string;
  onKeyPress: (key: string) => void;
  category: string;
};

export const Keyboard = ({
  guesses,
  answer,
  onKeyPress,
  category,
}: KeyboardProps) => {
  const tileBackgroundColor =
    category === "videoGames"
      ? colors.categories.videoGames
      : category === "science"
      ? colors.categories.science
      : category === "fantasyAndSciFi"
      ? colors.categories.fantasyAndSciFi
      : category === "animeAndManga"
      ? colors.categories.animeAndManga
      : category === "tabletopAndBoardGames"
      ? colors.categories.tabletopAndBoardGames
      : colors.categories.techAndInternetCulture;

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
                onPress={() => onKeyPress(key)}
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
    padding: spacing.sm,
    minWidth: KEY_MIN_WIDTH,
    height: KEY_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  wideKey: {
    minWidth: WIDE_KEY_MIN_WIDTH,
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
