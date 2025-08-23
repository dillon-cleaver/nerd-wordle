import { ViewToken } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { ReactNode } from "react";

type ListItemProps = {
  children: ReactNode;
  viewableItems: SharedValue<ViewToken[]>;
  item: {
    id: string | number;
  };
};

export const ListItem = ({ children, item, viewableItems }: ListItemProps) => {
  const rStyle = useAnimatedStyle(() => {
    const isVisible = viewableItems.value.some(
      (viewableItem) =>
        viewableItem.isViewable &&
        String(viewableItem.item?.id) === String(item.id)
    );

    return {
      opacity: withTiming(isVisible ? 1 : 0),
      transform: [{ scale: withTiming(isVisible ? 1 : 0.9) }],
    };
  }, [item.id]);

  return (
    <Animated.View style={[rStyle, { paddingVertical: 8 }]}>
      {children}
    </Animated.View>
  );
};
