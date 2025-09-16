import { useContext } from "react";
import { Text, View, StyleSheet } from "react-native";
import { BaseModal } from "./base/BaseModal";
import { GameContext } from "@/context/GameContext";
import { getHintForWord } from "@/utils/game";
import {
  colors,
  fontFamily,
  fontSize,
  lineHeight,
  spacing,
} from "@/constants/styles";

type HintModalProps = {
  visible: boolean;
  onRequestClose: () => void;
  hintIndex?: number;
};

export const HintModal = ({
  visible,
  onRequestClose,
  hintIndex = 0,
}: HintModalProps) => {
  const { answerEntry, category } = useContext(GameContext);

  const hint = answerEntry
    ? getHintForWord(answerEntry, hintIndex)
    : "Loading hint...";

  return (
    <BaseModal
      visible={visible}
      onRequestClose={onRequestClose}
      animationType="fade"
      showCloseButton={true}
    >
      <View style={styles.container}>
        <Text style={styles.category}>{category}</Text>
        <Text style={styles.hint}>{hint}</Text>
      </View>
    </BaseModal>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: spacing.lg,
  },
  category: {
    fontFamily: fontFamily.bitter.bold,
    fontSize: fontSize.title.medium,
    lineHeight: lineHeight.title.medium,
    color: colors.neutral.white,
    textAlign: "center",
  },
  hint: {
    fontFamily: fontFamily.bitter.italic,
    fontSize: fontSize.title.large,
    lineHeight: lineHeight.title.large,
    color: colors.neutral.white,
    textAlign: "center",
  },
});

export default HintModal;
