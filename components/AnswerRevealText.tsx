import { Text, StyleSheet } from "react-native";
import { colors, fontFamily, fontSize, lineHeight } from "@/constants/styles";
import { opacity } from "@/constants/opacity";

type AnswerRevealTextProps = {
  answer: string;
};

export const AnswerRevealText = ({ answer }: AnswerRevealTextProps) => (
  <Text style={styles.subText}>
    The answer was: <Text style={styles.answer}>{answer}</Text>
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
