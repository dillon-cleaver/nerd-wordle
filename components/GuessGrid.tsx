import { range } from "../utils/range";
import GuessRow from "./GuessRow";
import { useContext } from "react";
import { GameContext } from "@/context/GameContext";
import { NUMBER_OF_GUESSES } from "@/constants/numbers";
import { View, StyleSheet } from "react-native";
import {
  MOBILE_BANNER_GUESS_GRID_MIN_WIDTH,
  DESKTOP_BANNER_GUESS_GRID_MIN_WIDTH,
  MOBILE_BANNER_GUESS_GRID_MAX_WIDTH,
  DESKTOP_BANNER_GUESS_GRID_MAX_WIDTH,
} from "@/constants/dimensions";
import { isDebugLoggingEnabled } from "@/utils/dev-flags";
import { useDevice } from "@/hooks/useDevice";

export const GuessGrid = ({ onPressHint }: { onPressHint?: () => void }) => {
  const {
    guesses,
    answer,
    tentativeGuess,
    invalidWord,
    hint,
    originalCategory,
    isLoading,
  } = useContext(GameContext);

  const { isDesktop } = useDevice();

  // Debug hint state
  if (hint && isDebugLoggingEnabled()) {
    console.log(`🎯 GuessGrid: Received hint:`, hint);
  }

  // Prevent rendering during initial load to avoid layout shifts and empty tile flashing
  // Wait for all loading states including rehydration to complete
  if (isLoading) {
    return <View style={styles.container} />;
  }

  const containerStyle = [
    styles.container,
    !isDesktop
      ? {
          minWidth: MOBILE_BANNER_GUESS_GRID_MIN_WIDTH,
          maxWidth: MOBILE_BANNER_GUESS_GRID_MAX_WIDTH,
        }
      : {
          minWidth: DESKTOP_BANNER_GUESS_GRID_MIN_WIDTH,
          maxWidth: DESKTOP_BANNER_GUESS_GRID_MAX_WIDTH,
        },
  ];

  return (
    <View style={containerStyle}>
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
            onPressHint={onPressHint}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
});
