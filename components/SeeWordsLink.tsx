import { Text, Pressable, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { colors, fontFamily, fontSize, lineHeight } from "@/constants/styles";
import { opacity } from "@/constants/opacity";
import { SvgIcon } from "./base/SvgIcon";
import { iconSizes } from "@/constants/icons";

export const SeeWordsLink = () => (
  <Link href="/words" asChild>
    <Pressable style={styles.container}>
      <Text style={styles.linkText}>
        See your <Text style={styles.nerdWordText}>NerdWord</Text>
      </Text>
      <SvgIcon
        color={colors.neutral.black}
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
  },
  linkText: {
    color: colors.neutral.black,
    fontSize: fontSize.body.base,
    fontFamily: fontFamily.openSans.medium,
    lineHeight: lineHeight.body.base,
    opacity: opacity.subtle,
  },
});
