import { useNavigation } from "expo-router";
import { DrawerNavigationProp } from "@react-navigation/drawer";

/**
 * Hook for managing drawer/sidebar navigation with keyboard accessibility
 */
export const useDrawerNavigation = () => {
  const navigation = useNavigation<DrawerNavigationProp<any>>();

  const toggleDrawer = () => {
    navigation.toggleDrawer();
  };

  const openDrawer = () => {
    navigation.openDrawer();
  };

  const closeDrawer = () => {
    navigation.closeDrawer();
  };

  return {
    toggleDrawer,
    openDrawer,
    closeDrawer,
    navigation,
  };
};
