import { useContext } from "react";
import { Text, View, StyleSheet } from "react-native";
import { BaseModal } from "./base/BaseModal";
import { WordCard } from "./WordCard";
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
 * Result modal for game completion. Loss shows a locked WordCard that was not
 * collected. Win variant is kept for layout parity but the fail flow is the
 * primary consumer (win banner restores inline collected UX).
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
  const dialogLabel = isWin
    ? "You won. Word collected."
    : "Game over. Word not collected.";

  return (
    <BaseModal
      visible={visible}
      onRequestClose={onRequestClose}
      animationType="fade"
      showCloseButton={true}
      contentStyle={styles.modalContent}
      accessibilityLabel={dialogLabel}
    >
      <View
        style={styles.container}
        accessibilityLiveRegion="polite"
        importantForAccessibility="yes"
      >
        <Text
          style={[
            styles.title,
            {
              color: isWin
                ? colors.semantic.success
                : colors.semantic.warning,
            },
          ]}
          accessibilityRole="header"
        >
          {title}
        </Text>
        <Text
          style={styles.subtitle}
          accessibilityRole="text"
          accessibilityLiveRegion="polite"
        >
          {subtitle}
        </Text>

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
});

export default GameResultModal;
