import { View, StyleSheet } from "react-native";
import { range } from "../utils/range";
import LetterBox from "./LetterBox";
import { Word } from "@/constants/words";
import { spacing } from "@/constants/styles";

export type GuessRowProps = {
  currentGuess: string;
  answer: Word;
  isCurrentGuess: boolean;
  invalidWord: boolean;
};

const GuessRow = ({
  currentGuess,
  answer,
  isCurrentGuess,
  invalidWord,
}: GuessRowProps) => {
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
          <View key={letterIndex} style={styles.letterBox}>
            <LetterBox
              letter={letter}
              isCorrect={isCorrect}
              isPresent={isPresent}
              isCurrentGuess={isCurrentGuess}
              invalidWord={invalidWord}
            />
          </View>
        );
      })}
    </View>
  );
};

export default GuessRow;

const styles = StyleSheet.create({
  guessRow: {
    flexDirection: "row",
  },
  letterBox: {
    padding: spacing.xs,
  },
});
