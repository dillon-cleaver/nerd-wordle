import { View, StyleSheet } from "react-native";
import { colors, spacing } from "@/constants/styles";

export const SectionBreak = () => {
  return <View style={styles.sectionBreak} />;
};

const styles = StyleSheet.create({
  sectionBreak: {
    height: 1,
    backgroundColor: colors.neutral.darkGray,
    alignSelf: "stretch",
    marginVertical: spacing.sm,
  },
});
