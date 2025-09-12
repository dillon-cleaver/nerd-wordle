import React from "react";
import Svg, { Path, Circle } from "react-native-svg";

type IconName = "close" | "info-circle" | "home" | "trophy";

interface IconProps {
  name: IconName;
  size: number;
  color: string;
}

/**
 * Custom SVG icon component
 * Replaces @expo/vector-icons to reduce bundle size
 *
 * Benefits:
 * - No external font loading
 * - Only includes icons we actually use
 * - Crisp at any size
 * - Bundle savings: ~200-300KB
 */
export const SvgIcon: React.FC<IconProps> = ({ name, size, color }) => {
  const renderIcon = () => {
    switch (name) {
      case "close":
        return (
          <Svg width={size} height={size} viewBox="0 0 24 24">
            <Path
              d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
              fill={color}
            />
          </Svg>
        );

      case "info-circle":
        return (
          <Svg width={size} height={size} viewBox="0 0 24 24">
            <Circle
              cx="12"
              cy="12"
              r="10"
              stroke={color}
              strokeWidth="2"
              fill="none"
            />
            <Path
              d="M12 8v4m0 4h.01"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </Svg>
        );

      case "home":
        return (
          <Svg width={size} height={size} viewBox="0 0 24 24">
            <Path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill={color} />
          </Svg>
        );

      case "trophy":
        return (
          <Svg width={size} height={size} viewBox="0 0 24 24">
            <Path
              d="M12 2A3 3 0 0 1 15 5V7H19A1 1 0 0 1 20 8V12A4 4 0 0 1 16 16H15.42A2 2 0 0 1 14 17.24V20H16V22H8V20H10V17.24A2 2 0 0 1 8.58 16H8A4 4 0 0 1 4 12V8A1 1 0 0 1 5 7H9V5A3 3 0 0 1 12 2M12 4A1 1 0 0 0 11 5V7H13V5A1 1 0 0 0 12 4M6 9V12A2 2 0 0 0 8 14A2 2 0 0 0 10 12V9H6M14 9V12A2 2 0 0 0 16 14A2 2 0 0 0 18 12V9H14Z"
              fill={color}
            />
          </Svg>
        );

      default:
        return (
          <Svg width={size} height={size} viewBox="0 0 24 24">
            <Circle cx="12" cy="12" r="10" fill={color} />
            <Path d="M12 8v8m0-4h8" stroke="white" strokeWidth="2" />
          </Svg>
        );
    }
  };

  return renderIcon();
};
