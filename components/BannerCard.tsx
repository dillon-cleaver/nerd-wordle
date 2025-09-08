import { useContext } from "react";
import { StyleSheet, View } from "react-native";
import { GameContext } from "@/context/GameContext";
import { GameBanner } from "./GameBanner";
import {
  DESKTOP_BANNER_GUESS_GRID_MAX_WIDTH,
  DESKTOP_BANNER_GUESS_GRID_MIN_WIDTH,
  MIN_BANNER_HEIGHT,
  MOBILE_BANNER_GUESS_GRID_MAX_WIDTH,
  MOBILE_BANNER_GUESS_GRID_MIN_WIDTH,
} from "@/constants/dimensions";
import { useDevice } from "@/hooks/useDevice";

export const BannerCard = () => {
  const { gameStatus, guesses, answer, answerEntry } = useContext(GameContext);
  const editionNumber =
    answerEntry && answerEntry.category !== "common"
      ? answerEntry.edition
      : undefined;

  const { isDesktop } = useDevice();

  const containerStyle = [
    styles.container,
    !isDesktop
      ? {
          minWidth: MOBILE_BANNER_GUESS_GRID_MIN_WIDTH,
          maxWidth: MOBILE_BANNER_GUESS_GRID_MAX_WIDTH,
        }
      : {
          minWidth: DESKTOP_BANNER_GUESS_GRID_MIN_WIDTH,
          maxWidth: DESKTOP_BANNER_GUESS_GRID_MAX_WIDTH,
        },
  ];

  return (
    gameStatus !== "running" && (
      <View style={containerStyle}>
        <GameBanner
          gameStatus={gameStatus}
          numGuesses={guesses.length}
          answer={answer}
          edition={editionNumber}
          answerEntry={answerEntry}
        />
      </View>
    )
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: MIN_BANNER_HEIGHT,
    justifyContent: "center",
    width: "100%",
  },
});
