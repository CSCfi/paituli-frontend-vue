<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { CAlertType } from '@cscfi/csc-ui'
import { mdiChevronLeft, mdiChevronRight } from '@mdi/js'

import { vTooltip } from '@/directives/tooltip'

import OlMap from 'ol/Map'
import View, { type ViewOptions } from 'ol/View'
import TileLayer from 'ol/layer/WebGLTile'
import GeoTIFF from 'ol/source/GeoTIFF'
import ScaleLine from 'ol/control/ScaleLine'

import PreviewProgress from './PreviewProgress.vue'
import { useTransfer } from '@/composables/transfer'
import '@/modules/projections'
import {
  readProfile,
  UnreadableRaster,
  type RasterProfile,
} from '@/modules/rasterProfile'
import type { PreviewSource } from '@/modules/preview'

// Raw OpenLayers rather than vue3-openlayers here: the view has to come from
// the file's own metadata, which is only known once the GeoTIFF has been read,
// and there is no map state to share with the rest of the app.
const { source } = defineProps<{ source: PreviewSource }>()

const { t } = useI18n()
const transfer = useTransfer()

// A WebGL tile layer packs four bands per texture and GPUs offer only a handful
// of texture units, so files wider than this get one layer per band instead.
// The FMI daily rasters have 366 of them, one per day of the year.
const MAX_BANDS = 4

// How many bands on either side of the shown one are kept loading in the
// background, so that stepping through them does not wait for a read.
const PREFETCH = 2

// Layers are cached so that returning to a band is instant, but not without
// bound: each one holds a source with its own tile cache. Kept well clear of
// the prefetch window, whose layers are never evicted.
const MAX_CACHED_LAYERS = 16

// Zoom levels past native resolution, for a closer look at a small file or at
// one detail of a large one.
const EXTRA_ZOOM_IN = 2

// How many source pixels a single view may be drawn from. Zooming out is drawn
// from the smallest overview level the file has, so on a file with no pyramid
// at all it is drawn from the full-resolution image, and asking for the whole
// of a 19200 x 9600 sheet means decoding every one of its 184 million pixels
// before anything appears. Past this the view stops zooming out instead.
const DECODE_BUDGET = 16_000_000

const container = ref<HTMLElement>()
const loading = ref(true)
const error = ref('')
const bandCount = ref(0)
// Whether the file is too wide for the GPU to take whole, which decides both
// how a source over it is built and whether there is a band to step to.
const narrowed = computed(() => bandCount.value > MAX_BANDS)
// The band actually being drawn, and what the field shows while it is edited.
// The field only takes effect on Enter or on leaving it, so that typing "366"
// does not render bands 3 and 36 on the way.
const shown = ref(1)
const entry = ref('1')

let map: OlMap | undefined
let viewOptions: ViewOptions | undefined
// How the file has to be drawn to be recognisable, read before any source is
// built because both the source and its layer are configured from it
let profile: RasterProfile = {}

// Band number to the layer rendering it, in insertion order so that the oldest
// can be evicted first. OpenLayers' Map is imported as OlMap so that this is a
// plain JS Map and not, silently, a second map instance.
const layers = new Map<number, TileLayer>()

// Tiles in flight on the band being shown
const pending = ref(0)

// Anything at all still going on, whichever stage it is at. Tiles are counted
// separately from bytes because a tile served from the file's own block cache
// is decoded without a request being made at all.
const active = computed(() =>
  loading.value || pending.value > 0 || transfer.inFlight.value > 0)

// Only the metadata read has a total, and `loading` is what marks it
const determinate = computed(() =>
  loading.value && transfer.bytesExpected.value > 0)

