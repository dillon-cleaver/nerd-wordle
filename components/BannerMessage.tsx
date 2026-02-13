import { Text, StyleSheet } from "react-native";
import { colors, fontFamily, fontSize, lineHeight } from "@/constants/styles";

type BannerMessageProps = {
  gameStatus: "won" | "lost";
  numGuesses?: number;
};

export const BannerMessage = ({
  gameStatus,
  numGuesses,
}: BannerMessageProps) => (
  <Text style={styles.bannerText}>
    {gameStatus === "won"
      ? `CONGRATULATIONS! You got it in ${numGuesses} ${
          numGuesses === 1 ? "guess" : "guesses"
        }!`
      : `GAME OVER! Better luck tomorrow!`}
  </Text>
);

const styles = StyleSheet.create({
  bannerText: {
    color: colors.neutral.white,
    fontSize: fontSize.title.base,
    lineHeight: lineHeight.title.base,
    fontFamily: fontFamily.bitter.bold,
  },
});
