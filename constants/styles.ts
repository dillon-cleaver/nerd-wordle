const colors = {
  categories: {
    science: "#CD66FF",
    videoGames: "#FF659A",
    movies: "#FF0200",
    animeAndManga: "#FF9901",
    tabletopAndBoardGames: "#FFFF00",
    fantasyAndSciFi: "#059901",
    techAndInternetCulture: "#0199CC",
    superheroes: "#35009A",
    literature: "#99019A",
  },
  tiles: {
    // TODO: Revisit this default color
    default: "#242730",
    wrongPlace: "#DAA520",
  },
  neutral: {
    white: "#ffffff",
    background: "#1e212b",
    black: "#000000",
    lightGray: "#e9eaf2",
    darkGray: "#464d5f",
  },
  semantic: {
    success: "#26be95",
    warning: "#e3b455",
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

const animation = {
  duration: {
    short: 300,
    medium: 600,
    long: 1000,
  },
} as const;

export {
  colors,
  fontFamily,
  fontSize,
  lineHeight,
  spacing,
  borderRadius,
  animation,
};
