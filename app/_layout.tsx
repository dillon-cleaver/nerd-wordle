import { Suspense, useEffect } from "react";
import { ActivityIndicator, View, StyleSheet, Platform } from "react-native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import Head from "expo-router/head";
import { UserProvider } from "@/context/UserContext";
import { GameProvider } from "@/context/GameContext";
import { PuzzleHistoryProvider } from "@/context/PuzzleHistoryContext";
import { WordDataProvider } from "@/context/WordDataContext";
import { DrawerNavigationWrapper } from "@/components/DrawerNavigationWrapper";
import { colors } from "@/constants/styles";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
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

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return <RootLayoutContent />;
}

function RootLayoutContent() {
  return (
    <>
      {Platform.OS === "web" && (
        <Head>
          <title>NerdWord</title>
          <meta
            name="description"
            content="A nerdy twist on the classic word game"
          />
          <link rel="icon" href="/favicon.ico" />
          <meta name="theme-color" content="#1e212b" />
        </Head>
      )}
      <UserProvider>
        <PuzzleHistoryProvider>
          <Suspense
            fallback={
              <View style={styles.container}>
                <ActivityIndicator size="large" color={colors.neutral.white} />
              </View>
            }
          >
            <WordDataProvider>
              <GameProvider>
                <DrawerNavigationWrapper />
              </GameProvider>
            </WordDataProvider>
          </Suspense>
        </PuzzleHistoryProvider>
      </UserProvider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: colors.neutral.background,
  },
});
