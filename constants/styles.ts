const colors = {
  primary: {
    main: "#00a09b", // Billiard - Strong and central.
  },
  secondary: {
    main: "#26be95", // Herbal - Complements primary.
    lighter: "#e3b455", // Cookie Crust - Softer, good for backgrounds or accents.
  },
  accent: {
    primary: "#6b33f2", // Meteor Shower -  A vibrant, primary accent.
    secondary: "#46f7a7", // Illicit Green - Another vibrant accent.
  },
  neutral: {
    darkBlue: "#124763", // Moroccan Blue - Darker neutral, useful for text/backgrounds.
    darkGreen: "#2c696b", // Atlantis - Another darker neutral.
    white: "#ffffff",
    black: "#1e212b",
    lightGray: "#e9eaf2",
    darkGray: "#464d5f",
  },
  semantic: {
    success: "#0a6318", // Overgrown Temple
    warning: "#ffc107",
    error: "#d31e13", // Snake Fruit
  },
} as const;

const fontFamily = {
  bitter: {
    regular: "Bitter-Regular",
    bold: "Bitter-Bold",
    italic: "Bitter-Italic",
    boldItalic: "Bitter-BoldItalic",
    medium: "Bitter-Medium",
  },
} as const;

const fontSize = {
  title: {
    xLarge: 32,
    large: 24,
    medium: 18,
    base: 16,
  },
  body: {
    large: 20,
    medium: 18,
    base: 16,
  },
};

const lineHeight = {
  title: {
    xLarge: 40,
    large: 32,
    medium: 24,
    base: 24,
  },
  body: {
    large: 24,
    medium: 24,
    base: 24,
  },
};

const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

const borderRadius = {
  sm: 4,
  md: 8,
  lg: 16,
  xl: 24,
  round: "50%",
} as const;

export { colors, fontFamily, fontSize, lineHeight, spacing, borderRadius };
