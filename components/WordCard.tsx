import { StyleSheet, Text } from "react-native";
import { Card } from "./base/Card";
import {
  borderRadius,
  colors,
  fontFamily,
  fontSize,
  lineHeight,
  spacing,
} from "@/constants/styles";
import { useContext } from "react";
import { GameContext } from "@/context/GameContext";

const CARD_HEIGHT = 120;

type WordCardProps = {};

export const WordCard = ({ ...rest }: WordCardProps) => {
  const { category } = useContext(GameContext);
  return (
    <Card addStyles={styles.container}>
      <Card
        addStyles={{
          borderRadius: borderRadius.sm,
          flex: 1,
          backgroundColor: colors.categories.science,
        }}
      >
        <Text style={styles.categoryText}>{category}</Text>
      </Card>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: CARD_HEIGHT,
    borderWidth: 2,
    borderColor: colors.neutral.white,
  },
  categoryText: {
    color: colors.neutral.white,
    fontSize: fontSize.title.large,
    lineHeight: lineHeight.title.large,
    fontFamily: fontFamily.bitter.bold,
  },
});
