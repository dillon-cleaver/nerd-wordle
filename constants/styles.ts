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
    defaultGradientStart: "#2c3038",
    defaultGradientEnd: "#1a1e24",
    wrongPlace: "#DAA520",
  },
  neutral: {
    white: "#ffffff",
    background: "#1e212b",
    black: "#000000",
    lightGray: "#e9eaf2",
    darkGray: "#464d5f",
  },
  wordCard: {
    gradientStart: "#242832",
    gradientEnd: "#14161d",
    badgeBackgroundOpacity: 0.2,
    badgeBorderOpacity: 0.4,
    textPrimary: "rgba(255,255,255,0.8)",
    textSecondary: "rgba(255,255,255,0.6)",
    textMuted: "rgba(255,255,255,0.5)",
    divider: "rgba(255,255,255,0.1)",
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
    small: 14,
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
    small: 20,
  },
};

const spacing = {
  xs: 4,
  sm: 8,
  smMd: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

const borderWidth = {
  wordCard: 2,
  badge: 1,
  divider: 1,
} as const;

const borderRadius = {
  sm: 4,
  md: 8,
  card: 12,
  lg: 16,
  xl: 24,
  pill: 999,
  round: "50%",
} as const;

const animation = {
  duration: {
    short: 300,
    medium: 600,
    long: 1000,
  },
} as const;

const gradient = {
  startPoint: { x: 0, y: 0 },
  endPoint: { x: 1, y: 1 },
} as const;

const shadow = {
  wordCard: {
    color: colors.neutral.black,
    offsetX: 0,
    offsetY: 8,
    opacity: 0.4,
    radius: 24,
    elevation: 8,
  },
} as const;

export {
  colors,
  fontFamily,
  fontSize,
  lineHeight,
  spacing,
  borderWidth,
  borderRadius,
  animation,
  gradient,
  shadow,
};
