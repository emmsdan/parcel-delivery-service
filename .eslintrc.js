module.exports = {
  "root": true,
  "extends": "airbnb-base",
  "env": {
    "node": true,
    "es6": true,
    "mocha": true
  },
  "rules": {
    "one-var": 0,
    "one-var-declaration-per-line": 0,
    "new-cap": 0,
    "consistent-return": 0,
    "no-param-reassign": 0,
    "import/no-unresolved": 0,
    "comma-dangle": 0,
    "curly": ["error", "multi-line"],
    "no-shadow": ["error", { "allow": ["req", "done", "res", "err"] }],
    "valid-jsdoc": [1, {
      "requireReturn": false,
      "requireReturnType": false,
      "requireParamDescription": false,
      "requireReturnDescription": false
    }],
    "require-jsdoc": [1, {
        "require": {
            "FunctionDeclaration": true,
            "MethodDefinition": true,
            "ClassDeclaration": true
        }
    }]
  }
}