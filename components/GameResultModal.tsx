import { useContext } from "react";
import { Text, View, StyleSheet } from "react-native";
import { BaseModal } from "./base/BaseModal";
import { WordCard } from "./WordCard";
import { SeeWordsLink } from "./SeeWordsLink";
import { GameContext } from "@/context/GameContext";
import { buildResultCardWord } from "@/utils/game-result-card";
import {
  colors,
  fontFamily,
  fontSize,
  lineHeight,
  spacing,
} from "@/constants/styles";

type GameResultModalProps = {
  visible: boolean;
  onRequestClose: () => void;
  outcome: "won" | "lost";
};

/**
 * Shared win/loss result modal. Win shows a collected WordCard; loss shows the
 * same layout with a locked / not-collected treatment. Failure never adds the
 * word to the user's collection.
 */
export const GameResultModal = ({
  visible,
  onRequestClose,
  outcome,
}: GameResultModalProps) => {
  const { answerEntry, guesses, hintIndex } = useContext(GameContext);

  const resultWord =
    answerEntry != null
      ? buildResultCardWord(answerEntry, guesses.length, hintIndex)
      : null;

  const isWin = outcome === "won";
  const title = isWin ? "Word Collected!" : "Not Collected";
  const subtitle = isWin
    ? "This WordCard has been added to your collection."
    : "You ran out of guesses. This WordCard stays locked.";

  return (
    <BaseModal
      visible={visible}
      onRequestClose={onRequestClose}
      animationType="fade"
      showCloseButton={true}
      contentStyle={styles.modalContent}
    >
      <View style={styles.container}>
        <Text
          style={[
            styles.title,
            { color: isWin ? colors.semantic.success : colors.semantic.warning },
          ]}
        >
          {title}
        </Text>
        <Text style={styles.subtitle}>{subtitle}</Text>

        {resultWord ? (
          <WordCard
            collectedWord={resultWord}
            variant={isWin ? "collected" : "locked"}
          />
        ) : (
          <Text style={styles.fallback}>
            {answerEntry ? answerEntry.id : "Answer unavailable"}
          </Text>
        )}

        {isWin && (
          <View style={styles.linkRow}>
            <SeeWordsLink />
          </View>
        )}
      </View>
    </BaseModal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    alignItems: "center",
  },
  container: {
    alignItems: "center",
    gap: spacing.md,
    width: "100%",
  },
  title: {
    fontFamily: fontFamily.bitter.bold,
    fontSize: fontSize.title.large,
    lineHeight: lineHeight.title.large,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: fontFamily.bitter.medium,
    fontSize: fontSize.body.base,
    lineHeight: lineHeight.body.base,
    color: colors.wordCard.textSecondary,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  fallback: {
    fontFamily: fontFamily.bitter.bold,
    fontSize: fontSize.title.medium,
    lineHeight: lineHeight.title.medium,
    color: colors.neutral.white,
    textAlign: "center",
  },
  linkRow: {
    marginTop: spacing.sm,
    alignSelf: "flex-start",
  },
});

export default GameResultModal;
