import { View, TouchableOpacity } from "react-native";
import { SvgIcon } from "./SvgIcon";
import { DevModeBadge } from "../DevModeBadge";
import { colors, spacing } from "@/constants/styles";
import { iconSizes } from "@/constants/icons";

interface HeaderRightProps {
  onInfoPress: () => void;
}

export const HeaderRight = ({ onInfoPress }: HeaderRightProps) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.sm,
        marginRight: spacing.md,
      }}
    >
      <DevModeBadge />
      <TouchableOpacity
        onPress={onInfoPress}
        style={{ padding: spacing.xs }}
        accessibilityRole="button"
        accessibilityLabel="How to play"
        accessibilityHint="Opens the game instructions and help. You can also press Ctrl+H or ? on keyboard."
      >
        <SvgIcon
          name="info-circle"
          size={iconSizes.standard}
          color={colors.neutral.white}
        />
      </TouchableOpacity>
    </View>
  );
};
