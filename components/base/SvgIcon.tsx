import React from "react";
import Svg, { Path, Circle } from "react-native-svg";

type IconName =
  | "close"
  | "info-circle"
  | "home"
  | "trophy"
  | "menu"
  | "chevron-right";

interface IconProps {
  name: IconName;
  size: number;
  color: string;
}

// TODO: Update this per https://blog.swmansion.com/you-might-not-need-react-native-svg-b5c65646d01f

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
              d="M18 6L6 18M6 6L18 18"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </Svg>
        );

      case "info-circle":
        return (
          <Svg width={size} height={size} viewBox="0 0 24 24">
            <Path
              d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </Svg>
        );

      case "home":
        return (
          <Svg width={size} height={size} viewBox="0 0 24 24">
            <Path
              d="M15 21V13C15 12.7348 14.8946 12.4804 14.7071 12.2929C14.5196 12.1053 14.2652 12 14 12H10C9.73478 12 9.48043 12.1053 9.29289 12.2929C9.10536 12.4804 9 12.7348 9 13V21M3 9.99999C2.99993 9.70906 3.06333 9.42161 3.18579 9.15771C3.30824 8.8938 3.4868 8.65979 3.709 8.47199L10.709 2.47199C11.07 2.1669 11.5274 1.99951 12 1.99951C12.4726 1.99951 12.93 2.1669 13.291 2.47199L20.291 8.47199C20.5132 8.65979 20.6918 8.8938 20.8142 9.15771C20.9367 9.42161 21.0001 9.70906 21 9.99999V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V9.99999Z"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </Svg>
        );

      case "trophy":
        return (
          <Svg width={size} height={size} viewBox="0 0 24 24">
            <Path
              d="M15.477 12.89L16.992 21.416C17.009 21.5164 16.9949 21.6196 16.9516 21.7118C16.9084 21.8039 16.838 21.8807 16.7499 21.9318C16.6619 21.9829 16.5603 22.0059 16.4588 21.9977C16.3573 21.9895 16.2607 21.9506 16.182 21.886L12.602 19.199C12.4292 19.0699 12.2192 19.0001 12.0035 19.0001C11.7878 19.0001 11.5778 19.0699 11.405 19.199L7.819 21.885C7.74032 21.9494 7.64386 21.9883 7.5425 21.9965C7.44113 22.0047 7.33967 21.9818 7.25166 21.9309C7.16365 21.8799 7.09328 21.8033 7.04992 21.7113C7.00656 21.6193 6.99229 21.5163 7.009 21.416L8.523 12.89M18 8C18 11.3137 15.3137 14 12 14C8.68629 14 6 11.3137 6 8C6 4.68629 8.68629 2 12 2C15.3137 2 18 4.68629 18 8Z"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </Svg>
        );

      case "menu":
        return (
          <Svg width={size} height={size} viewBox="0 0 24 24">
            <Path
              d="M4 12H20M4 6H20M4 18H20"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </Svg>
        );

      case "chevron-right":
        return (
          <Svg width={size} height={size} viewBox="0 0 24 24">
            <Path
              d="M9 18L15 12L9 6"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
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
