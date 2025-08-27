import { StyleSheet, Text, Pressable, Linking } from "react-native";
import {
  borderRadius,
  colors,
  fontFamily,
  fontSize,
  spacing,
} from "@/constants/styles";
// Note: Width should match the container (Game content). We use width: "100%".
import { Link } from "expo-router";
import { Card } from "./base/Card";
import { WordEntry } from "@/types/word";

type GameBannerProps = {
  gameStatus: "won" | "running" | "lost";
  numGuesses?: number;
  answer?: string;
  edition?: number;
  answerEntry?: WordEntry | null;
};

export const GameBanner = ({
  gameStatus,
  numGuesses,
  answer,
  edition,
  answerEntry,
}: GameBannerProps) => {
  if (gameStatus === "running") return null;

  const backgroundColor =
    gameStatus === "won" ? colors.semantic.success : colors.semantic.warning;

  const handleWikipediaPress = () => {
    if (
      answerEntry &&
      "wikipediaUrl" in answerEntry &&
      answerEntry.wikipediaUrl
    ) {
      Linking.openURL(answerEntry.wikipediaUrl);
    }
  };

  const content = (
    <Card addStyles={[styles.outer, { borderColor: backgroundColor }]}>
      <Card addStyles={[styles.inner, { backgroundColor }]}>
        <Text style={styles.bannerText}>
          {gameStatus === "won"
            ? `CONGRATULATIONS! You got it in ${numGuesses} ${
                numGuesses === 1 ? "guess" : "guesses"
              }!`
            : `GAME OVER! Better luck tomorrow!`}
        </Text>
        {gameStatus === "won" && !!answer && (
          <Text style={styles.subText}>
            Collected: {answer}
            {typeof edition === "number" ? ` (#${edition})` : ""}
          </Text>
        )}
        {gameStatus === "won" && (
          <Link href="/words" asChild>
            <Pressable>
              <Text style={styles.linkText}>See your NerdWord</Text>
            </Pressable>
          </Link>
        )}
        {gameStatus === "lost" && !!answer && (
          <Text style={styles.subText}>The answer was: {answer}</Text>
        )}
        {gameStatus === "lost" &&
          answerEntry &&
          "wikipediaUrl" in answerEntry &&
          answerEntry.wikipediaUrl && (
            <Pressable onPress={handleWikipediaPress}>
              <Text style={styles.linkText}>Learn more on Wikipedia</Text>
            </Pressable>
          )}
      </Card>
    </Card>
  );

  // Return content directly - no special wrapper for wins
  return content;
};

const styles = StyleSheet.create({
  outer: {
    borderWidth: 2,
    width: "100%",
  },
  inner: {
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    gap: spacing.xs,
  },
  bannerText: {
    color: colors.neutral.black,
    fontSize: fontSize.title.base,
    fontFamily: fontFamily.bitter.bold,
  },
  subText: {
    color: colors.neutral.black,
    fontSize: fontSize.body.base,
    fontFamily: fontFamily.openSans.medium,
    marginTop: 2,
    opacity: 0.8,
  },
  linkText: {
    color: colors.neutral.black,
    fontSize: fontSize.body.base,
    fontFamily: fontFamily.openSans.medium,
    textDecorationLine: "underline",
    marginTop: 2,
    opacity: 0.8,
  },
});
