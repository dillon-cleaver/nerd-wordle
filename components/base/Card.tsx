import { borderRadius, colors, spacing } from "@/constants/styles";
import { ReactNode } from "react";
import {
  View,
  StyleSheet,
  ViewProps,
  ViewStyle,
  StyleProp,
} from "react-native";

type CardProps = ViewProps & {
  children: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
};

export const Card = ({ children, containerStyle, ...rest }: CardProps) => {
  return (
    <View style={[styles.container, containerStyle]} {...rest}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.xs,
    borderRadius: borderRadius.md,
    backgroundColor: colors.neutral.background,
  },
});
