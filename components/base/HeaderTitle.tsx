import { View, Text, TouchableOpacity } from "react-native";
import { router, usePathname } from "expo-router";
import { colors, fontFamily, fontSize, lineHeight } from "@/constants/styles";

export const HeaderTitle = () => {
  const pathname = usePathname();

  const handlePress = () => {
    // Only navigate to home if not already on home screen
    if (pathname !== "/") {
      router.push("/");
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} style={{ alignItems: "center" }}>
      <View style={{ alignItems: "center" }}>
        <Text
          style={{
            fontFamily: fontFamily.bitter.bold,
            fontSize: fontSize.title.large,
            lineHeight: lineHeight.title.large,
            color: colors.neutral.white,
          }}
        >
          NerdWord
        </Text>
      </View>
    </TouchableOpacity>
  );
};
