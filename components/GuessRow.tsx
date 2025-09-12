import { View, StyleSheet } from "react-native";
import { range } from "../utils/range";
import LetterBox from "./LetterBox";
import { spacing } from "@/constants/styles";
import { WordId } from "@/types/word";

export type GuessRowProps = {
  currentGuess: string;
  answer: WordId;
  isCurrentGuess: boolean;
  invalidWord: boolean;
  hint?: {
    col: number;
    letter: string;
  };
  onPressHint?: () => void;
};

const GuessRow = ({
  currentGuess,
  answer,
  isCurrentGuess,
  invalidWord,
  hint,
  onPressHint,
}: GuessRowProps) => {
  const WORD_LENGTH = 5;

  // Defensive coding: ensure currentGuess is always a string
  const safeCurrentGuess = currentGuess || "";
  // Defensive coding: ensure answer is valid during loading state
  const safeAnswer =
    answer && answer !== "LOADING" ? answer : " ".repeat(WORD_LENGTH);

  return (
    <View style={styles.guessRow}>
      {range(0, WORD_LENGTH).map((letterIndex) => {
        const letter = safeCurrentGuess[letterIndex] || "";

        const isCorrect = letter === safeAnswer[letterIndex];

        const isPresent =
          !isCorrect && letter !== "" && safeAnswer.includes(letter);

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
              onPressHint={shouldShowHint ? onPressHint : undefined}
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
