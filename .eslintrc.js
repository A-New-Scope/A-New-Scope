module.exports = {
  "env": {
    "es6": true
  },
  "extends": [
    "airbnb",
    "angular",
    "eslint:recommended",
    "hackreactor",
    "plugin:node/recommended"
  ],
  "parserOptions": {
    "sourceType": "module"
  },
  "plugins": [
    "html",
    "node",
    "promise"
    ],
  "rules": {
    "node/exports-style": ["error", "module.exports"],
    "no-var": "error"
  }
};