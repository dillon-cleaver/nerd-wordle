import { Stack } from "expo-router";
import { colors } from "@/constants/styles";

export default function WordsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: colors.neutral.background,
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Words",
        }}
      />
      <Stack.Screen
        name="[category]"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
