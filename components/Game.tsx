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
import { GameResultModal } from "./GameResultModal";
import { useKeyboardListener } from "@/hooks/useKeyboardListener";
import { useAccessibilityKeyboard } from "@/hooks/useAccessibilityKeyboard";

export const Game = () => {
  const { category, answer, gameStatus } = useContext(GameContext);

  const [hintModalVisible, setHintModalVisible] = useState(false);
  const [resultModalVisible, setResultModalVisible] = useState(false);

  const { isDesktop } = useDevice();

  useKeyboardListener();

  useAccessibilityKeyboard({
    onEscape: () => {
      setHintModalVisible(false);
      setResultModalVisible(false);
    },
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

  // Fail-state only: win banner restores inline collected UX (no tap-to-reveal)
  const handlePressBanner = () => {
    if (gameStatus === "lost") {
      setResultModalVisible(true);
    }
  };

  const handleCloseResultModal = () => {
    setResultModalVisible(false);
  };

  useEffect(() => {
    if (isDebugLoggingEnabled()) {
      console.info({ answer, category });
    }
  }, [answer, category]);

  useEffect(() => {
    if (gameStatus !== "lost") {
      setResultModalVisible(false);
    }
  }, [gameStatus]);

  return (
    <View style={containerStyle}>
      <Animated.View
        style={styles.content}
        entering={FadeInUp.duration(animation.duration.medium).springify()}
      >
        <BannerCard onPressBanner={handlePressBanner} />
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
      {gameStatus === "lost" && (
        <GameResultModal
          visible={resultModalVisible}
          onRequestClose={handleCloseResultModal}
          outcome="lost"
        />
      )}
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
