import { Text, StyleSheet } from "react-native";
import { colors, fontFamily, fontSize, lineHeight } from "@/constants/styles";

type BannerTapHintProps = {
  gameStatus: "won" | "lost";
};

export const BannerTapHint = ({ gameStatus }: BannerTapHintProps) => (
  <Text style={styles.hintText}>
    {gameStatus === "won"
      ? "Tap to view your WordCard"
      : "Tap to reveal the answer"}
  </Text>
);

const styles = StyleSheet.create({
  hintText: {
    color: colors.wordCard.textMuted,
    fontSize: fontSize.body.small,
    lineHeight: lineHeight.body.small,
    fontFamily: fontFamily.bitter.medium,
  },
});
