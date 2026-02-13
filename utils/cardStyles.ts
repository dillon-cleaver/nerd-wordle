import { Platform, ViewStyle } from "react-native";
import { shadow } from "@/constants/styles";

export const getCardOverlayStyle = (accentColor: string): ViewStyle => ({
  borderColor: accentColor,
  backgroundColor: "transparent",
  overflow: "hidden",
});

export const cardShadowStyle: ViewStyle = Platform.select({
  ios: {
    shadowColor: shadow.wordCard.color,
    shadowOffset: {
      width: shadow.wordCard.offsetX,
      height: shadow.wordCard.offsetY,
    },
    shadowOpacity: shadow.wordCard.opacity,
    shadowRadius: shadow.wordCard.radius,
  },
  android: { elevation: shadow.wordCard.elevation },
}) as ViewStyle;
