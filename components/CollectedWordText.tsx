import { Text, StyleSheet } from "react-native";
import { colors, fontFamily, fontSize, lineHeight } from "@/constants/styles";
import { opacity } from "@/constants/opacity";

type CollectedWordTextProps = {
  answer: string;
  edition?: number;
};

export const CollectedWordText = ({
  answer,
  edition,
}: CollectedWordTextProps) => (
  <Text style={styles.subText}>
    Collected: <Text style={styles.answer}>{answer}</Text>
    {typeof edition === "number" ? ` (#${edition})` : ""}
  </Text>
);

const styles = StyleSheet.create({
  answer: {
    fontFamily: fontFamily.bitter.bold,
    fontSize: fontSize.title.base,
    lineHeight: lineHeight.title.base,
  },
  subText: {
    color: colors.neutral.black,
    fontSize: fontSize.body.base,
    fontFamily: fontFamily.openSans.medium,
    opacity: opacity.subtle,
  },
});