// A GeoTIFF that fails to load leaves its `getView()` promise unsettled for
// good: OpenLayers logs the error, stores it and moves the source to an error
// state instead of rejecting. Racing the two is what turns a CORS refusal or a
// missing file into a message rather than a spinner that never stops.
function readView(tiff: GeoTIFF): Promise<ViewOptions> {
  return Promise.race([
    tiff.getView(),
    new Promise<ViewOptions>((_, reject) => {
      tiff.on('change', () => {
        if (tiff.getState() !== 'error') return
        const failure = tiff.getError()
        reject(failure instanceof Error ? failure : new Error('Failed to read the file'))
      })
    }),
  ])
}

function disposeLayer(index: number) {
  const layer = layers.get(index)
  if (!layer) return
  map?.removeLayer(layer)
  layer.getSource()?.dispose()
  layer.dispose()
  layers.delete(index)
}

function teardown() {
  for (const index of [...layers.keys()]) disposeLayer(index)
  map?.setTarget(undefined)
  map?.dispose()
  map = undefined
}

// Opens the file whole and lets it be zoomed either way. A GeoTIFF's overview
// levels become the view's zoom levels, so a file with no pyramid arrives with
// only the three OpenLayers pads its single level out to, all within one step
// of native resolution - which opens a 19200 pixel wide sheet at a twentieth of
// itself, with no way back out.
function widenZoom(options: ViewOptions, element: HTMLElement): ViewOptions {
  const { resolutions, extent } = options
  if (!resolutions?.length || !extent) return options

  const width = Math.max(element.clientWidth, 1)
  const height = Math.max(element.clientHeight, 1)
  // The resolution that puts the whole file on screen
  const whole = Math.max((extent[2] - extent[0]) / width,
    (extent[3] - extent[1]) / height)

  // A narrowed source reads one band however many the file holds; anything
  // else is decoded band by band, and the budget is spent that many times.
  const samples = narrowed.value ? 1 : Math.max(1, bandCount.value)
  const budget = DECODE_BUDGET / samples

  // As far out as the whole file, unless drawing that much of it at once costs
  // more than the budget allows.
  let coarsest = whole
  const overview = profile.overview
  if (overview && overview.width * overview.height > budget) {
    // One screen pixel covers resolution/level px of the level being drawn, so
    // the budget caps how much coarser than that level the view may go.
    const level = (extent[2] - extent[0]) / overview.width
    coarsest = Math.min(whole, level * Math.sqrt(budget / (width * height)))
  }

  // Only the ends of the array bound the view, but it also maps zoom levels
  // onto resolutions, so it is extended as the ladder it already is.
  const widened = [...resolutions]
  while (widened.length > 1 && widened[0] > coarsest) widened.shift()
  while (widened[0] * 2 < coarsest) widened.unshift(widened[0] * 2)
  if (widened[0] < coarsest) widened.unshift(coarsest)
  for (let step = 0; step < EXTRA_ZOOM_IN; step++) {
    widened.push(widened[widened.length - 1] / 2)
  }

  // Takes precedence over the zoom OpenLayers asked for
  return { ...options, resolutions: widened, resolution: coarsest }
}

// The profile decides as much of this as the file does. Bands are only
// requested individually for files too wide to upload whole, so `bands` is left
// off otherwise and OpenLayers reads every band as RGB(A).
function sourceOptions(bands?: number[]) {
  return {
    sources: [{
      url: source.fetchUrl,
      loader: transfer.loader,
      ...(bands ? { bands } : {}),
      // Absent unless the file left OpenLayers nothing to scale from
      ...(profile.min ? { min: profile.min, max: profile.max } : {}),
    }],
    // JPEG-compressed sheets store YCbCr rather than RGB
    convertToRGB: 'auto' as const,
    // A palette index has to reach the style as itself: scaled it would no
    // longer name an entry, and blended between neighbours it would name a
    // third colour rather than a shade of either.
    normalize: !profile.palette,
    interpolate: !profile.palette,
  }
}

