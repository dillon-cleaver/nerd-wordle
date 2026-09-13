import { useContext } from "react";
import { StyleSheet } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { GameContext } from "@/context/GameContext";
import { GameBanner } from "./GameBanner";
import {
  DESKTOP_BANNER_GUESS_GRID_MAX_WIDTH,
  DESKTOP_BANNER_GUESS_GRID_MIN_WIDTH,
  MIN_BANNER_HEIGHT,
  MOBILE_BANNER_GUESS_GRID_MAX_WIDTH,
  MOBILE_BANNER_GUESS_GRID_MIN_WIDTH,
} from "@/constants/dimensions";
import { animation } from "@/constants/styles";
import { useDevice } from "@/hooks/useDevice";
import { getTodayDateString } from "@/utils/time";

type BannerCardProps = {
  onPressBanner?: () => void;
};

export const BannerCard = ({ onPressBanner }: BannerCardProps) => {
  const { gameStatus, guesses, puzzleDate, answer, answerEntry } =
    useContext(GameContext);
  const { isDesktop, isTablet } = useDevice();

  // Fail reveal is only available on the same calendar day as the attempt
  const isSameDay =
    puzzleDate != null && puzzleDate === getTodayDateString();
  const canRevealFail = gameStatus === "lost" && isSameDay;

  const editionNumber =
    answerEntry && answerEntry.category !== "common"
      ? answerEntry.edition
      : undefined;

  const containerStyle = [
    styles.container,
    !isDesktop && !isTablet
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
      <Animated.View
        style={containerStyle}
        entering={FadeInUp.duration(animation.duration.medium).springify()}
      >
        <GameBanner
          gameStatus={gameStatus}
          numGuesses={guesses.length}
          answer={answer}
          edition={editionNumber}
          onPress={canRevealFail ? onPressBanner : undefined}
        />
      </Animated.View>
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
