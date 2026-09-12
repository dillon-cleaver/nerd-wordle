import { StyleSheet, View, Pressable } from "react-native";
import {
  borderWidth,
  borderRadius,
  colors,
  spacing,
} from "@/constants/styles";
import { getCardOverlayStyle, cardShadowStyle } from "@/utils/cardStyles";
import { SubtleGradient } from "./base/SubtleGradient";
import { Card } from "./base/Card";
import { BannerMessage } from "./BannerMessage";
import { BannerTapHint } from "./BannerTapHint";

type GameBannerProps = {
  gameStatus: "won" | "running" | "lost";
  numGuesses?: number;
  onPress?: () => void;
};

export const GameBanner = ({
  gameStatus,
  numGuesses,
  onPress,
}: GameBannerProps) => {
  if (gameStatus === "running") return null;

  const accentColor =
    gameStatus === "won" ? colors.semantic.success : colors.semantic.warning;

  const accessibilityLabel =
    gameStatus === "won"
      ? "Congratulations. Tap to view your WordCard."
      : "Game over. Tap to reveal the answer.";

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      disabled={!onPress}
    >
      <View style={cardShadowStyle}>
        <Card
          containerStyle={[styles.container, getCardOverlayStyle(accentColor)]}
        >
          <SubtleGradient
            colors={[
              colors.wordCard.gradientStart,
              colors.wordCard.gradientEnd,
            ]}
          />
          <View style={styles.content}>
            <BannerMessage gameStatus={gameStatus} numGuesses={numGuesses} />
            <BannerTapHint gameStatus={gameStatus} />
          </View>
        </Card>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: borderWidth.wordCard,
    borderRadius: borderRadius.card,
    width: "100%",
  },
  content: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
});
