import globals from 'globals'
import pluginJs from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'

const compact = new FlatCompat({})

export default [
    pluginJs.configs.recommended,
    ...compact.extends('airbnb', 'plugin:prettier/recommended'),
    {
        files: ['**/*.js'],
        languageOptions: {
            sourceType: 'commonjs',
            globals: globals.node,
        },
        ignores: ['**/*.config.js', '!**/eslint.config.js'],
    },
]
