module.exports = {
  "env": {
    "browser": true,
    "es6": true,
    "node": true
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
  "root": true,
  "rules": {
    "node/exports-style": ["error", "module.exports"],
    "no-var": "error"
  }
};