module.exports = {
  root: true,
  extends: ['@react-native', 'plugin:@typescript-eslint/recommended'], // Extends the React Native ESLint config
  parser: '@babel/eslint-parser', // Use the modern parser
  parserOptions: {
    ecmaVersion: 2020, // Support modern JavaScript (ES2020)
    sourceType: 'module', // Enable ES modules (import/export)
    ecmaFeatures: {
      jsx: true, // Enable JSX syntax
    },
    requireConfigFile: false, // Allow parsing without a Babel config file
    babelOptions: {
      presets: ['@babel/preset-env', '@babel/preset-react'], // Specify Babel presets
    },
  },
  env: {
    browser: true,
    node: true,
    es2020: true,
  },
  settings: {
    react: {
      version: 'detect', // Automatically detect React version
    },
  },
};
