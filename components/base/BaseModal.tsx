import { ReactNode } from "react";
import {
  Modal,
  View,
  StyleSheet,
  Pressable,
  StyleProp,
  ViewStyle,
  Platform,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { borderRadius, colors, spacing } from "@/constants/styles";

type BaseModalProps = {
  visible: boolean;
  onRequestClose: () => void;
  children: ReactNode;
  animationType?: "none" | "slide" | "fade";
  /**
   * Optional extra styles for the modal content container
   */
  contentStyle?: StyleProp<ViewStyle>;
  /**
   * Disable closing the modal by tapping the backdrop
   */
  disableBackdropDismiss?: boolean;
  /**
   * Show a close button (X) in the top-right corner
   */
  showCloseButton?: boolean;
};

export const BaseModal = ({
  visible,
  onRequestClose,
  children,
  animationType = "fade",
  contentStyle,
  disableBackdropDismiss = false,
  showCloseButton = false,
}: BaseModalProps) => {
  return (
    <Modal
      visible={visible}
      onRequestClose={onRequestClose}
      animationType={animationType}
      transparent
      statusBarTranslucent={Platform.OS === "android"}
      presentationStyle="overFullScreen"
      supportedOrientations={[
        "portrait",
        "portrait-upside-down",
        "landscape",
        "landscape-left",
        "landscape-right",
      ]}
    >
      <View style={styles.backdrop}>
        {!disableBackdropDismiss ? (
          <Pressable
            onPress={onRequestClose}
            style={StyleSheet.absoluteFill}
            accessibilityRole="button"
            accessibilityLabel="Close modal"
          />
        ) : null}

        <View style={[styles.content, contentStyle]} accessibilityViewIsModal>
          {showCloseButton && (
            <Pressable
              onPress={onRequestClose}
              style={styles.closeButton}
              accessibilityRole="button"
              accessibilityLabel="Close modal"
            >
              <FontAwesome
                name="close"
                size={20}
                color={colors.neutral.white}
              />
            </Pressable>
          )}
          {children}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.md,
  },
  content: {
    width: "100%",
    maxWidth: 600,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.neutral.background,
    padding: spacing.lg,
    // Subtle shadow for depth (web + native)
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: spacing.sm,
    right: spacing.sm,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.neutral.darkGray,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
});

export default BaseModal;
