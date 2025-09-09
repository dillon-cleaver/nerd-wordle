import { useContext } from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import { BaseModal } from "./base/BaseModal";
import { Card } from "./base/Card";
import { GameContext } from "@/context/GameContext";
import { useDevice } from "@/hooks/useDevice";
import {
  DESKTOP_MODAL_MAX_WIDTH,
  MOBILE_MODAL_MAX_WIDTH,
  MOBILE_MODAL_MAX_HEIGHT,
  DESKTOP_MODAL_TOP_OFFSET,
} from "@/constants/dimensions";
import {
  colors,
  fontFamily,
  fontSize,
  lineHeight,
  spacing,
  borderRadius,
} from "@/constants/styles";
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

  // TODO: Make this code more reusable — less duplicated code
  return (
    <BaseModal
      visible={visible}
      onRequestClose={onRequestClose}
      animationType="fade"
      contentStyle={modalContentStyle}
      showCloseButton={true}
    >
      {isDesktop ? (
        <View style={styles.container}>
          <Text style={styles.title}>How to Play</Text>

          <View style={styles.categorySection}>
            <Text style={styles.categoryLabel}>
              Today&apos;s Category & Color
            </Text>
            <Card
              addStyles={[
                styles.categoryCardContainer,
                { borderColor: categoryColor },
              ]}
            >
              <Card
                addStyles={{
                  backgroundColor: categoryColor,
                  padding: spacing.md,
                  borderRadius: borderRadius.sm,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={[styles.category, { color: categoryTextColor }]}>
                  {category}
                </Text>
              </Card>
            </Card>
          </View>

          <View style={styles.instructionsSection}>
            <Text style={styles.instructions}>
              GUESS THE HIDDEN WORD in six tries or less to collect today&apos;s
              NerdWord! 🤓
            </Text>
            <Text style={styles.instructions}>
              Fill out all five tiles in row, then press enter to submit a
              guess. The color of the tiles will change to show how close your
              guess was to the word.
            </Text>
            <Text style={styles.instructions}>
              Tiles will turn the{" "}
              <Text
                style={[
                  styles.categoryHighlight,
                  {
                    backgroundColor: categoryColor,
                    color: categoryTextColor,
                  },
                ]}
              >
                color of today&apos;s category
              </Text>{" "}
              if the letter is in the word and in the correct position.{" "}
              <Text style={styles.mustardHighlight}>Yellow</Text> means the
              letter is in the word but in the wrong position.{" "}
              <Text style={styles.blackHighlight}>Black</Text> means the letter
              is not in the word at all.
            </Text>
          </View>
          <View style={styles.timerSection}>
            <Text style={styles.timerText}>{timeUntilNewPuzzle}</Text>
            <Text style={styles.madeInText}>
              Made with ❤️ in Minneapolis, MN
            </Text>
          </View>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            <Text style={styles.title}>How to Play</Text>

            <View style={styles.categorySection}>
              <Text style={styles.categoryLabel}>
                Today&apos;s Category & Color
              </Text>
              <Card
                addStyles={[
                  styles.categoryCardContainer,
                  { borderColor: categoryColor },
                ]}
              >
                <Card
                  addStyles={{
                    backgroundColor: categoryColor,
                    padding: spacing.md,
                    borderRadius: borderRadius.sm,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={[styles.category, { color: categoryTextColor }]}>
                    {category}
                  </Text>
                </Card>
              </Card>
            </View>

            <View style={styles.instructionsSection}>
              <Text style={styles.instructions}>
                Guess the hidden word in six tries or less to collect
                today&apos;s NerdWord! 🤓
              </Text>
              <Text style={styles.instructions}>
                Fill out all five tiles in row, then press enter to submit a
                guess. The color of the tiles will change to show how close your
                guess was to the word.
              </Text>
              <Text style={styles.instructions}>
                Tiles will turn the{" "}
                <Text
                  style={[
                    styles.categoryHighlight,
                    {
                      backgroundColor: categoryColor,
                      color: categoryTextColor,
                    },
                  ]}
                >
                  color of today&apos;s category
                </Text>{" "}
                if the letter is in the word and in the correct position.{" "}
                <Text style={styles.mustardHighlight}>Yellow</Text> means the
                letter is in the word but in the wrong position.{" "}
                <Text style={styles.blackHighlight}>Black</Text> means the
                letter is not in the word at all.
              </Text>
            </View>
            <View style={styles.timerSection}>
              <Text style={styles.timerText}>{timeUntilNewPuzzle}</Text>
              <Text style={styles.madeInText}>
                Made with ❤️ in Minneapolis, MN
              </Text>
            </View>
          </View>
        </ScrollView>
      )}
    </BaseModal>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: spacing.md,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    gap: spacing.md,
    paddingBottom: spacing.md,
  },
  title: {
    fontFamily: fontFamily.bitter.bold,
    fontSize: fontSize.title.large,
    lineHeight: lineHeight.title.large,
    color: colors.neutral.white,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  categorySection: {
    alignItems: "stretch",
    alignSelf: "stretch",
    gap: spacing.sm,
  },
  categoryCardContainer: {
    alignSelf: "stretch",
    borderWidth: 2,
  },
  categoryLabel: {
    fontFamily: fontFamily.openSans.bold,
    fontSize: fontSize.body.base,
    lineHeight: lineHeight.body.medium,
    color: colors.neutral.lightGray,
    textAlign: "left",
  },
  category: {
    fontFamily: fontFamily.bitter.bold,
    fontSize: fontSize.title.medium,
    lineHeight: lineHeight.title.medium,
    textAlign: "center",
  },
  instructionsSection: {
    gap: spacing.md,
  },
  instructions: {
    fontFamily: fontFamily.openSans.regular,
    fontSize: fontSize.body.base,
    lineHeight: lineHeight.body.base,
    color: colors.neutral.white,
    textAlign: "left",
  },
  categoryHighlight: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  mustardHighlight: {
    backgroundColor: colors.semantic.warning,
    color: colors.neutral.black,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  blackHighlight: {
    backgroundColor: colors.neutral.black,
    color: colors.neutral.white,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  winSection: {
    alignItems: "center",
  },
  winText: {
    fontFamily: fontFamily.openSans.medium,
    fontSize: fontSize.body.base,
    lineHeight: lineHeight.body.base,
    color: colors.semantic.success,
    textAlign: "center",
  },
  timerSection: {
    alignItems: "center",
  },
  timerText: {
    fontSize: fontSize.body.base,
    opacity: 0.7,
    color: colors.neutral.white,
    fontFamily: fontFamily.openSans.regular,
  },
  madeInText: {
    fontSize: 14,
    opacity: 0.7,
    color: colors.neutral.white,
    fontFamily: fontFamily.openSans.regular,
  },
});

export default InfoModal;