// Builds the layer for one band, or returns the cached one.
function layerForBand(index: number, prebuilt?: GeoTIFF): TileLayer {
  const cached = layers.get(index)
  if (cached) {
    prebuilt?.dispose()
    return cached
  }

  // Reusing the source that already read this file's metadata saves reading it
  // again, which for some files is most of the wait.
  const tiff = prebuilt
    ?? new GeoTIFF(sourceOptions(narrowed.value ? [index] : undefined))

  // Only the band on show drives the indicator; prefetches stay quiet.
  tiff.on('tileloadstart', () => {
    if (index !== shown.value) return
    pending.value++
  })
  const settled = () => {
    if (index !== shown.value) return
    pending.value = Math.max(0, pending.value - 1)
  }
  tiff.on('tileloadend', settled)
  tiff.on('tileloaderror', settled)

  const layer = new TileLayer({
    source: tiff,
    visible: false,
    // Band 1 holds the index into the file's own ColorMap
    style: profile.palette
      ? { color: ['palette', ['band', 1], profile.palette] }
      : undefined,
  })
  layers.set(index, layer)
  map?.addLayer(layer)

  // Evict the least recently added layers that are not in the current window
  if (layers.size > MAX_CACHED_LAYERS) {
    for (const old of [...layers.keys()]) {
      if (layers.size <= MAX_CACHED_LAYERS) break
      if (Math.abs(old - index) <= PREFETCH) continue
      disposeLayer(old)
    }
  }

  return layer
}

// Shows one band and keeps its neighbours loading behind it. Layers in the
// window stay visible so that OpenLayers keeps fetching their tiles - only
// `visible` gates that, not opacity.
function showBand(index: number, prebuilt?: GeoTIFF) {
  const nearby = new Set([index])
  // Only a file read band by band has a neighbour worth holding. On one read
  // whole, every band is already in the layer on screen, and a second source
  // over it would fetch and decode the same tiles again underneath.
  if (narrowed.value) {
    for (let step = 1; step <= PREFETCH; step++) {
      if (index - step >= 1) nearby.add(index - step)
      if (index + step <= bandCount.value) nearby.add(index + step)
    }
  }

  shown.value = index
  entry.value = String(index)
  for (const wanted of nearby) {
    layerForBand(wanted, wanted === index ? prebuilt : undefined)
  }

  pending.value = 0
  for (const [current, layer] of layers) {
    layer.setVisible(nearby.has(current))
    layer.setOpacity(current === index ? 1 : 0)
  }
}

async function load() {
  loading.value = true
  error.value = ''
  pending.value = 0
  transfer.reset()
  try {
    // Read before the source, which is configured from it. A file we cannot
    // profile is still worth drawing on OpenLayers' own terms.
    const settled = transfer.open()
    try {
      profile = await readProfile(source.fetchUrl)
    } catch (cause) {
      if (cause instanceof UnreadableRaster) throw cause
      console.warn('Preview could not profile GeoTIFF:', cause)
      profile = {}
    } finally {
      settled()
    }

    // Read next for the band count, which decides whether the whole file can
    // go to the GPU, and for the projection and extent that become the view.
    const probe = new GeoTIFF(sourceOptions())
    viewOptions = await readView(probe)
    // `bandCount` is a runtime property of the source, which the WebGL tile
    // layer itself reads to size its textures.
    bandCount.value = (probe as unknown as { bandCount?: number }).bandCount ?? 1

    // A wide file needs a source restricted to one band, so the probe is of no
    // further use there; otherwise it becomes the first layer's source.
    if (narrowed.value) probe.dispose()

    teardown()
    map = new OlMap({
      target: container.value,
      view: new View(container.value
        ? widenZoom(viewOptions, container.value)
        : viewOptions),
    })
    map.addControl(new ScaleLine())
    showBand(clamp(shown.value), narrowed.value ? undefined : probe)
    loading.value = false
  } catch (cause) {
    // Unknown projections, missing files and CORS refusals all land here, and
    // the message OL raises is the most specific thing we have to show.
    console.error('Preview could not render GeoTIFF:', cause)
    error.value = cause instanceof Error ? cause.message : String(cause)
    loading.value = false
  }
}

function clamp(value: number) {
  return Math.min(Math.max(1, Math.round(value)), bandCount.value || 1)
}

