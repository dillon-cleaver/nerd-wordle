import { View, StyleSheet, Text } from "react-native";
import {
  borderRadius,
  colors,
  fontFamily,
  fontSize,
  spacing,
} from "@/constants/styles";
import { WORD_CARD_GUESS_GRID_MIN_WIDTH } from "@/constants/dimensions";

type GameBannerProps = {
  gameStatus: "won" | "running" | "lost";
  numGuesses?: number;
  answer?: string;
};

export const GameBanner = ({
  gameStatus,
  numGuesses,
  answer,
}: GameBannerProps) => {
  if (gameStatus === "running") return null;

  return (
    <View style={styles.container}>
      <Text style={styles.bannerText}>
        {gameStatus === "won"
          ? `Congratulations! You won in ${numGuesses} ${
              numGuesses === 1 ? "guess" : "guesses"
            }!`
          : `Sorry, you lost! The answer was ${answer}`}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.semantic.success,
    minWidth: WORD_CARD_GUESS_GRID_MIN_WIDTH,
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  bannerText: {
    color: colors.neutral.white,
    fontSize: fontSize.title.base,
    fontFamily: fontFamily.bitter.bold,
  },
});
