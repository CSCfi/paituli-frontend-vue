<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

// The one readout every preview uses. Whether it can show a percentage depends
// on the format: a whole file has a real total, while a ranged read of a
// GeoTIFF gains one request at a time and never knows how many are left.
const {
  bytesRead,
  bytesExpected,
  determinate = false,
  pinned = false,
} = defineProps<{
  bytesRead: number
  bytesExpected: number
  determinate?: boolean
  pinned?: boolean
}>()

const { t } = useI18n()

const size = (bytes: number) => bytes < 1e6
  ? `${Math.round(bytes / 1e3)} kB`
  : `${(bytes / 1e6).toFixed(1)} MB`

const percent = computed(() => determinate && bytesExpected
  ? Math.min(100, Math.round((bytesRead / bytesExpected) * 100))
  : 0)

// Worth showing even without a total to measure it against
const label = computed(() => {
  if (!bytesRead) return t('connecting')
  const read = size(bytesRead)
  return bytesExpected
    ? t('loaded_of', { read, total: size(bytesExpected) })
    : t('loaded', { read })
})
</script>

<template>
  <div class="progress" :class="{ pinned }">
    <c-progress-bar
      hide-details
      :indeterminate="!determinate || !bytesExpected"
      :value="percent" />
    <span class="label">{{ label }}</span>
  </div>
</template>

<i18n>
{
  "en": {
    "connecting": "Contacting the archive",
    "loaded": "Loaded {read}",
    "loaded_of": "Loaded {read} of {total}",
  },
  "fi": {
    "connecting": "Yhdistetään arkistoon",
    "loaded": "Ladattu {read}",
    "loaded_of": "Ladattu {read} / {total}",
  },
}
</i18n>

<style scoped>
/* Out of flow, so that whatever it sits over keeps its own layout */
.progress {
  position: absolute;
  width: min(320px, 70%);

  display: flex;
  flex-direction: column;
  gap: 0.4em;
}

/* Once there is something to look at, the readout moves off the middle of it */
.progress.pinned {
  bottom: 0.75em;
  left: 50%;
  transform: translateX(-50%);

  padding: 0.5em 0.75em;
  background: var(--c-white);
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
}

.label {
  font-size: 0.85em;
  color: var(--c-tertiary-800);
  text-align: center;
}
</style>
