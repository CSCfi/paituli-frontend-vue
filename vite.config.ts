import { execFileSync } from 'node:child_process'
import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'

// Branch of the checkout being built, for the header build info. 
// Empty if the build machine has no git checkout available. 
function gitBranch() {
  try {
    return execFileSync('git', ['rev-parse', '--abbrev-ref', 'HEAD'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim()
  } catch {
    return ''
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')

  return {
    define: {
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
      __GIT_BRANCH__: JSON.stringify(gitBranch()),
    },
    plugins: [
      vue({
        template: {
          compilerOptions: {
            isCustomElement: (tag) => tag.startsWith('c-'),
          },
        },
      }),
      VueI18nPlugin(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
    // This proxy is only active when serving with Vite, in dev mode.
    // The target url is the development backend address.
      proxy: {
        '/api': {
          target: 'http://localhost:8080',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
    // An alternative base path could be defined only on some modes,
    // if we want to host e.g. a test version under paitulihost.fi/v4/...
    base: env.VITE_BASE_PATH || undefined
  }
})
