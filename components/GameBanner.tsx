import { StyleSheet, View } from "react-native";
import {
  borderWidth,
  borderRadius,
  colors,
  spacing,
} from "@/constants/styles";
import { getCardOverlayStyle, cardShadowStyle } from "@/utils/cardStyles";
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
    <View style={cardShadowStyle}>
      <Card
        containerStyle={[styles.container, getCardOverlayStyle(accentColor)]}
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
    </View>
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
