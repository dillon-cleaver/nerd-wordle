import { Text, Pressable, Linking, StyleSheet } from "react-native";
import { colors, fontFamily, fontSize, lineHeight } from "@/constants/styles";
import { WordEntry } from "@/types/word";
import { SvgIcon } from "./base/SvgIcon";
import { iconSizes } from "@/constants/icons";

type WikipediaLinkProps = {
  answerEntry: WordEntry;
};

export const WikipediaLink = ({ answerEntry }: WikipediaLinkProps) => {
  const handleWikipediaPress = () => {
    if (
      answerEntry &&
      "wikipediaUrl" in answerEntry &&
      answerEntry.wikipediaUrl
    ) {
      Linking.openURL(answerEntry.wikipediaUrl);
    }
  };

  if (!("wikipediaUrl" in answerEntry) || !answerEntry.wikipediaUrl) {
    return null;
  }

  return (
    <Pressable onPress={handleWikipediaPress} style={styles.container}>
      <Text style={styles.linkText}>Learn more on Wikipedia</Text>
      <SvgIcon
        color={colors.wordCard.textMuted}
        name="chevron-right"
        size={iconSizes.small}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  linkText: {
    color: colors.wordCard.textMuted,
    fontSize: fontSize.body.base,
    lineHeight: lineHeight.body.base,
    fontFamily: fontFamily.bitter.medium,
  },
});
