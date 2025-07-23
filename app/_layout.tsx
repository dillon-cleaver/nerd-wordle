import "@/firebase/firebaseConfig";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import {
  borderRadius,
  colors,
  fontFamily,
  fontSize,
  lineHeight,
  spacing,
} from "@/constants/styles";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { FontAwesome } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { DEVICE_WIDTH } from "@/constants/dimensions";
import { useDevice } from "@/hooks/useDevice";
import { useAuthListener } from "@/hooks/useAuthListener";
import { UserProvider } from "@/context/UserContext";
import { View } from "react-native";
import { DrawerSignOutButton } from "@/components/DrawerSignOutButton";
import { GameProvider } from "@/context/GameContext";
import { PuzzleHistoryProvider } from "@/context/PuzzleHistoryContext";

SplashScreen.preventAutoHideAsync();

const DRAWER_WIDTH = DEVICE_WIDTH * (2 / 3);

export default function RootLayout() {
  useAuthListener();

  const [loaded, error] = useFonts({
    "Bitter-Regular": require("../assets/fonts/Bitter-Regular.ttf"),
    "Bitter-Bold": require("../assets/fonts/Bitter-Bold.ttf"),
    "Bitter-Italic": require("../assets/fonts/Bitter-Italic.ttf"),
    "Bitter-BoldItalic": require("../assets/fonts/Bitter-BoldItalic.ttf"),
    "Bitter-Medium": require("../assets/fonts/Bitter-Medium.ttf"),
    "OpenSans-Bold": require("../assets/fonts/OpenSans-Bold.ttf"),
    "OpenSans-ExtraBoldItalic": require("../assets/fonts/OpenSans-ExtraBoldItalic.ttf"),
    "OpenSans-Italic": require("../assets/fonts/OpenSans-Italic.ttf"),
    "OpenSans-Medium": require("../assets/fonts/OpenSans-Medium.ttf"),
    "OpenSans-Regular": require("../assets/fonts/OpenSans-Regular.ttf"),
  });
  const { isDesktop } = useDevice();

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  // TODO: Make some components

  return (
    <UserProvider>
      <PuzzleHistoryProvider>
        <GameProvider>
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
                drawerStyle: {
                  backgroundColor: colors.neutral.background,
                  width: isDesktop ? 600 : DRAWER_WIDTH,
                },
                drawerActiveTintColor: colors.neutral.white,
                drawerInactiveTintColor: colors.neutral.white,
                drawerItemStyle: {
                  marginVertical: spacing.xs,
                },
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
              {/* <Drawer.Screen
              name="friends"
              options={{
                title: "Friends",
                drawerLabel: "Friends",
                drawerLabelStyle: {
                  fontFamily: fontFamily.bitter.bold,
                  fontSize: fontSize.title.large,
                  lineHeight: lineHeight.title.large,
                },
                drawerItemStyle: { borderRadius: borderRadius.md },
                drawerIcon: ({ color }: { color: string }) => (
                  <FontAwesome name="users" size={24} color={color} />
                ),
              }}
            /> */}
            </Drawer>
            <StatusBar networkActivityIndicatorVisible={true} style="light" />
          </GestureHandlerRootView>
        </GameProvider>
      </PuzzleHistoryProvider>
    </UserProvider>
  );
}
