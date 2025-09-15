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
  const { guesses, answer, tentativeGuess, invalidWord, hint, isLoading } =
    useContext(GameContext);

  const { isDesktop, isTablet } = useDevice();

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
    !isDesktop && !isTablet
      ? {
          minWidth: MOBILE_BANNER_GUESS_GRID_MIN_WIDTH,
          maxWidth: MOBILE_BANNER_GUESS_GRID_MAX_WIDTH,
        }
      : {
          minWidth: DESKTOP_BANNER_GUESS_GRID_MIN_WIDTH,
          maxWidth: DESKTOP_BANNER_GUESS_GRID_MAX_WIDTH,
        },
  ];

  // Handle layout measurement to log actual rendered width
  const handleLayout = (event: any) => {
    const { width } = event.nativeEvent.layout;
    if (isDebugLoggingEnabled()) {
      console.log(
        `📏 GuessGrid: Actual rendered width: ${width}px (${
          isDesktop ? "desktop" : "mobile"
        } mode)`
      );
    }
  };

  return (
    <View style={containerStyle} onLayout={handleLayout}>
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
