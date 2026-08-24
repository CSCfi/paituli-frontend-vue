<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { APP_SETTINGS } from '@/shared/constants';

// Shows how long ago the currently served frontend was built, e.g.
// "updated 02:14:07 ago". Only rendered in the staging (test) environment,
// toggled with VITE_SHOW_BUILD_INFO - see `constants.ts` and `.env.test`.

const { t } = useI18n({ useScope: 'global' })

const buildDate = new Date(APP_SETTINGS.BUILD_TIME)
const buildTimeValid = !isNaN(buildDate.getTime())

// Ticking "now", so the elapsed time stays up to date without a reload
const now = ref(new Date())
let timer: number | undefined

onMounted(() => {
  timer = window.setInterval(() => (now.value = new Date()), 1000)
})
onUnmounted(() => window.clearInterval(timer))

const pad = (n: number) => String(n).padStart(2, '0')

// Elapsed time as `hh:mm:ss`, prefixed with `Nd` from a day onwards
const elapsed = computed(() => {
  const totalSeconds = Math.max(
    0,
    Math.floor((now.value.getTime() - buildDate.getTime()) / 1000),
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
  <span v-if="buildTimeValid" class="build-info">
    {{ t('build.updated_ago', { time: elapsed }) }}
  </span>
</template>

<style scoped>
.build-info {
  font-family: monospace;
  font-size: 0.8rem;
  font-weight: normal;
  white-space: nowrap;
  padding: 2px 8px;
  border-radius: 10px;
  color: var(--c-text-system);
  background: var(--c-warning-100, #fff4e0);
  cursor: default;
}

@media (max-width: 900px) {
  .build-info {
    display: none;
  }
}
</style>
