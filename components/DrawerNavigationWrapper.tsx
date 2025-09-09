import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useState, useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { FontAwesome } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import {
  borderRadius,
  colors,
  fontFamily,
  fontSize,
  lineHeight,
  spacing,
} from "@/constants/styles";
import { DrawerSignOutButton } from "./DrawerSignOutButton";
import { DrawerDevInfo } from "./DrawerDevInfo";
import { DevModeBadge } from "./DevModeBadge";
import { InfoModal } from "./InfoModal";
import { usePlatform } from "@/hooks/usePlatform";
import { useUser } from "@/hooks/useUser";
import { 
  hasInfoModalBeenShown, 
  saveInfoModalShown 
} from "@/storage/app-state.local";

export const DrawerNavigationWrapper = () => {
  const { loading } = useUser();
  const { isWeb } = usePlatform();
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);

  // Check if InfoModal should be shown on first load
  useEffect(() => {
    if (!loading && isWeb) {
      const hasBeenShown = hasInfoModalBeenShown();
      if (!hasBeenShown) {
        setIsInfoModalVisible(true);
      }
    }
  }, [loading, isWeb]);

  const handleCloseInfoModal = () => {
    setIsInfoModalVisible(false);
    // Save that the modal has been shown
    saveInfoModalShown();
  };

  // On web, show loading indicator while user state resolves to prevent drawer flicker
  if (isWeb && loading) {
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
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.neutral.background,
            // TODO: Border still shows on desktop web
            borderBottomWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTitleAlign: "center",
          headerTintColor: colors.neutral.white,
          headerTitle: "NerdWord",
          headerTitleStyle: {
            fontFamily: fontFamily.bitter.bold,
            fontSize: fontSize.title.large,
            alignItems: "center",
            lineHeight: lineHeight.title.large,
          },
          headerRight: () => (
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
                onPress={() => setIsInfoModalVisible(true)}
                style={{ padding: spacing.xs }}
              >
                <FontAwesome
                  name="info-circle"
                  size={24}
                  color={colors.neutral.white}
                />
              </TouchableOpacity>
            </View>
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
        }}
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
              <FontAwesome name="home" size={24} color={color} />
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
              <FontAwesome name="trophy" size={24} color={color} />
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
