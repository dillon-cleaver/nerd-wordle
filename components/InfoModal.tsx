import { useContext } from "react";
import { StyleSheet, ScrollView } from "react-native";
import { BaseModal } from "./base/BaseModal";
import { InfoModalContent } from "./InfoModalContent";
import { GameContext } from "@/context/GameContext";
import { useDevice } from "@/hooks/useDevice";
import {
  MOBILE_MODAL_MAX_HEIGHT,
  DESKTOP_MODAL_MAX_HEIGHT,
} from "@/constants/dimensions";
import { spacing } from "@/constants/styles";
import { useCountdownToNewPuzzle } from "@/utils/countdown";

type InfoModalProps = {
  visible: boolean;
  onRequestClose: () => void;
};

export const InfoModal = ({ visible, onRequestClose }: InfoModalProps) => {
  const { category } = useContext(GameContext);
  const { isDesktop } = useDevice();
  const timeUntilNewPuzzle = useCountdownToNewPuzzle();

  const modalContentStyle = {
    maxHeight: isDesktop ? DESKTOP_MODAL_MAX_HEIGHT : MOBILE_MODAL_MAX_HEIGHT,
    padding: 0,
    overflow: "hidden" as const,
  };

  return (
    <BaseModal
      visible={visible}
      onRequestClose={onRequestClose}
      animationType="fade"
      contentStyle={modalContentStyle}
      showCloseButton={true}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
      >
        <InfoModalContent
          category={category}
          timeUntilNewPuzzle={timeUntilNewPuzzle}
        />
      </ScrollView>
    </BaseModal>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    padding: spacing.lg,
  },
});
