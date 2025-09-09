import { useContext } from "react";
import { StyleSheet, ScrollView } from "react-native";
import { BaseModal } from "./base/BaseModal";
import { InfoModalContent } from "./InfoModalContent";
import { GameContext } from "@/context/GameContext";
import { useDevice } from "@/hooks/useDevice";
import {
  DESKTOP_MODAL_MAX_WIDTH,
  MOBILE_MODAL_MAX_WIDTH,
  MOBILE_MODAL_MAX_HEIGHT,
  DESKTOP_MODAL_TOP_OFFSET,
} from "@/constants/dimensions";
import { spacing } from "@/constants/styles";
import { getCategoryColor, getCategoryTextColor } from "@/utils/game";
import { useCountdownToNewPuzzle } from "@/utils/countdown";

type InfoModalProps = {
  visible: boolean;
  onRequestClose: () => void;
};

export const InfoModal = ({ visible, onRequestClose }: InfoModalProps) => {
  const { category, originalCategory } = useContext(GameContext);
  const { isDesktop } = useDevice();
  const timeUntilNewPuzzle = useCountdownToNewPuzzle();
  const categoryColor = getCategoryColor(originalCategory);
  const categoryTextColor = getCategoryTextColor(originalCategory);

  const modalContentStyle = {
    maxWidth: isDesktop ? DESKTOP_MODAL_MAX_WIDTH : MOBILE_MODAL_MAX_WIDTH,
    maxHeight: isDesktop ? undefined : MOBILE_MODAL_MAX_HEIGHT,
    ...(isDesktop && {
      marginTop: DESKTOP_MODAL_TOP_OFFSET, // Move the modal higher up on desktop
    }),
  };

  return (
    <BaseModal
      visible={visible}
      onRequestClose={onRequestClose}
      animationType="fade"
      contentStyle={modalContentStyle}
      showCloseButton={true}
    >
      {isDesktop ? (
        <InfoModalContent
          category={category}
          categoryColor={categoryColor}
          categoryTextColor={categoryTextColor}
          timeUntilNewPuzzle={timeUntilNewPuzzle}
        />
      ) : (
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <InfoModalContent
            category={category}
            categoryColor={categoryColor}
            categoryTextColor={categoryTextColor}
            timeUntilNewPuzzle={timeUntilNewPuzzle}
          />
        </ScrollView>
      )}
    </BaseModal>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    gap: spacing.md,
    paddingBottom: spacing.md,
  },
});

export default InfoModal;
