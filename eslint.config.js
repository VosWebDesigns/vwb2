export default [
  {
    ignores: ['node_modules/**', 'dist/**', 'assets/**', 'src/pages/404.jsx'],
  },
  {
    files: ['src/**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        console: 'readonly',
        document: 'readonly',
        window: 'readonly',
        navigator: 'readonly',
        Node: 'readonly',
        MutationObserver: 'readonly',
        DOMParser: 'readonly',
        URL: 'readonly',
        Request: 'readonly',
        fetch: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
      },
    },
  },
];
