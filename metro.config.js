const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * React Native nu JS bundler config
 */
const config = {};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);

