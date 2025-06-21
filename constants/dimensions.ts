import { Dimensions } from "react-native";

const DEVICE_WIDTH = Dimensions.get("window").width;

const WORD_CARD_GUESS_GRID_MIN_WIDTH = 280;
const WORD_CARD_GUESS_GRID_MAX_WIDTH = 324;

export {
  DEVICE_WIDTH,
  WORD_CARD_GUESS_GRID_MAX_WIDTH,
  WORD_CARD_GUESS_GRID_MIN_WIDTH,
};
