import { View, StyleSheet, Text, StyleProp, ViewStyle } from "react-native";
import { borderRadius, colors } from "@/constants/styles";

export type LetterBoxProps = {
  letter: string;
  isCorrect: boolean;
  isPresent: boolean;
  isCurrentGuess: boolean;
};

const LetterBox = ({
  letter,
  isCorrect,
  isPresent,
  isCurrentGuess,
}: LetterBoxProps) => {
  // Use StyleProp<ViewStyle> for the combined styles
  const cellStyles: StyleProp<ViewStyle> = [styles.letterBox];

  if (!isCurrentGuess && letter) {
    if (isCorrect) {
      cellStyles.push(styles.correct);
    } else if (isPresent) {
      cellStyles.push(styles.present);
    } else {
      cellStyles.push(styles.absent);
    }
  }

  return (
    <View style={cellStyles}>
      <Text style={styles.letter}>{letter}</Text>
    </View>
  );
};

export default LetterBox;

const styles = StyleSheet.create({
  letterBox: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    margin: 4,
    borderRadius: borderRadius.sm,
  },
  letter: {
    fontFamily: "Bitter-Bold",
    fontSize: 24,
    color: colors.text.primary,
  },
  correct: {
    backgroundColor: "#6aaa64",
    borderColor: "#6aaa64",
  },
  present: {
    backgroundColor: "#c9b458",
    borderColor: "#c9b458",
  },
  absent: {
    backgroundColor: "#787c7e",
    borderColor: "#787c7e",
  },
});
