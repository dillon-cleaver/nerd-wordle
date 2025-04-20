import { useEffect } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { colors, spacing } from "@/constants/styles";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { FontAwesome } from "@expo/vector-icons";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    "Bitter-Regular": require("../assets/fonts/Bitter-Regular.ttf"),
    "Bitter-Bold": require("../assets/fonts/Bitter-Bold.ttf"),
    "Bitter-Italic": require("../assets/fonts/Bitter-Italic.ttf"),
    "Bitter-BoldItalic": require("../assets/fonts/Bitter-BoldItalic.ttf"),
    "Bitter-Medium": require("../assets/fonts/Bitter-Medium.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.neutral.black,
          },
          headerTintColor: colors.neutral.white,
          headerTitle: "NerdWord",
          drawerStyle: {
            backgroundColor: colors.neutral.black,
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
            drawerIcon: ({ color }: { color: string }) => (
              <FontAwesome name="home" size={24} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="friends"
          options={{
            title: "Friends",
            drawerLabel: "Friends",
            drawerIcon: ({ color }: { color: string }) => (
              <FontAwesome name="users" size={24} color={color} />
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
