import { View } from "react-native";
import { useState, useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { SvgIcon } from "./base/SvgIcon";
import { HeaderTitle } from "./base/HeaderTitle";
import { HeaderLeft } from "./base/HeaderLeft";
import { HeaderRight } from "./base/HeaderRight";
import { StatusBar } from "expo-status-bar";
import {
  borderRadius,
  colors,
  fontFamily,
  fontSize,
  lineHeight,
  spacing,
  animation,
} from "@/constants/styles";
import { iconSizes } from "@/constants/icons";
import { DrawerLoginButton } from "./DrawerLoginButton";
import { DrawerDevInfo } from "./DrawerDevInfo";
import { InfoModal } from "./InfoModal";
import { usePlatform } from "@/hooks/usePlatform";
import {
  hasInfoModalBeenShown,
  saveInfoModalShown,
} from "@/storage/app-state.local";
import { useAccessibilityKeyboard } from "@/hooks/useAccessibilityKeyboard";

export const DrawerNavigationWrapper = () => {
  const { isWeb } = usePlatform();
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);

  // Setup accessibility keyboard shortcuts
  useAccessibilityKeyboard({
    onHelp: () => setIsInfoModalVisible(true),
    onEscape: () => setIsInfoModalVisible(false),
    // Note: onFocus could be implemented later with refs
  });

  // Check if InfoModal should be shown on first load
  // Suspense boundary handles all loading states, so we can show modal immediately on web
  useEffect(() => {
    if (isWeb) {
      const hasBeenShown = hasInfoModalBeenShown();
      if (!hasBeenShown) {
        // Wait for the long animation duration before showing modal
        const timer = setTimeout(() => {
          setIsInfoModalVisible(true);
        }, animation.duration.long);

        return () => clearTimeout(timer);
      }
    }
  }, [isWeb]);

  const handleCloseInfoModal = () => {
    setIsInfoModalVisible(false);
    // Save that the modal has been shown
    saveInfoModalShown();
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => (
          <DrawerContentScrollView
            {...props}
            contentContainerStyle={{
              flex: 1,
              justifyContent: "space-between",
            }}
          >
            <View style={{ gap: spacing.sm }}>
              <DrawerItemList {...props} />
            </View>
            <View style={{ paddingVertical: spacing.sm }}>
              <DrawerDevInfo />
              <DrawerLoginButton />
            </View>
          </DrawerContentScrollView>
        )}
        screenOptions={() => ({
          headerStyle: {
            backgroundColor: colors.neutral.background,
            // TODO: Border still shows on desktop web
            borderBottomWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTitleAlign: "center",
          headerTintColor: colors.neutral.white,
          headerTitle: () => <HeaderTitle />,
          headerLeft: () => <HeaderLeft />,
          headerRight: () => (
            <HeaderRight onInfoPress={() => setIsInfoModalVisible(true)} />
          ),
          drawerStyle: {
            backgroundColor: colors.neutral.background,
          },
          drawerActiveTintColor: colors.neutral.white,
          drawerInactiveTintColor: colors.neutral.white,
          drawerItemStyle: {
            marginVertical: spacing.xs,
          },
          // On web, ensure drawer starts closed
          ...(isWeb && {
            swipeEnabled: false, // Disable swipe gestures on web
          }),
        })}
      >
        <Drawer.Screen
          name="index"
          options={{
            title: "Home",
            drawerLabel: "Home",
            drawerLabelStyle: {
              fontFamily: fontFamily.bitter.bold,
              fontSize: fontSize.title.large,
              lineHeight: lineHeight.title.large,
            },
            drawerItemStyle: { borderRadius: borderRadius.md },
            drawerIcon: ({ color }: { color: string }) => (
              <SvgIcon name="home" size={iconSizes.standard} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="words"
          options={{
            title: "Words",
            drawerLabel: "Words",
            drawerLabelStyle: {
              fontFamily: fontFamily.bitter.bold,
              fontSize: fontSize.title.large,
              lineHeight: lineHeight.title.large,
            },
            drawerItemStyle: { borderRadius: borderRadius.md },
            drawerIcon: ({ color }: { color: string }) => (
              <SvgIcon name="trophy" size={iconSizes.standard} color={color} />
            ),
          }}
        />
      </Drawer>
      <StatusBar networkActivityIndicatorVisible={true} style="light" />
      <InfoModal
        visible={isInfoModalVisible}
        onRequestClose={handleCloseInfoModal}
      />
    </GestureHandlerRootView>
  );
};
