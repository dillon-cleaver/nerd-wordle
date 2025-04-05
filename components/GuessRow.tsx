import { View, StyleSheet } from "react-native";
import { range } from "../utils/range";
import LetterBox from "./LetterBox";

export type GuessRowProps = {
  currentGuess: string;
  answer: string;
  isCurrentGuess: boolean;
};

const GuessRow = ({ currentGuess, answer, isCurrentGuess }: GuessRowProps) => {
  return (
    <View style={styles.guessRow}>
      {range(0, 5).map((letterIndex) => {
        const letter = currentGuess[letterIndex] || "";

        // Simple direct comparison for correct position
        const isCorrect = letter === answer[letterIndex];

        // Check if letter is present but not correct
        const isPresent =
          !isCorrect && letter !== "" && answer.includes(letter);

        return (
          <LetterBox
            key={letterIndex}
            letter={letter}
            isCorrect={isCorrect}
            isPresent={isPresent}
            isCurrentGuess={isCurrentGuess}
          />
        );
      })}
    </View>
  );
};

export default GuessRow;

const styles = StyleSheet.create({
  guessRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
});
