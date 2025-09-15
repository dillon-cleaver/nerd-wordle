import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useState, useEffect, useContext } from "react";
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
import { DrawerSignOutButton } from "./DrawerSignOutButton";
import { DrawerDevInfo } from "./DrawerDevInfo";
import { InfoModal } from "./InfoModal";
import { usePlatform } from "@/hooks/usePlatform";
import { useUser } from "@/hooks/useUser";
import { GameContext } from "@/context/GameContext";
import {
  hasInfoModalBeenShown,
  saveInfoModalShown,
} from "@/storage/app-state.local";

export const DrawerNavigationWrapper = () => {
  const { loading } = useUser();
  const { isLoading: gameLoading } = useContext(GameContext);
  const { isWeb } = usePlatform();
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);

  // Check if InfoModal should be shown on first load
  // Wait for both user and game to finish loading, then show after delay
  useEffect(() => {
    if (!loading && !gameLoading && isWeb) {
      const hasBeenShown = hasInfoModalBeenShown();
      if (!hasBeenShown) {
        // Wait for the long animation duration before showing modal
        const timer = setTimeout(() => {
          setIsInfoModalVisible(true);
        }, animation.duration.long);

        return () => clearTimeout(timer);
      }
    }
  }, [loading, gameLoading, isWeb]);

  const handleCloseInfoModal = () => {
    setIsInfoModalVisible(false);
    // Save that the modal has been shown
    saveInfoModalShown();
  };

  // On web, show loading indicator while user state or game resolves to prevent drawer flicker
  // Mobile platforms handle loading through splash screens and don't experience the same flicker issue
  if (isWeb && (loading || gameLoading)) {
    return (
      <View style={loadingStyles.container}>
        <ActivityIndicator size="large" color={colors.neutral.white} />
      </View>
    );
  }

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
              <DrawerSignOutButton />
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

const loadingStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.neutral.background,
  },
});
