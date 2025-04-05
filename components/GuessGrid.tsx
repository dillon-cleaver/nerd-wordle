import { View, StyleSheet } from "react-native";
import { range } from "../utils/range";
import GuessRow from "./GuessRow";

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
      {range(0, numGuesses).map((rowIndex) => {
        // If this is the current row and we have a tentative guess, show it
        const currentGuess =
          rowIndex === guesses.length
            ? tentativeGuess
            : guesses[rowIndex] || "";
        const isCurrentGuess = rowIndex === guesses.length;

        return (
          <GuessRow
            key={rowIndex}
            currentGuess={currentGuess}
            answer={answer}
            isCurrentGuess={isCurrentGuess}
          />
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
});
