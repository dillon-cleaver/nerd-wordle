import { StyleSheet, StyleProp, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { gradient } from "@/constants/styles";

type SubtleGradientProps = {
  /** Gradient colors from top-left to bottom-right */
  colors: [string, string];
  style?: StyleProp<ViewStyle>;
};

/**
 * A subtle top-left to bottom-right gradient fill.
 * Used for WordCard, LetterBox tiles, and similar components.
 */
export const SubtleGradient = ({
  colors: gradientColors,
  style,
}: SubtleGradientProps) => (
  <LinearGradient
    colors={gradientColors}
    start={gradient.startPoint}
    end={gradient.endPoint}
    style={[StyleSheet.absoluteFill, style]}
  />
);
