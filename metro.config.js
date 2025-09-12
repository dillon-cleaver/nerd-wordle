// metro.config.js - Updated to exclude words.json from client bundles

const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Exclude words.json from client bundles (it's served via CDN)
config.resolver.blockList = [
  ...config.resolver.blockList,
  /constants\/words\.json$/,
];

// Allow words.json for server/build-time usage but exclude from client runtime
config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
});

module.exports = config;
