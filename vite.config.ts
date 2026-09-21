import { execSync } from 'node:child_process'
import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'

// The dev server has no build-info file, so badges read the working copy's
// own checkout instead. Builds never touch git.
const gitBuildInfo = (command: string) => {
  const git = (args: string) => {
    if (command !== 'serve') return ''
    try {
      return execSync(`git ${args}`, { stdio: ['ignore', 'pipe', 'ignore'] })
        .toString()
        .trim()
    } catch {
      return ''
    }
  }
  return {
    branch: git('rev-parse --abbrev-ref HEAD'),
    commit: git('rev-parse --short HEAD'),
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const buildInfo = gitBuildInfo(command)

  return {
    define: {
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
      __BUILD_BRANCH__: JSON.stringify(buildInfo.branch),
      __BUILD_COMMIT__: JSON.stringify(buildInfo.commit),
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
        // The geodata archive allows the Paituli origins but not localhost, so
        // in dev the preview reads files through here. Set as VITE_GEODATA_BASE
        // in .env.development; other modes address the archive directly.
        '/geodata': {
          target: 'https://www.nic.funet.fi',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/geodata/, '/index/geodata'),
        },
      },
    },
    // An alternative base path could be defined only on some modes,
    // if we want to host e.g. a test version under paitulihost.fi/v4/...
    base: env.VITE_BASE_PATH || undefined
  }
})
