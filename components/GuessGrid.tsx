import * as React from "react";
import { View, StyleSheet, Text } from "react-native";
import { range } from "../utils/range";

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
              const isCorrect = letter === answer[letterIndex];
              const isPresent = answer.includes(letter);

              return (
                <View
                  key={letterIndex}
                  style={[
                    styles.letterBox,
                    !isCurrentGuess && isCorrect && styles.correct,
                    !isCurrentGuess &&
                      !isCorrect &&
                      isPresent &&
                      styles.present,
                    !isCurrentGuess &&
                      !isCorrect &&
                      !isPresent &&
                      letter &&
                      styles.absent,
                  ]}
                >
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
    marginBottom: 8,
  },
  letterBox: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    margin: 4,
  },
  letter: {
    fontSize: 24,
    fontWeight: "bold",
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
