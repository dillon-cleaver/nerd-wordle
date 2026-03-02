import { useContext, useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { GuessGrid } from "./GuessGrid";
import { Keyboard } from "./Keyboard";
import { GameContext } from "@/context/GameContext";
import { spacing, animation, colors } from "@/constants/styles";
import { BannerCard } from "./BannerCard";
import { isDebugLoggingEnabled } from "@/utils/dev-flags";
import { useDevice } from "@/hooks/useDevice";
import { HintModal } from "./HintModal";
import { useKeyboardListener } from "@/hooks/useKeyboardListener";
import { useAccessibilityKeyboard } from "@/hooks/useAccessibilityKeyboard";

export const Game = () => {
  const { category, answer } = useContext(GameContext);

  const [hintModalVisible, setHintModalVisible] = useState(false);

  const { isDesktop } = useDevice();

  // Enable keyboard input for desktop users
  useKeyboardListener();

  // Enable accessibility shortcuts for hint modal
  useAccessibilityKeyboard({
    onEscape: () => setHintModalVisible(false),
  });

  const containerStyle = [
    styles.container,
    isDesktop && { gap: spacing.xl, paddingVertical: spacing.md },
  ];

  const handlePressHint = () => {
    setHintModalVisible(true);
  };

  const handleCloseHintModal = () => {
    setHintModalVisible(false);
  };

  useEffect(() => {
    if (isDebugLoggingEnabled()) {
      console.info({ answer, category });
    }
  }, [answer, category]);

  return (
    <View style={containerStyle}>
      <Animated.View
        style={styles.content}
        entering={FadeInUp.duration(animation.duration.medium).springify()}
      >
        <BannerCard />
        <GuessGrid onPressHint={handlePressHint} />
      </Animated.View>
      <Animated.View
        style={styles.keyboardContainer}
        entering={FadeInUp.duration(animation.duration.medium).springify()}
      >
        <Keyboard />
      </Animated.View>
      <HintModal
        visible={hintModalVisible}
        onRequestClose={handleCloseHintModal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.xs,
    flex: 1,
    justifyContent: "space-evenly",
    gap: spacing.md,
    width: "100%",
    backgroundColor: colors.neutral.background,
  },
  content: {
    alignItems: "center",
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
  keyboardContainer: {
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.sm,
  },
});
