module.exports = {
    root: true,
    env: {
        browser: true,
        es2020: true,
    },
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
        "plugin:prettier/recommended",
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
            jsx: true,
        },
    },
    plugins: ["@typescript-eslint", "react-refresh"],
    settings: {
        react: {
            version: "detect",
        },
    },
    rules: {
        "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
        "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
        "react/react-in-jsx-scope": "off",
    },
    ignorePatterns: ["dist", "node_modules"],
};
