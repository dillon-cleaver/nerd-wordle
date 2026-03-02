/**
 * Standardized icon sizes for the SvgIcon component
 * Provides consistent sizing across the application
 */
export const iconSizes = {
  /**
   * Small icons - 16px
   * Used for: inline elements, small UI accents
   */
  small: 16,

  /**
   * Standard icons - 24px
   * Used for: navigation, buttons, modals, drawer items
   */
  standard: 24,

  /**
   * Large icons - 32px
   * Used for: prominent navigation elements, headers
   */
  large: 32,
} as const;

export type IconSize = (typeof iconSizes)[keyof typeof iconSizes];
