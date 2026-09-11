<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { CAlertType } from '@cscfi/csc-ui'

import OlMap from 'ol/Map'
import View from 'ol/View'
import ImageLayer from 'ol/layer/Image'
import ImageStatic from 'ol/source/ImageStatic'
import Projection from 'ol/proj/Projection'
import { getCenter } from 'ol/extent'

import PreviewProgress from './PreviewProgress.vue'
import { useTransfer } from '@/composables/transfer'
import type { PreviewSource } from '@/modules/preview'

// The image goes through OpenLayers rather than a plain <img> so that panning
// and zooming work the same as for a GeoTIFF. It carries no georeferencing of
// its own - a PNG's world file is a separate download - so the map works in
// pixels, which is enough to look at a map sheet.
const { source } = defineProps<{ source: PreviewSource }>()

const { t } = useI18n()
const transfer = useTransfer()

const container = ref<HTMLElement>()
const loading = ref(true)
const error = ref('')

let map: OlMap | undefined
let objectUrl: string | undefined

// A whole file arrives in one request, so the percentage is exact here
const active = computed(() => loading.value || transfer.inFlight.value > 0)

function release() {
  if (objectUrl) URL.revokeObjectURL(objectUrl)
  objectUrl = undefined
}

function teardown() {
  map?.setTarget(undefined)
  map?.dispose()
  map = undefined
  release()
}

// The only way to learn a bitmap's dimensions is to decode it. Passing the same
// blob URL to the layer afterwards reuses the browser's decoded copy rather
// than paying for it twice.
function measure(url: string) {
  return new Promise<{ width: number, height: number }>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve({
      width: image.naturalWidth,
      height: image.naturalHeight,
    })
    image.onerror = () => reject(new Error('The file could not be decoded'))
    image.src = url
  })
}

async function load() {
  loading.value = true
  error.value = ''
  transfer.reset()
  try {
    const blob = await transfer.fetchAll(source.fetchUrl)
    teardown()
    objectUrl = URL.createObjectURL(blob)

    const { width, height } = await measure(objectUrl)
    const extent = [0, 0, width, height]
    const projection = new Projection({
      code: 'preview-pixels',
      units: 'pixels',
      extent,
    })

    // Fitted from the container rather than through view.fit(), which needs the
    // map to have been sized already.
    const box = container.value
    const resolution = Math.max(
      width / (box?.clientWidth || width),
      height / (box?.clientHeight || height),
    )

    map = new OlMap({
      target: box,
      layers: [
        new ImageLayer({
          source: new ImageStatic({ url: objectUrl, imageExtent: extent, projection }),
        }),
      ],
      view: new View({
        projection,
        extent,
        showFullExtent: true,
        center: getCenter(extent),
        resolution,
      }),
    })
    loading.value = false
  } catch (cause) {
    console.error('Preview could not render image:', cause)
    error.value = cause instanceof Error ? cause.message : String(cause)
    loading.value = false
  }
}

onMounted(load)
watch(() => source.fetchUrl, load)
onUnmounted(teardown)
</script>

<template>
  <div class="image-preview">
    <div ref="container" class="map" :class="{ hidden: loading || error }"></div>

    <PreviewProgress
      v-if="active"
      :bytes-read="transfer.bytesRead.value"
      :bytes-expected="transfer.bytesExpected.value"
      determinate
      :pinned="!loading" />

    <c-alert v-else-if="error" :type="CAlertType.Error">
      {{ t('failed', { name: source.name }) }}
      <br />
      <code>{{ error }}</code>
    </c-alert>
  </div>
</template>

<i18n>
{
  "en": {
    "failed": "Could not load {name}.",
  },
  "fi": {
    "failed": "Tiedostoa {name} ei voitu ladata.",
  },
}
</i18n>

<style scoped>
.image-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
  height: 100%;
}

.map {
  width: 100%;
  height: 100%;

  /* A neutral mid-tone, so that both light and dark rasters and any
     transparent margins stay readable against it */
  background-color: var(--c-tertiary-300);
}

.map.hidden {
  visibility: hidden;
}

c-alert {
  position: absolute;
  max-width: 600px;
}

code {
  font-size: 0.85em;
  overflow-wrap: anywhere;
}
</style>
