import { Text, View, StyleSheet } from "react-native";
import { InfoModalCategorySection } from "./InfoModalCategorySection";
import { InfoModalInstructionsSection } from "./InfoModalInstructionsSection";
import { InfoModalLoginSection } from "./InfoModalLoginSection";
import { InfoModalTimerSection } from "./InfoModalTimerSection";
import { InfoModalKeyboardSection } from "./InfoModalKeyboardSection";
import { SectionBreak } from "./base/SectionBreak";
import { useDevice } from "@/hooks/useDevice";
import {
  colors,
  fontFamily,
  fontSize,
  lineHeight,
  spacing,
} from "@/constants/styles";

type InfoModalContentProps = {
  category: string;
  timeUntilNewPuzzle: string;
};

export const InfoModalContent = ({
  category,
  timeUntilNewPuzzle,
}: InfoModalContentProps) => {
  const { isDesktop } = useDevice();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>How to Play</Text>

      <InfoModalCategorySection category={category} />

      <SectionBreak />

      <InfoModalInstructionsSection />

      <SectionBreak />

      <InfoModalLoginSection />

      {/* Only show keyboard section and its section break on desktop */}
      {isDesktop && (
        <>
          <SectionBreak />
          <InfoModalKeyboardSection />
        </>
      )}

      <SectionBreak />

      <InfoModalTimerSection timeUntilNewPuzzle={timeUntilNewPuzzle} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: spacing.sm,
  },
  title: {
    fontFamily: fontFamily.bitter.bold,
    fontSize: fontSize.title.large,
    lineHeight: lineHeight.title.large,
    color: colors.neutral.white,
    textAlign: "center",
    paddingBottom: spacing.xs,
  },
});
