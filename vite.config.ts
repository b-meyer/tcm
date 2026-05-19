import { fileURLToPath, URL } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import anchor from 'markdown-it-anchor';
import Markdown from 'unplugin-vue-markdown/vite';
import { defineConfig } from 'vite-plus';
import { mdLinkRewriter, mdTableWrapper } from './src/scripts/markdown.ts';
import { slugify } from './src/scripts/utils.ts';

const IGNORE_PATTERNS: string[] = ['dist', 'node_modules'];

export default defineConfig({
  plugins: [
    vue({ include: [/\.vue$/u, /\.md$/u] }),
    Markdown({
      wrapperComponent: 'PageLayout',
      markdownItOptions: { html: true, linkify: true, typographer: true },
      markdownItSetup(md) {
        md.use(anchor, { permalink: false, slugify });
        md.use(mdLinkRewriter);
        md.use(mdTableWrapper);
      },
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  lint: {
    plugins: ['eslint', 'typescript', 'oxc', 'unicorn', 'import', 'vue', 'promise'],
    categories: {
      correctness: 'error',
      suspicious: 'error',
      perf: 'error',
      pedantic: 'error',
    },
    env: {
      browser: true,
      node: true,
      vue: true,
    },
    ignorePatterns: IGNORE_PATTERNS,
    rules: {
      'eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
      eqeqeq: ['error', 'smart'],
      'import/no-default-export': 'off',
      'unicorn/filename-case': 'off',
      'unicorn/no-null': 'off',
      'no-inline-comments': 'off',
      'no-warning-comments': 'off',
      'import/no-unassigned-import': ['error', { allow: ['**/*.css', '**/*.scss'] }],
    },
  },
  fmt: {
    singleQuote: true,
    sortImports: {
      internalPattern: ['@/'],
      newlinesBetween: false,
    },
    ignorePatterns: IGNORE_PATTERNS,
  },
});
