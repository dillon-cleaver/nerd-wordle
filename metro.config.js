const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Production optimizations
if (process.env.NODE_ENV === "production") {
  // Disable source maps in production builds
  config.serializer = {
    ...config.serializer,
    createModuleIdFactory: () => (path) => {
      // Use shorter module IDs for smaller bundle
      return require("crypto")
        .createHash("md5")
        .update(path)
        .digest("hex")
        .slice(0, 8);
    },
  };

  // Minify more aggressively
  config.transformer = {
    ...config.transformer,
    minifierConfig: {
      // More aggressive minification
      keep_fnames: false,
      mangle: {
        keep_fnames: false,
      },
    },
  };
}

module.exports = config;
