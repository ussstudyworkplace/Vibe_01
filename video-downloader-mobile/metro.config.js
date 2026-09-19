const {getDefaultConfig, mergeConfig} = require('@react-native-metro-config');

const defaultConfig = getDefaultConfig(__dirname);

const customConfig = {
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    assetExts: defaultConfig.resolver.assetExts.filter(ext => ext !== 'cjs'),
    sourceExts: [...defaultConfig.resolver.sourceExts, 'cjs', 'svg'],
  },
};

module.exports = mergeConfig(defaultConfig, customConfig);
