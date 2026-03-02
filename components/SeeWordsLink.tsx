import { Text, Pressable, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { colors, fontFamily, fontSize, lineHeight } from "@/constants/styles";
import { SvgIcon } from "./base/SvgIcon";
import { iconSizes } from "@/constants/icons";

export const SeeWordsLink = () => (
  <Link href="/words" asChild>
    <Pressable style={styles.container}>
      <Text style={styles.linkText}>
        See your <Text style={styles.nerdWordText}>NerdWord</Text>
      </Text>
      <SvgIcon
        color={colors.wordCard.textMuted}
        name="chevron-right"
        size={iconSizes.small}
      />
    </Pressable>
  </Link>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  nerdWordText: {
    fontFamily: fontFamily.bitter.bold,
    fontSize: fontSize.body.base,
    lineHeight: lineHeight.body.base,
    color: colors.neutral.white,
  },
  linkText: {
    color: colors.wordCard.textMuted,
    fontSize: fontSize.body.base,
    fontFamily: fontFamily.bitter.medium,
    lineHeight: lineHeight.body.base,
  },
});
