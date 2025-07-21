import { globalIgnores } from 'eslint/config'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'

// Optional TSX support in Vue SFCs
// import { configureVueProject } from '@vue/eslint-config-typescript'
// configureVueProject({ scriptLangs: ['ts', 'tsx'] })

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx,vue}'],

    languageOptions: {
      ecmaVersion: 2018,
      sourceType: 'module',
      globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
      },
    },

    rules: {
      'indent': ['error', 2],
      'semi': 'off',
      'quotes': ['error', 'single'],
      'block-scoped-var': 'error',

      'vue/html-indent': ['error', 2],
      'vue/max-attributes-per-line': ['error', { singleline: 3 }],
    },
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,
)

