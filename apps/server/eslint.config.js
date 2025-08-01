const typescriptEslint = require('typescript-eslint');

module.exports = [
    {
        ignores: ['dist/**/*', 'node_modules/**/*', '.eslintrc.js'],
    },
    ...typescriptEslint.configs.recommended,
    {
        languageOptions: {
            parser: typescriptEslint.parser,
            parserOptions: {
                project: './tsconfig.json',
                tsconfigRootDir: __dirname,
                sourceType: 'module',
            },
        },
        rules: {
            '@typescript-eslint/interface-name-prefix': 'off',
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
        },
    },
];
