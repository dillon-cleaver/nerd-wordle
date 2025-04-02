import * as React from "react";
import { View, StyleSheet, Text } from "react-native";

type GameBannerProps = {
  gameStatus: "won" | "running" | "lost";
  numGuesses?: number;
  answer?: string;
};

const GameBanner = ({ gameStatus, numGuesses, answer }: GameBannerProps) => {
  if (gameStatus === "running") return null;

  return (
    <View style={styles.banner}>
      <Text style={styles.bannerText}>
        {gameStatus === "won"
          ? `Congratulations! You won in ${numGuesses} guesses!`
          : `Sorry, you lost! The answer was ${answer}`}
      </Text>
    </View>
  );
};

export default GameBanner;

const styles = StyleSheet.create({
  banner: {
    position: "absolute",
    top: 32,
    backgroundColor: "#4CAF50",
    padding: 16,
    borderRadius: 8,
  },
  bannerText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