// Every way of choosing a band goes through here. The guard belongs on this
// side rather than on the template's v-if, because a focusout can fire while a
// file switch is already removing the controls.
function go(value: number) {
  if (loading.value || error.value) return
  const index = clamp(value)
  if (index === shown.value) entry.value = String(index)
  else showBand(index)
}

// Steps from the band on screen, rather than from whatever half-typed value the
// field holds
function step(delta: number) {
  go(shown.value + delta)
}

// Brings a whole number into range rather than refusing it. Anything else - a
// decimal, an emptied field, text - leaves the band where it was.
function commit() {
  const typed = Number(entry.value)
  if (entry.value.trim() && Number.isInteger(typed)) go(typed)
  else entry.value = String(shown.value)
}

onMounted(load)

// A new file has to be read from scratch; a new band only swaps which of the
// already built layers is opaque, so the map stays on screen throughout.
watch(() => source.fetchUrl, load)

onUnmounted(teardown)
</script>

<template>
  <div class="geotiff-preview">
    <div ref="container" class="map" :class="{ hidden: loading || error }"></div>

    <!-- Kept up while tiles load too, the longest part for a large file -->
    <PreviewProgress
      v-if="active"
      :bytes-read="transfer.bytesRead.value"
      :bytes-expected="transfer.bytesExpected.value"
      :determinate="determinate"
      :pinned="!loading" />
    <c-alert v-else-if="error" :type="CAlertType.Error">
      {{ t('failed', { name: source.name }) }}
      <br />
      <code>{{ error }}</code>
    </c-alert>

    <div v-if="!loading && !error && narrowed" class="bands">
      <c-icon-button
        size="small"
        :disabled="shown <= 1"
        :aria-label="t('previous')"
        v-tooltip="t('previous')"
        @click="step(-1)">
        <c-icon :path="mdiChevronLeft" size="26px" />
      </c-icon-button>
      <span>{{ t('band') }}</span>
      <!-- A plain text field: type="number" brings native spin buttons that
           live in the component's shadow root, out of reach of our styles, and
           the stepper buttons replace them. -->
      <c-text-field
        v-model="entry"
        type="text"
        hide-details
        :aria-label="t('band')"
        @keyup.enter="commit"
        @focusout="commit" />
      <span class="total">{{ t('of', { count: bandCount }) }}</span>
      <c-icon-button
        size="small"
        :disabled="shown >= bandCount"
        :aria-label="t('next')"
        v-tooltip="t('next')"
        @click="step(1)">
        <c-icon :path="mdiChevronRight" size="26px" />
      </c-icon-button>
    </div>
  </div>
</template>

<i18n>
{
  "en": {
    "failed": "Could not render {name}.",
    "band": "Band",
    "of": "of {count}",
    "previous": "Previous band",
    "next": "Next band",
  },
  "fi": {
    "failed": "Tiedostoa {name} ei voitu piirtää.",
    "band": "Kanava",
    "of": "/ {count}",
    "previous": "Edellinen kanava",
    "next": "Seuraava kanava",
  },
}
</i18n>

<style scoped>
.geotiff-preview {
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


/* Floats over the map, in the corner the OL controls leave free */
.bands {
  position: absolute;
  right: 0.75em;
  bottom: 0.75em;

  display: flex;
  align-items: center;
  gap: 0.5em;
  padding: 0.4em 0.6em;

  background: var(--c-white);
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
}

/* Narrow enough to sit in the control, which the field is not by default */
c-text-field {
  flex: none;
  width: 3.25em;
  min-width: 0;
}

c-icon-button {
  --c-icon-button-text-color: var(--c-primary-600);
  --c-icon-button-background-color: var(--c-info-100);
  --c-icon-button-background-color-hover: var(--c-info-200);
  --c-icon-button-text-color-disabled: var(--c-tertiary-400);
  --c-icon-button-background-color-disabled: var(--c-white);
}

.total {
  white-space: nowrap;
}
</style>
