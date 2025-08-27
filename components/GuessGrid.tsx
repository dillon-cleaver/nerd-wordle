import { range } from "../utils/range";
import GuessRow from "./GuessRow";
import { useContext } from "react";
import { GameContext } from "@/context/GameContext";
import { NUMBER_OF_GUESSES } from "@/constants/numbers";
import { View, StyleSheet } from "react-native";
import {
  BANNER_GUESS_GRID_MAX_WIDTH,
  BANNER_GUESS_GRID_MIN_WIDTH,
} from "@/constants/dimensions";
import { isDebugLoggingEnabled } from "@/utils/dev-flags";

export const GuessGrid = () => {
  const {
    guesses,
    answer,
    tentativeGuess,
    invalidWord,
    hint,
    originalCategory,
    isLoading,
  } = useContext(GameContext);

  // Debug hint state
  if (hint && isDebugLoggingEnabled()) {
    console.log(`🎯 GuessGrid: Received hint:`, hint);
  }

  // Prevent rendering during initial load to avoid crashes with undefined answer
  // Only block if actively loading AND no valid answer yet
  if (isLoading && (!answer || answer === "LOADING")) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      {range(0, NUMBER_OF_GUESSES).map((rowIndex) => {
        const currentGuess =
          rowIndex === guesses.length
            ? tentativeGuess || ""
            : guesses[rowIndex]?.id || "";
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
    minWidth: BANNER_GUESS_GRID_MIN_WIDTH,
    maxWidth: BANNER_GUESS_GRID_MAX_WIDTH,
    width: "100%",
  },
});
