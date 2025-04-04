import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

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
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
