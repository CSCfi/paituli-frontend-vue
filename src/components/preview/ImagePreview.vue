<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { CAlertType } from '@cscfi/csc-ui'

import OlMap from 'ol/Map'
import View from 'ol/View'
import ImageLayer from 'ol/layer/Image'
import ImageStatic from 'ol/source/ImageStatic'
import Projection from 'ol/proj/Projection'
import ScaleLine from 'ol/control/ScaleLine'
import { getCenter } from 'ol/extent'
import { get as getProjection } from 'ol/proj'

import '@/modules/projections'

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

// A bitmap carries no georeferencing of its own, but the archive keeps it in
// two text files beside the image: a world file with the pixel size and the
// origin, and a .prj naming the coordinate system. Neither is guaranteed to be
// there, so every step below can decline and leave the image in pixel space.
const WORLD_FILE: Record<string, string> = { png: 'pgw', jpg: 'jgw', jpeg: 'jgw' }

async function sidecar(url: string, extension: string) {
  const base = url.replace(/\.[^./]+$/, '')
  try {
    const response = await fetch(`${base}.${extension}`)
    return response.ok ? await response.text() : undefined
  } catch {
    // A missing sidecar is the normal case, not a failure worth reporting
    return undefined
  }
}

async function readSidecars(url: string) {
  const world = WORLD_FILE[url.split('.').pop()?.toLowerCase() ?? '']
  const [placement, wkt] = await Promise.all([
    world ? sidecar(url, world) : undefined,
    sidecar(url, 'prj'),
  ])
  return { placement, wkt }
}

// Six numbers: pixel size and rotation on each axis, then the origin.
function parseWorldFile(text: string) {
  const numbers = text.trim().split(/\s+/).map(Number)
  if (numbers.length < 6 || numbers.some((value) => !Number.isFinite(value))) return
  const [xScale, ySkew, xSkew, yScale, xOrigin, yOrigin] = numbers
  // A rotated or skewed placement is not expressible as a north-up extent
  if (ySkew !== 0 || xSkew !== 0 || !xScale || !yScale) return
  return { xScale, yScale, xOrigin, yOrigin }
}

// The coordinate system's own code is the last AUTHORITY in the WKT. The ones
// before it belong to the datum, the ellipsoid and the projection method.
function parseEpsg(wkt: string) {
  const codes = [...wkt.matchAll(/AUTHORITY\s*\[\s*"EPSG"\s*,\s*"?(\d+)"?\s*\]/gi)]
  const last = codes[codes.length - 1]
  return last ? `EPSG:${last[1]}` : undefined
}

// Turns the pair into something OpenLayers can draw in, or nothing if either
// file is absent, unreadable, or names a projection we have no definition for.
function georeference(
  sidecars: { placement?: string, wkt?: string },
  width: number,
  height: number) {

  if (!sidecars.placement || !sidecars.wkt) return
  const world = parseWorldFile(sidecars.placement)
  const code = parseEpsg(sidecars.wkt)
  if (!world || !code) return
  const projection = getProjection(code)
  if (!projection) return

  // The origin names the centre of the top-left pixel, so the edge of the
  // image is half a pixel further out again.
  const left = world.xOrigin - world.xScale / 2
  const top = world.yOrigin - world.yScale / 2
  const right = left + world.xScale * width
  const bottom = top + world.yScale * height
  return {
    projection,
    extent: [
      Math.min(left, right), Math.min(top, bottom),
      Math.max(left, right), Math.max(top, bottom),
    ],
  }
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
    // Read alongside the image rather than after it, so the two small files
    // cost no extra wait.
    const [blob, sidecars] = await Promise.all([
      transfer.fetchAll(source.fetchUrl),
      readSidecars(source.fetchUrl),
    ])
    teardown()
    objectUrl = URL.createObjectURL(blob)

    const { width, height } = await measure(objectUrl)
    const placed = georeference(sidecars, width, height)
    // Falls back to measuring the image in its own pixels, which is enough to
    // look at a map sheet but means no distance on screen is meaningful.
    const extent = placed?.extent ?? [0, 0, width, height]
    const projection = placed?.projection ?? new Projection({
      code: 'preview-pixels',
      units: 'pixels',
      extent,
    })

    // Fitted from the container rather than through view.fit(), which needs the
    // map to have been sized already.
    const box = container.value
    const spanX = extent[2] - extent[0]
    const spanY = extent[3] - extent[1]
    const resolution = Math.max(
      spanX / (box?.clientWidth || spanX),
      spanY / (box?.clientHeight || spanY),
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
    // Only where a distance on screen means something
    if (placed) map.addControl(new ScaleLine())
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

    <!-- Ahead of the indicator: once the file has failed there is nothing
         left for it to be waiting on -->
    <c-alert v-if="error" :type="CAlertType.Error">
      {{ t('failed', { name: source.name }) }}
      <br />
      <code>{{ error }}</code>
    </c-alert>

    <PreviewProgress
      v-else-if="active"
      :bytes-read="transfer.bytesRead.value"
      :bytes-expected="transfer.bytesExpected.value"
      determinate
      :pinned="!loading" />
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
