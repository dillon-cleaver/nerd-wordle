import { View, StyleSheet, Text } from "react-native";
import {
  borderRadius,
  colors,
  fontFamily,
  fontSize,
  spacing,
} from "@/constants/styles";

type GameBannerProps = {
  gameStatus: "won" | "running" | "lost";
  numGuesses?: number;
  answer?: string;
};

export const GameBanner = ({ gameStatus, numGuesses, answer }: GameBannerProps) => {
  if (gameStatus === "running") return null;

  return (
    <View style={styles.container}>
      <Text style={styles.bannerText}>
        {gameStatus === "won"
          ? `Congratulations! You won in ${numGuesses} guesses!`
          : `Sorry, you lost! The answer was ${answer}`}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.semantic.success,
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  bannerText: {
    color: colors.neutral.white,
    fontSize: fontSize.title.base,
    fontFamily: fontFamily.bitter.bold,
  },
});
