import { useContext } from "react";
import { StyleSheet, ScrollView } from "react-native";
import { BaseModal } from "./base/BaseModal";
import { InfoModalContent } from "./InfoModalContent";
import { GameContext } from "@/context/GameContext";
import { useDevice } from "@/hooks/useDevice";
import { MOBILE_MODAL_MAX_HEIGHT } from "@/constants/dimensions";
import { spacing } from "@/constants/styles";
import { useCountdownToNewPuzzle } from "@/utils/countdown";
// import { usePlatform } from "@/hooks/usePlatform";

type InfoModalProps = {
  visible: boolean;
  onRequestClose: () => void;
};

export const InfoModal = ({ visible, onRequestClose }: InfoModalProps) => {
  const { category } = useContext(GameContext);
  const { isDesktop } = useDevice();
  // const { isIOS, isAndroid } = usePlatform();
  const timeUntilNewPuzzle = useCountdownToNewPuzzle();

  const modalContentStyle = {
    maxHeight: isDesktop ? undefined : MOBILE_MODAL_MAX_HEIGHT,
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
    alignItems: "center",
    gap: spacing.md,
    paddingBottom: spacing.md,
  },
});
