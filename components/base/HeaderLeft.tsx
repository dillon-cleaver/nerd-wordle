import { TouchableOpacity } from "react-native";
import { useNavigation } from "expo-router";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { SvgIcon } from "./SvgIcon";
import { colors, spacing } from "@/constants/styles";
import { iconSizes } from "@/constants/icons";

export const HeaderLeft = () => {
  const navigation = useNavigation<DrawerNavigationProp<any>>();

  return (
    <TouchableOpacity
      onPress={() => navigation.toggleDrawer()}
      style={{ padding: spacing.xs, marginLeft: spacing.md }}
    >
      <SvgIcon
        name="menu"
        size={iconSizes.standard}
        color={colors.neutral.white}
      />
    </TouchableOpacity>
  );
};
