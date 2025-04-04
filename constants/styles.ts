export const colors = {
  // Primary colors - using the blue palette
  primary: {
    main: "#457B9D", // Dillon's BLUE
    light: "#A8DADC", // Dillon's PALE
    dark: "#1D3557", // Dillon's DARK
    contrastText: "#FFFFFF", // Dillon's WHITE
  },

  // Secondary colors - using the red
  secondary: {
    main: "#E63946", // Dillon's RED
    light: "#FF6B6B", // Generated lighter red
    dark: "#C1121F", // Generated darker red
    contrastText: "#FFFFFF", // Dillon's WHITE
  },

  // Neutral colors
  neutral: {
    white: "#FFFFFF", // Dillon's WHITE
    black: "#000000", // Dillon's BLACK
    grey: {
      50: "#F1FAEE", // Dillon's LIGHT
      100: "#F4F4F8", // Dillon's LIGHT_GRAY
      200: "#E9E9ED", // Generated for gradient
      300: "#CACBD4", // Dillon's MEDIUM_GRAY
      400: "#B0B1BA", // Generated for gradient
      500: "#9697A0", // Generated for gradient
      600: "#7C7D86", // Generated for gradient
      700: "#62636C", // Generated for gradient
      800: "#484952", // Generated for gradient
      900: "#323241", // Dillon's DARK_GRAY
    },
  },

  // Semantic colors
  semantic: {
    success: {
      main: "#4CAF50", // Generated success green
      light: "#81C784", // Generated light success
      dark: "#388E3C", // Generated dark success
    },
    warning: {
      main: "#FFC107", // Generated warning yellow
      light: "#FFD54F", // Generated light warning
      dark: "#FFA000", // Generated dark warning
    },
    error: {
      main: "#E63946", // Dillon's RED
      light: "#FF6B6B", // Generated lighter red
      dark: "#C1121F", // Generated darker red
    },
    info: {
      main: "#457B9D", // Dillon's BLUE
      light: "#A8DADC", // Dillon's PALE
      dark: "#1D3557", // Dillon's DARK
    },
  },

  // Background colors
  background: {
    paper: "#F1FAEE", // Dillon's LIGHT
    dark: "#1D3557", // Dillon's DARK
  },

  // Text colors
  text: {
    primary: "#F1FAEE", // Dillon's LIGHT
    secondary: "#7C7D86", // Generated for hierarchy
    disabled: "#CACBD4", // Dillon's MEDIUM_GRAY
    hint: "#9697A0", // Generated for hierarchy
  },
} as const;

// Font families
export const fonts = {
  bitter: {
    regular: "Bitter-Regular",
    bold: "Bitter-Bold",
    italic: "Bitter-Italic",
    boldItalic: "Bitter-BoldItalic",
    medium: "Bitter-Medium",
  },
} as const;

// Type for the colors object
export type Colors = typeof colors;

// Common spacing values
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

// Common border radius values
export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 16,
  xl: 24,
  round: "50%",
} as const;

// Common shadow values
export const shadows = {
  sm: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
} as const;
