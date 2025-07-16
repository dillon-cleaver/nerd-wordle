import { View, StyleSheet } from "react-native";
import { range } from "../utils/range";
import LetterBox from "./LetterBox";
import { spacing } from "@/constants/styles";
import { Word } from "@/types/word";

export type GuessRowProps = {
  currentGuess: string;
  answer: Word;
  isCurrentGuess: boolean;
  invalidWord: boolean;
  hint?: {
    col: number;
    letter: string;
  };
  category: string;
};

const GuessRow = ({
  currentGuess,
  answer,
  isCurrentGuess,
  invalidWord,
  hint,
  category,
}: GuessRowProps) => {
  return (
    <View style={styles.guessRow}>
      {range(0, 5).map((letterIndex) => {
        const letter = currentGuess[letterIndex] || "";

        const isCorrect = letter === answer[letterIndex];

        const isPresent =
          !isCorrect && letter !== "" && answer.includes(letter);

        const shouldShowHint = !!hint && hint.col === letterIndex;

        return (
          <View key={letterIndex} style={styles.letterBox}>
            <LetterBox
              letter={letter}
              isCorrect={isCorrect}
              isPresent={isPresent}
              isCurrentGuess={isCurrentGuess}
              invalidWord={invalidWord}
              showHint={shouldShowHint}
              hintLetter={hint?.letter ?? ""}
              category={category}
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
    paddingVertical: spacing.xs,
    gap: spacing.sm,
    justifyContent: "space-between",
  },
  letterBox: {
    flex: 1,
  },
});
