import { useContext } from "react";
import { StyleSheet, View } from "react-native";
import { GameContext } from "@/context/GameContext";
import { GameBanner } from "./GameBanner";
import { spacing } from "@/constants/styles";
import { CategoryBanner } from "./CategoryBanner";
import { WORD_CARD_GUESS_GRID_MAX_WIDTH } from "@/constants/dimensions";

const MIN_BANNER_HEIGHT = 64;

export const BannerCard = () => {
  const { gameStatus, guesses, answer } = useContext(GameContext);

  return gameStatus === "running" ? (
    <View style={styles.categoryBannerContainer}>
      <CategoryBanner />
    </View>
  ) : (
    <View style={styles.gameBannerContainer}>
      <GameBanner
        gameStatus={gameStatus}
        numGuesses={guesses.length}
        answer={answer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  categoryBannerContainer: {
    width: "100%",
    minHeight: MIN_BANNER_HEIGHT,
    maxWidth: WORD_CARD_GUESS_GRID_MAX_WIDTH,
  },
  gameBannerContainer: {
    minHeight: MIN_BANNER_HEIGHT,
    justifyContent: "center",
  },
});
