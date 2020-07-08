module.exports = {
  preset: '@testing-library/react-native',
  collectCoverageFrom: [
    './components/**/*',
    './screens/**/*',
    './utils/**/*',
    '!**/__snapshots__/*',
  ],
  moduleNameMapper: {
    '^ky$': require.resolve('ky').replace('index.js', 'umd.js'),
  },
  setupFiles: [
    './setupTests.ts',
  ],
  setupFilesAfterEnv: [
    '@testing-library/react-native/cleanup-after-each',
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native-community|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)', 'node_modules/(?!(jest-)?react-native|@react-native-community|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)',
  ],
  transform: {
    '^.+\\.(js|ts|tsx)$': require.resolve('react-native/jest/preprocessor.js'),
    '^.+\\.(bmp|gif|jpg|jpeg|mp4|png|psd|svg|webp|ttf|otf|m4v|mov|mp4|mpeg|mpg|webm|aac|aiff|caf|m4a|mp3|wav|html|pdf|obj)$': require.resolve(
      'jest-expo/src/preset/assetFileTransformer.js',
    ),
  },
}
