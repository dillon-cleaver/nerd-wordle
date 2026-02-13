import { StyleSheet, View, Platform } from "react-native";
import {
  borderWidth,
  borderRadius,
  colors,
  shadow,
  spacing,
} from "@/constants/styles";
import { SubtleGradient } from "./base/SubtleGradient";
import { Card } from "./base/Card";
import { WordEntry } from "@/types/word";
import { BannerMessage } from "./BannerMessage";
import { CollectedWordText } from "./CollectedWordText";
import { SeeWordsLink } from "./SeeWordsLink";
import { AnswerRevealText } from "./AnswerRevealText";
import { WikipediaLink } from "./WikipediaLink";

type GameBannerProps = {
  gameStatus: "won" | "running" | "lost";
  numGuesses?: number;
  answer?: string;
  edition?: number;
  answerEntry?: WordEntry | null;
};

export const GameBanner = ({
  gameStatus,
  numGuesses,
  answer,
  edition,
  answerEntry,
}: GameBannerProps) => {
  if (gameStatus === "running") return null;

  const accentColor =
    gameStatus === "won" ? colors.semantic.success : colors.semantic.warning;

  return (
    <Card
      containerStyle={[
        styles.container,
        {
          borderColor: accentColor,
          backgroundColor: "transparent",
          overflow: "hidden",
          ...Platform.select({
            ios: {
              shadowColor: shadow.wordCard.color,
              shadowOffset: {
                width: shadow.wordCard.offsetX,
                height: shadow.wordCard.offsetY,
              },
              shadowOpacity: shadow.wordCard.opacity,
              shadowRadius: shadow.wordCard.radius,
            },
            android: { elevation: shadow.wordCard.elevation },
          }),
        },
      ]}
    >
      <SubtleGradient
        colors={[colors.wordCard.gradientStart, colors.wordCard.gradientEnd]}
      />
      <View style={styles.content}>
        <BannerMessage gameStatus={gameStatus} numGuesses={numGuesses} />

        {gameStatus === "won" && answer && (
          <CollectedWordText answer={answer} edition={edition} />
        )}

        {gameStatus === "won" && <SeeWordsLink />}

        {gameStatus === "lost" && answer && (
          <AnswerRevealText answer={answer} />
        )}

        {gameStatus === "lost" && answerEntry && (
          <WikipediaLink answerEntry={answerEntry} />
        )}
      </View>
    </Card>
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
