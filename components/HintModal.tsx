import { useContext } from "react";
import { Text, View, StyleSheet } from "react-native";
import { BaseModal } from "./base/BaseModal";
import { GameContext } from "@/context/GameContext";
import { getHintForWord } from "@/utils/game";
import { useDevice } from "@/hooks/useDevice";
import {
  DESKTOP_MODAL_MAX_WIDTH,
  MOBILE_MODAL_MAX_WIDTH,
} from "@/constants/dimensions";
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
  const { answerEntry, originalCategory, category } = useContext(GameContext);
  const { isDesktop } = useDevice();

  const hint = getHintForWord(answerEntry, originalCategory, hintIndex);

  const modalContentStyle = {
    maxWidth: isDesktop ? DESKTOP_MODAL_MAX_WIDTH : MOBILE_MODAL_MAX_WIDTH,
  };

  return (
    <BaseModal
      visible={visible}
      onRequestClose={onRequestClose}
      animationType="fade"
      contentStyle={modalContentStyle}
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
  title: {
    fontFamily: fontFamily.bitter.bold,
    fontSize: fontSize.title.large,
    lineHeight: lineHeight.title.large,
    color: colors.neutral.black,
    textAlign: "center",
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
