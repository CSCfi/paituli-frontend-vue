<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import { APP_SETTINGS, URLS } from '@/shared/constants';
import AppLink from '@/components/common/AppLink.vue';

// Four header badges: the environment in use, the deployed frontend and
// backend branches, and how long ago the frontend was deployed ("updated
// 02:14:07 ago"). Shown whenever either branch is something else than master,
// or when forced with VITE_SHOW_BUILD_INFO - see `constants.ts`.

const { t } = useI18n({ useScope: 'global' })

// Both deployments report the same shape: the backend from an endpoint, the
// frontend from a file the install playbook wrote into its web root.
type BuildInfo = { branch?: string; builtAt?: string; commit?: string }

async function fetchBuildInfo(url: string): Promise<BuildInfo> {
  try {
    const response = await fetch(url, { cache: 'no-store' })
    if (!response.ok) return {}
    return await response.json()
  } catch (error) {
    console.warn(`Could not fetch build info from ${url}:`, error)
    return {}
  }
}

// The badges appear once the responses land, and a deployment that does not
// answer is left out of the header.
const frontendBranch = ref('')
const backendBranch = ref('')

// Vite stamps the build, which the deployment overrides with its install time
const deployTime = ref(APP_SETTINGS.BUILD_TIME)

onMounted(async () => {
  const [frontend, backend] = await Promise.all([
    fetchBuildInfo(URLS.BUILD_INFO_FILE),
    fetchBuildInfo(URLS.BUILD_INFO_API),
  ])
  frontendBranch.value = frontend.branch ?? ''
  backendBranch.value = backend.branch ?? ''
  if (frontend.builtAt) deployTime.value = frontend.builtAt
})

const visible = computed(() =>
  APP_SETTINGS.SHOW_BUILD_INFO ||
  [frontendBranch.value, backendBranch.value]
    .some((branch) => branch && branch !== 'master'),
)

// The Matomo tag doubles as the badge label, shortened to keep the badge
// narrow. The tag itself is reported to analytics as is.
const envTag = APP_SETTINGS.MATOMO_TAG === 'PRODUCTION'
  ? 'PROD'
  : APP_SETTINGS.MATOMO_TAG

const envLabel = [APP_SETTINGS.ENV_EMOJI, envTag].filter(Boolean).join(' ')

const frontendUrl = computed(
  () => `${URLS.GITHUB_FRONTEND}/commits/${frontendBranch.value}`,
)
const backendUrl = computed(
  () => `${URLS.GITHUB_BACKEND}/commits/${backendBranch.value}`,
)

const buildDate = computed(() => new Date(deployTime.value))
const buildTimeValid = computed(() => !isNaN(buildDate.value.getTime()))

// Ticking "now", so the elapsed time stays up to date without a reload
const now = ref(new Date())
let timer: number | undefined

// The clock only runs while the badges are on screen
watch(visible, (show) => {
  if (!show || timer) return
  timer = window.setInterval(() => (now.value = new Date()), 1000)
}, { immediate: true })

onUnmounted(() => window.clearInterval(timer))

const pad = (n: number) => String(n).padStart(2, '0')

// Elapsed time as `hh:mm:ss`, prefixed with `Nd` from a day onwards
const elapsed = computed(() => {
  const totalSeconds = Math.max(
    0,
    Math.floor((now.value.getTime() - buildDate.value.getTime()) / 1000),
  )
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  const clock = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
  return days ? `${days}d ${clock}` : clock
})
</script>

<template>
  <template v-if="visible">
    <span v-if="envLabel" class="header-badge env-info">
      {{ envLabel }}
    </span>
    <span v-if="frontendBranch" class="header-badge frontend-info">
      🖥️ <AppLink :to="frontendUrl">{{ frontendBranch }}</AppLink>
    </span>
    <span v-if="backendBranch" class="header-badge backend-info">
      ⚙️ <AppLink :to="backendUrl">{{ backendBranch }}</AppLink>
    </span>
    <span v-if="buildTimeValid" class="header-badge build-info">
      {{ t('build.updated_ago', { time: elapsed }) }}
    </span>
  </template>
</template>

<style scoped>
.header-badge {
  font-family: monospace;
  font-size: 0.8rem;
  font-weight: normal;
  white-space: nowrap;
  padding: 2px 8px;
  border-radius: 10px;
  color: var(--c-text-system);
  cursor: default;

  /* Keep the branch links in the badges' own type scale */
  c-link {
    font-size: inherit;
    font-family: inherit;
  }
}

.env-info {
  background: var(--c-info-200, #dbe9f7);
}

.frontend-info {
  background: var(--c-primary-100, #e3eff0);
}

.backend-info {
  background: var(--c-tertiary-100, #f2e5f2);
}

.build-info {
  background: var(--c-warning-100, #fff4e0);
}

@media (max-width: 900px) {
  .header-badge {
    display: none;
  }
}
</style>
