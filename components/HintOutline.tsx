import { borderRadius } from "@/constants/styles";
import { useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

type HintOutlineProps = {
  color: string;
};

export const HintOutline = ({ color }: HintOutlineProps) => {
  const strokeWidth = 4;
  const duration = 900;
  const animatedScale = useSharedValue(1);

  useEffect(() => {
    animatedScale.value = withRepeat(withTiming(1.05, { duration }), -1, true);
  }, [animatedScale, duration]);

  const outlineStyle = useAnimatedStyle(() => {
    return {
      position: "absolute",
      top: -1,
      left: -1,
      right: -1,
      bottom: -1,
      transform: [{ scale: animatedScale.value }],
      borderColor: color,
      borderWidth: strokeWidth,
      borderRadius: borderRadius.md,
      zIndex: 10, // Ensure hint outline appears above other elements
    };
  });

  return <Animated.View style={outlineStyle} />;
};
