import { range } from "../utils/range";
import GuessRow from "./GuessRow";
import { useContext } from "react";
import { GameContext } from "@/context/GameContext";
import { NUMBER_OF_GUESSES } from "@/constants/numbers";
import { View, StyleSheet } from "react-native";
import {
  WORD_CARD_GUESS_GRID_MAX_WIDTH,
  WORD_CARD_GUESS_GRID_MIN_WIDTH,
} from "@/constants/dimensions";

export const GuessGrid = () => {
  const {
    guesses,
    answer,
    tentativeGuess,
    invalidWord,
    hint,
    originalCategory,
  } = useContext(GameContext);

  return (
    <View style={styles.container}>
      {range(0, NUMBER_OF_GUESSES).map((rowIndex) => {
        const currentGuess =
          rowIndex === guesses.length
            ? tentativeGuess
            : guesses[rowIndex] || "";
        const isCurrentGuess = rowIndex === guesses.length;

        const hintForThisRow =
          hint && hint.row === rowIndex
            ? { col: hint.col, letter: hint.letter }
            : undefined;

        return (
          <GuessRow
            key={rowIndex}
            currentGuess={currentGuess}
            answer={answer}
            isCurrentGuess={isCurrentGuess}
            invalidWord={invalidWord && isCurrentGuess}
            hint={hintForThisRow}
            category={originalCategory}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minWidth: WORD_CARD_GUESS_GRID_MIN_WIDTH,
    maxWidth: WORD_CARD_GUESS_GRID_MAX_WIDTH,
    width: "100%",
  },
});
