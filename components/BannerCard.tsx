import { useContext } from "react";
import { StyleSheet, View } from "react-native";
import { GameContext } from "@/context/GameContext";
import { GameBanner } from "./GameBanner";
import { CategoryBanner } from "./CategoryBanner";
import {
  BANNER_GUESS_GRID_MAX_WIDTH,
  BANNER_GUESS_GRID_MIN_WIDTH,
  MIN_BANNER_HEIGHT,
} from "@/constants/dimensions";

export const BannerCard = () => {
  const { gameStatus, guesses, answer, answerEntry } = useContext(GameContext);
  const editionNumber =
    answerEntry && answerEntry.category !== "common"
      ? answerEntry.edition
      : undefined;

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
        edition={editionNumber}
        answerEntry={answerEntry}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  categoryBannerContainer: {
    width: "100%",
    minHeight: MIN_BANNER_HEIGHT,
    minWidth: BANNER_GUESS_GRID_MIN_WIDTH,
    maxWidth: BANNER_GUESS_GRID_MAX_WIDTH,
  },
  gameBannerContainer: {
    minHeight: MIN_BANNER_HEIGHT,
    justifyContent: "center",
    width: "100%",
    minWidth: BANNER_GUESS_GRID_MIN_WIDTH,
    maxWidth: BANNER_GUESS_GRID_MAX_WIDTH,
  },
});
