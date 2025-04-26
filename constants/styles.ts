const colors = {
  categories: {
    science: "#3aacd8",
    fantasyAndSciFi: "#228b22",
    videoGames: "#e60012",
    animeAndManga: "#ff69b4",
    tabletopAndBoardGames: "#d2691e",
    techAndInternetCulture: "#708090",
  },
  tiles: {
    correct: "#26be95",
    wrongPlace: "#e3b455",
  },
  neutral: {
    white: "#ffffff",
    black: "#1e212b",
    lightGray: "#e9eaf2",
    darkGray: "#464d5f",
  },
  semantic: {
    success: "#0a6318",
    warning: "#ffc107",
    error: "#d31e13",
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
  openSans: {
    bold: "OpenSans-Bold",
    extraBoldItalic: "OpenSans-ExtraBoldItalic",
    italic: "OpenSans-Italic",
    medium: "OpenSans-Medium",
    regular: "OpenSans-Regular",
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
