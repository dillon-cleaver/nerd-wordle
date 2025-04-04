import { View, StyleSheet, Text, ViewStyle } from "react-native";
import { range } from "../utils/range";
import { borderRadius, colors } from "@/constants/styles";

type GuessGridProps = {
  guesses: string[];
  answer: string;
  numGuesses: number;
  tentativeGuess: string;
};

const GuessGrid = ({
  guesses,
  answer,
  numGuesses,
  tentativeGuess,
}: GuessGridProps) => {
  return (
    <View style={styles.guessResults}>
      {range(0, numGuesses).map((item) => {
        // If this is the current row and we have a tentative guess, show it
        const currentGuess =
          item === guesses.length ? tentativeGuess : guesses[item] || "";
        const isCurrentGuess = item === guesses.length;

        return (
          <View key={item} style={styles.guessRow}>
            {range(0, 5).map((letterIndex) => {
              const letter = currentGuess[letterIndex] || "";

              // Simple direct comparison for correct position
              const isCorrect = letter === answer[letterIndex];

              // Check if letter is present but not correct
              const isPresent =
                !isCorrect && letter !== "" && answer.includes(letter);

              // Determine cell style
              const cellStyle: ViewStyle[] = [styles.letterBox];
              if (!isCurrentGuess && letter) {
                if (isCorrect) {
                  cellStyle.push(styles.correct as ViewStyle);
                } else if (isPresent) {
                  cellStyle.push(styles.present as ViewStyle);
                } else {
                  cellStyle.push(styles.absent as ViewStyle);
                }
              }

              return (
                <View key={letterIndex} style={cellStyle}>
                  <Text style={styles.letter}>{letter}</Text>
                </View>
              );
            })}
          </View>
        );
      })}
    </View>
  );
};

export default GuessGrid;

const styles = StyleSheet.create({
  guessResults: {
    marginBottom: 32,
  },
  guessRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
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
