import { useEffect } from "react";
import {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from "react-native-reanimated";

/**
 * Hook that provides a shake animation triggered by a boolean flag.
 * Useful for indicating invalid input or errors.
 *
 * @param shouldShake - When true, triggers the shake animation
 * @param distance - How far to shake in pixels (default: 6)
 * @param duration - Duration of each shake segment in ms (default: 50)
 * @returns Animated style object to apply to the component
 */
export const useShakeAnimation = (
  shouldShake: boolean,
  distance: number = 6,
  duration: number = 50
) => {
  const translateX = useSharedValue(0);

  useEffect(() => {
    if (shouldShake) {
      // Create shake sequence: right -> left -> right -> left -> center
      translateX.value = withSequence(
        withTiming(distance, { duration }),
        withTiming(-distance, { duration }),
        withTiming(distance, { duration }),
        withTiming(-distance, { duration }),
        withTiming(0, { duration })
      );
    }
  }, [shouldShake, translateX, distance, duration]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return animatedStyle;
};
