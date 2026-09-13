import { useState } from "react";
import { StyleSheet, View, Pressable, Platform, Text } from "react-native";
import {
  borderWidth,
  borderRadius,
  colors,
  spacing,
  fontFamily,
  fontSize,
  lineHeight,
} from "@/constants/styles";
import { opacity } from "@/constants/opacity";
import { getCardOverlayStyle, cardShadowStyle } from "@/utils/cardStyles";
import { SubtleGradient } from "./base/SubtleGradient";
import { Card } from "./base/Card";
import { BannerMessage } from "./BannerMessage";
import { CollectedWordText } from "./CollectedWordText";
import { SeeWordsLink } from "./SeeWordsLink";

type GameBannerProps = {
  gameStatus: "won" | "running" | "lost";
  numGuesses?: number;
  answer?: string;
  edition?: number;
  /** Same-day fail reveal only — when omitted, banner is not actionable */
  onPress?: () => void;
};

export const GameBanner = ({
  gameStatus,
  numGuesses,
  answer,
  edition,
  onPress,
}: GameBannerProps) => {
  const [isFocused, setIsFocused] = useState(false);

  if (gameStatus === "running") return null;

  const isWin = gameStatus === "won";
  const isInteractive = onPress != null;
  const accentColor = isWin
    ? colors.semantic.success
    : colors.semantic.warning;

  const accessibilityLabel = isWin
    ? `Congratulations. You got it in ${numGuesses} ${
        numGuesses === 1 ? "guess" : "guesses"
      }.`
    : isInteractive
      ? "Game over. Tap to reveal the answer."
      : "Game over. The answer can only be revealed on the day you played.";

  const hintText = isWin
    ? null
    : isInteractive
      ? "Tap to reveal the answer"
      : "Answer reveal is only available on the day you played";

  const content = (
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
          {isWin && answer ? (
            <CollectedWordText answer={answer} edition={edition} />
          ) : null}
          {isWin ? <SeeWordsLink /> : null}
          {hintText ? <Text style={styles.hintText}>{hintText}</Text> : null}
        </View>
      </Card>
    </View>
  );

  if (!isInteractive) {
    return (
      <View accessible accessibilityLabel={accessibilityLabel}>
        {content}
      </View>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint="Opens a dialog with the final word"
      style={({ pressed }) => [
        pressed && styles.pressed,
        isFocused && styles.focusVisible,
      ]}
    >
      {content}
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
  hintText: {
    color: colors.wordCard.textMuted,
    fontSize: fontSize.body.small,
    lineHeight: lineHeight.body.small,
    fontFamily: fontFamily.bitter.medium,
  },
  pressed: {
    opacity: opacity.pressed,
  },
  focusVisible: Platform.select({
    web: {
      outlineWidth: 2,
      outlineStyle: "solid",
      outlineColor: colors.semantic.warning,
      outlineOffset: 2,
    },
    default: {
      borderWidth: borderWidth.badge,
      borderColor: colors.semantic.warning,
      borderRadius: borderRadius.card,
    },
  }) as object,
});
