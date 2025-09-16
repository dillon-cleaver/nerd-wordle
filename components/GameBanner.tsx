import { StyleSheet } from "react-native";
import { borderRadius, colors, spacing } from "@/constants/styles";
// Note: Width should match the container (Game content). We use width: "100%".
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

  const backgroundColor =
    gameStatus === "won" ? colors.semantic.success : colors.semantic.warning;

  return (
    <Card containerStyle={[styles.outer, { borderColor: backgroundColor }]}>
      <Card containerStyle={[styles.inner, { backgroundColor }]}>
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
      </Card>
    </Card>
  );
};

const styles = StyleSheet.create({
  outer: {
    borderWidth: 2,
    width: "100%",
  },
  inner: {
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    gap: spacing.sm,
  },
});
