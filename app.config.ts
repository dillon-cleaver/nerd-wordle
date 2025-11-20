// app.config.ts
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local", quiet: true });

export default {
  expo: {
    name: "nerd-wordle",
    slug: "nerd-wordle",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "nerd-wordle",
    userInterfaceStyle: "automatic",
    newArchEnabled: false,

    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.dilloncleaver.nerdwordle",
    },
    android: {
      package: "com.dilloncleaver.nerdwordle",
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#1e212b",
      },
    },

    web: {
      bundler: "metro", // you’re using Metro for web
      output: "static",
      favicon: "./assets/images/favicon.png",
    },

    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#1e212b",
        },
      ],
      [
        "expo-font",
        {
          fonts: [
            "./assets/fonts/Bitter-Regular.ttf",
            "./assets/fonts/Bitter-Bold.ttf",
            "./assets/fonts/Bitter-Italic.ttf",
            "./assets/fonts/Bitter-BoldItalic.ttf",
            "./assets/fonts/Bitter-Medium.ttf",
          ],
        },
      ],
    ],

    experiments: { typedRoutes: true },

    extra: {
      router: { origin: false },
      eas: { projectId: "edcdb2bd-3931-4987-9338-fa6de394bc86" }, // from your app.json
      // 🔑 Firebase — pulled from .env at build/update time
      firebase: {
        apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
        measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
      },
    },

    // Choose ONE policy. If you want broad OTA across builds, use sdkVersion.
    // If you want updates tied to app version, keep appVersion.
    // runtimeVersion: { policy: "sdkVersion" },
    runtimeVersion: { policy: "appVersion" }, // matches your current app.json

    updates: {
      url: "https://u.expo.dev/edcdb2bd-3931-4987-9338-fa6de394bc86",
    },
  },
};
