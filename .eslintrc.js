module.exports = {
  env: {
    es6: true,
    node: true
  },
  extends: [
    "eslint:recommended",
    "plugin:node/recommended",
  ],
  plugins: [
    "node",
  ],
  root: true,
  rules: {
    "comma-dangle": ["error", {arrays: "always-multiline", objects: "always-multiline"}],
    "eol-last": ["error", "always"],
    "eqeqeq": "error",
    "no-console": "off",
    "no-process-exit": "off",
    "no-process-env": "off",
    "no-trailing-spaces": "error",
    "no-unused-vars": ["error", {vars: "all", args: "none", ignoreRestSiblings: false}],
    "no-var": "error",
    "no-warning-comments": "warn",
    "prefer-const": "error",
    "quotes": ["error", "double"],
    "require-jsdoc": "off",
    "semi": ["error", "always"],
    "strict": ["error", "safe"],
    "valid-jsdoc": "warn",
  }
};
