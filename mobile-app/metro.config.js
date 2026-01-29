const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Remove custom watchFolders and resolver overrides to match Expo's defaults

module.exports = config;