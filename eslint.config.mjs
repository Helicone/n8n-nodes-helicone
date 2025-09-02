import js from '@eslint/js';
import globals from 'globals';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';

export default [
	// Base JavaScript configuration
	js.configs.recommended,

	// Global configuration for all files
	{
		languageOptions: {
			ecmaVersion: 2020,
			sourceType: 'module',
			globals: {
				...globals.node,
				...globals.es2020,
			},
		},
		rules: {
			// General JavaScript/TypeScript rules
			'no-console': 'warn',
			'no-unused-vars': 'warn',
			'no-undef': 'error',
			'semi': ['error', 'always'],
			'quotes': ['error', 'single'],
			'indent': ['error', 'tab', {
				'SwitchCase': 1,
				'VariableDeclarator': 1,
				'outerIIFEBody': 1,
				'MemberExpression': 1,
				'FunctionDeclaration': { 'parameters': 1, 'body': 1 },
				'FunctionExpression': { 'parameters': 1, 'body': 1 },
				'CallExpression': { 'arguments': 1 },
				'ArrayExpression': 1,
				'ObjectExpression': 1,
				'ImportDeclaration': 1,
				'flatTernaryExpressions': false,
				'ignoreComments': false
			}],
			'no-mixed-spaces-and-tabs': 'error',
			'no-tabs': 'off',
			'no-trailing-spaces': 'error',
			'eol-last': 'error',
			'object-curly-spacing': ['error', 'always'],
			'array-bracket-spacing': ['error', 'never'],
		},
	},

	// Configuration for TypeScript files
	{
		files: ['**/*.ts'],
		languageOptions: {
			parser: typescriptParser,
			parserOptions: {
				ecmaVersion: 2020,
				sourceType: 'module',
			},
		},
		plugins: {
			'@typescript-eslint': typescriptPlugin,
		},
		rules: {
			// Override no-unused-vars for TypeScript
			'no-unused-vars': 'off',
			'@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],

			// TypeScript specific rules
			'@typescript-eslint/explicit-function-return-type': 'off',
			'@typescript-eslint/no-explicit-any': 'warn',
			'@typescript-eslint/no-inferrable-types': 'error',
			'prefer-const': 'error',
		},
	},

	// Configuration for n8n specific patterns
	{
		files: ['nodes/**/*.ts', 'credentials/**/*.ts'],
		rules: {
			// n8n nodes often use camelCase for property names
			'camelcase': 'off',
			// n8n properties often have specific naming conventions
			'@typescript-eslint/naming-convention': 'off',
			// n8n uses console.log for debugging
			'no-console': 'off',
		},
	},

	// Configuration for JavaScript files
	{
		files: ['**/*.js'],
		languageOptions: {
			sourceType: 'commonjs',
		},
	},

	// Configuration for JSON files
	{
		files: ['**/*.json'],
		rules: {
			// Disable style rules for JSON
			'indent': 'off',
			'quotes': 'off',
			'semi': 'off',
			'no-unused-vars': 'off',
		},
	},

	// Files to ignore
	{
		ignores: [
			'node_modules/**',
			'dist/**',
			'*.d.ts',
			'coverage/**',
			'.nyc_output/**',
			'package.json',
			'package-lock.json',
			'tsconfig.json',
		],
	},
];
