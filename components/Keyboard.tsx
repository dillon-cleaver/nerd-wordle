import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

type KeyboardProps = {
  guesses: string[];
  answer: string;
  onKeyPress: (key: string) => void;
};

const KEYBOARD_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "⌫"],
];

const Keyboard = ({ guesses, answer, onKeyPress }: KeyboardProps) => {
  const getKeyStatus = (key: string) => {
    // Check if the key has been used in any guess
    const hasBeenUsed = guesses.some((guess) => guess.includes(key));
    if (!hasBeenUsed) return null;

    // Check if it's correct in any position
    const isCorrect = guesses.some((guess) => {
      return guess
        .split("")
        .some((letter, index) => letter === key && key === answer[index]);
    });
    if (isCorrect) return "correct";

    // Check if it's present but wrong position
    const isPresent = answer.includes(key);
    if (isPresent) return "present";

    // If used but not correct or present, it's absent
    return "absent";
  };

  return (
    <View style={styles.keyboard}>
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.keyboardRow}>
          {row.map((key, keyIndex) => {
            const status = getKeyStatus(key);
            const isWideKey = key === "ENTER" || key === "⌫";

            return (
              <TouchableOpacity
                key={keyIndex}
                style={[
                  styles.key,
                  isWideKey && styles.wideKey,
                  status === "correct" && styles.correctKey,
                  status === "present" && styles.presentKey,
                  status === "absent" && styles.absentKey,
                ]}
                onPress={() => onKeyPress(key)}
              >
                <Text style={styles.keyText}>{key}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
};

export default Keyboard;

const styles = StyleSheet.create({
  keyboard: {
    marginTop: 32,
    width: "100%",
  },
  keyboardRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 8,
  },
  key: {
    backgroundColor: "#d3d6da",
    borderRadius: 4,
    padding: 8,
    margin: 2,
    minWidth: 30,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  wideKey: {
    minWidth: 50,
  },
  keyText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  correctKey: {
    backgroundColor: "#6aaa64",
  },
  presentKey: {
    backgroundColor: "#c9b458",
  },
  absentKey: {
    backgroundColor: "#787c7e",
  },
});
