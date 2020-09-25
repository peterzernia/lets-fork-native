const path = require('path')

module.exports = {
  env: {
    browser: true,
    es6: true,
    jest: true,
    "react-native/react-native": true,
  },
  extends: [
    'airbnb',
    'plugin:@typescript-eslint/recommended'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
      tsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    'react',
    '@typescript-eslint',
    'react-hooks',
    'react-native',
  ],
  rules: {
    "semi": ['error', 'never', { 'beforeStatementContinuationChars': 'always'}],
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "react/jsx-filename-extension": ["error", { "extensions": [".js", ".jsx", ".ts", ".tsx"] }],
    "camelcase": 0,
    "react-native/no-unused-styles": 2,
    "react-native/split-platform-components": 2,
    "react-native/no-inline-styles": 0,
    "react-native/no-color-literals": 0,
    "react-native/no-raw-text": 0,
    "react-native/no-single-element-style-arrays": 2,
    "no-use-before-define": 0,
    "no-console": 0,
    "react/jsx-props-no-spreading": 0,
    "import/no-extraneous-dependencies": ["error", {"devDependencies": ["**/*.test.ts", "**/*.test.tsx"]}],
    "@typescript-eslint/ban-types": 1,
    "react/require-default-props": 0,
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: [".js", ".ts", ".tsx"],
        paths: ".",
      }
    },
    'react-native/style-sheet-object-names': ['EStyleSheet', 'OtherStyleSheet', 'PStyleSheet'],
  },
}