import Svg, { Rect } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  withRepeat,
  Easing,
} from "react-native-reanimated";
import { borderRadius } from "@/constants/styles";
import { useEffect } from "react";

export type HintOutlineProps = {
  size: number;
  color: string;
  strokeWidth: number;
  duration: number;
};

const AnimatedRect = Animated.createAnimatedComponent(Rect);

export const HintOutline = ({
  size,
  color,
  strokeWidth,
  duration,
}: HintOutlineProps) => {
  const progress = useSharedValue(0);
  const r = borderRadius.md;
  const P = strokeWidth / 2;

  const dashLength = strokeWidth * 2;
  const gapLength = strokeWidth * 2;
  const dashCycle = dashLength + gapLength;

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(dashCycle, { duration, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: -progress.value,
  }));

  return (
    <Svg
      width={size + P * 2}
      height={size + P * 2}
      style={{ position: "absolute", top: -P, left: -P }}
    >
      <Rect
        x={P}
        y={P}
        width={size}
        height={size}
        rx={r}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeOpacity={0.3}
      />
      <AnimatedRect
        x={P}
        y={P}
        width={size}
        height={size}
        rx={r}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={[dashLength, gapLength]}
        animatedProps={animatedProps}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
