import { useContext } from "react";
import { StyleSheet, View } from "react-native";
import { GameContext } from "@/context/GameContext";
import { GameBanner } from "./GameBanner";
import { spacing } from "@/constants/styles";
import { CategoryBanner } from "./CategoryBanner";
import { WORD_CARD_GUESS_GRID_MAX_WIDTH } from "@/constants/dimensions";

export const BannerCard = () => {
  const { gameStatus, guesses, answer } = useContext(GameContext);

  return gameStatus === "running" ? (
    <View style={styles.container}>
      <CategoryBanner />
    </View>
  ) : (
    <GameBanner
      gameStatus={gameStatus}
      numGuesses={guesses.length}
      answer={answer}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    maxWidth: WORD_CARD_GUESS_GRID_MAX_WIDTH,
    marginLeft: -spacing.md,
  },
});
