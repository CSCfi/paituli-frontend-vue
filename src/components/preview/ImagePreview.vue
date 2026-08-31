<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { CAlertType } from '@cscfi/csc-ui'

import type { PreviewSource } from '@/modules/preview'

const { source } = defineProps<{ source: PreviewSource }>()

const { t } = useI18n()

const viewport = ref<HTMLElement>()
const image = ref<HTMLImageElement>()

const loading = ref(true)
const failed = ref(false)

// The whole image is fitted by default; print-scale rasters are unreadable that
// way, so a click switches to actual pixel size and scrolls instead.
const actualSize = ref(false)

// Zooming keeps the clicked spot under the cursor, so that a corner of a map
// sheet can be read by clicking it rather than by hunting for it afterwards.
async function toggleZoom(event: MouseEvent) {
  if (actualSize.value) {
    actualSize.value = false
    return
  }

  const img = image.value
  const box = viewport.value
  if (!img || !box) return

  // The point that was clicked, as a fraction of the fitted image
  const fitted = img.getBoundingClientRect()
  const fractionX = (event.clientX - fitted.left) / fitted.width
  const fractionY = (event.clientY - fitted.top) / fitted.height

  actualSize.value = true
  await nextTick()

  // Put that same point of the full-size image back under the cursor. Values
  // out of range are clamped by the browser, which keeps edge clicks sane.
  const view = box.getBoundingClientRect()
  box.scrollLeft = fractionX * img.offsetWidth - (event.clientX - view.left)
  box.scrollTop = fractionY * img.offsetHeight - (event.clientY - view.top)
}

function onError() {
  loading.value = false
  failed.value = true
}
</script>

<template>
  <div ref="viewport" class="image-preview" :class="{ scrollable: actualSize }">
    <c-spinner v-if="loading" size="50" />
    <c-alert v-if="failed" :type="CAlertType.Error">
      {{ t('failed', { name: source.name }) }}
    </c-alert>
    <!-- An <img> needs no CORS header of its own, but requesting one keeps the
         canvas untainted, so the same image stays usable by a canvas or WebGL
         renderer. It relies on the archive allowing our origin. -->
    <img
      ref="image"
      v-show="!loading && !failed"
      :src="source.url"
      crossorigin="anonymous"
      :alt="source.name"
      :title="t(actualSize ? 'fit' : 'zoom')"
      @load="loading = false"
      @error="onError"
      @click="toggleZoom" />
  </div>
</template>

<i18n>
{
  "en": {
    "failed": "Could not load {name}.",
    "zoom": "Click to view at actual size",
    "fit": "Click to fit the view",
  },
  "fi": {
    "failed": "Tiedostoa {name} ei voitu ladata.",
    "zoom": "Napsauta nähdäksesi todellisessa koossa",
    "fit": "Napsauta sovittaaksesi näkymään",
  },
}
</i18n>

<style scoped>
.image-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  overflow: hidden;

  /* A neutral mid-tone backdrop, so that both light and dark rasters and any
     transparent margins stay readable against it. */
  background-color: var(--c-tertiary-300);
}

/* Block layout while scrolling: centring an overflowing flex item puts part of
   it outside the scrollable area, where no scroll position can reach it. */
.image-preview.scrollable {
  display: block;
  overflow: auto;
}

img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  cursor: zoom-in;
}

.scrollable img {
  display: block;
  max-width: none;
  max-height: none;
  margin: auto;
  cursor: zoom-out;
}
</style>
