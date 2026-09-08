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
import { registerProjections } from '@/modules/projections'
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

// How long a band may take to appear before it is worth saying so. Cached and
// prefetched bands arrive well inside this, so the indicator stays out of the
// way instead of blinking on every step.
const BUSY_DELAY = 300

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
const busy = ref(false)
const error = ref('')
const bandCount = ref(0)
// The band actually being drawn, and what the field shows while it is edited.
// The field only takes effect on Enter or on leaving it, so that typing "366"
// does not render bands 3 and 36 on the way.
const band = ref(1)
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

// Tiles in flight on the band being shown, which is what `busy` reflects once
// they have been outstanding for BUSY_DELAY
let pending = 0
let busyTimer: ReturnType<typeof setTimeout> | undefined

function updateBusy() {
  if (pending > 0) {
    if (busy.value || busyTimer) return
    busyTimer = setTimeout(() => {
      busyTimer = undefined
      busy.value = pending > 0
    }, BUSY_DELAY)
    return
  }
  clearTimeout(busyTimer)
  busyTimer = undefined
  busy.value = false
}

registerProjections()

// Anything at all still going on, whichever stage it is at
const active = computed(() =>
  loading.value || busy.value || transfer.inFlight.value > 0)

// Determinate only while the metadata is being read, which is what `loading`
// marks. Anything after that gains a request at a time and has no total.
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
  clearTimeout(busyTimer)
  busyTimer = undefined
  for (const index of [...layers.keys()]) disposeLayer(index)
  map?.setTarget(undefined)
  map?.dispose()
  map = undefined
}

// Opens the file whole and lets it be zoomed either way.
//
// A GeoTIFF's overview levels become the view's zoom levels, so a file with no
// overview pyramid arrives with only the three OpenLayers pads its single level
// out to, all within one step of native resolution. That opens a 19200 pixel
// wide map sheet at one image pixel per screen pixel - about a twentieth of it,
// with no way back out - and many of the MML sheets have no pyramid.
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
  const samples = bandCount.value > MAX_BANDS
    ? 1
    : Math.max(1, bandCount.value)
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
  // onto resolutions, so it is extended as the ladder it already is: whole
  // steps up to the limit, then the limit itself. Levels past it are dropped,
  // since there is nothing beyond the edge of the file to look at.
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

// How a source over this file has to be configured, which the profile decides
// as much as the file does. Bands are only requested individually for files too
// wide to upload whole, so `bands` is left off otherwise and OpenLayers reads
// every band as RGB(A).
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

  const narrowed = bandCount.value > MAX_BANDS
  // Reusing the source that already read this file's metadata saves reading it
  // again. That is most of the wait for a file whose directory sits at the very
  // end, where finding it means seeking through the whole thing.
  const tiff = prebuilt
    ?? new GeoTIFF(sourceOptions(narrowed ? [index] : undefined))

  // Only the band on show drives the busy indicator; prefetches stay quiet.
  tiff.on('tileloadstart', () => {
    if (index !== shown.value) return
    pending++
    updateBusy()
  })
  const settled = () => {
    if (index !== shown.value) return
    pending = Math.max(0, pending - 1)
    updateBusy()
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
// `visible` gates that, not opacity - while everything but the chosen band is
// drawn fully transparent.
function showBand(index: number, prebuilt?: GeoTIFF) {
  const nearby = new Set([index])
  for (let step = 1; step <= PREFETCH; step++) {
    if (index - step >= 1) nearby.add(index - step)
    if (index + step <= bandCount.value) nearby.add(index + step)
  }

  shown.value = index
  for (const wanted of nearby) {
    layerForBand(wanted, wanted === index ? prebuilt : undefined)
  }

  pending = 0
  updateBusy()
  for (const [current, layer] of layers) {
    layer.setVisible(nearby.has(current))
    layer.setOpacity(current === index ? 1 : 0)
  }
}

async function load() {
  loading.value = true
  error.value = ''
  transfer.reset()
  try {
    // Read before the source, because the source is configured from it. A file
    // we cannot profile is still worth showing on OpenLayers' own terms, so a
    // failure here is not the preview's failure - unless it is the one that
    // says nothing here can read the file's pixels at all.
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

    // The file's metadata is read next: its band count decides whether the
    // whole file can go to the GPU, and its projection and extent become the
    // view. Both are only knowable from the file.
    const probe = new GeoTIFF(sourceOptions())
    viewOptions = await readView(probe)
    // `bandCount` is a runtime property of the source, which the WebGL tile
    // layer itself reads to size its textures.
    bandCount.value = (probe as unknown as { bandCount?: number }).bandCount ?? 1

    // A wide file needs a source restricted to one band, so the probe is of no
    // further use there; otherwise it becomes the first layer's source.
    const narrowed = bandCount.value > MAX_BANDS
    if (narrowed) probe.dispose()

    teardown()
    map = new OlMap({
      target: container.value,
      view: new View(container.value
        ? widenZoom(viewOptions, container.value)
        : viewOptions),
    })
    map.addControl(new ScaleLine())
    showBand(selectedBand(), narrowed ? undefined : probe)
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

// Moves one band at a time from the one on screen, rather than from whatever
// half-typed value the input holds
function step(delta: number) {
  band.value = clamp(shown.value + delta)
}

// Brings a whole number into range rather than refusing it. Everything else -
// a decimal, an emptied field, or text - leaves the band where it was.
function commit() {
  const typed = Number(entry.value)
  band.value = entry.value.trim() && Number.isInteger(typed)
    ? clamp(typed)
    : shown.value
  entry.value = String(band.value)
}

// Keeps the band inside the range of whichever file is loaded, which can shrink
// when a different one is previewed
function selectedBand() {
  return Number.isFinite(band.value) ? clamp(band.value) : 1
}

// Stepping, clamping and switching files all move the band, and the field
// follows
watch(shown, (current) => entry.value = String(current))

onMounted(load)

// A new file has to be read from scratch; a new band only swaps which of the
// already built layers is opaque, so the map stays on screen throughout.
watch(() => source.fetchUrl, load)
watch(band, () => {
  if (loading.value || error.value) return
  showBand(selectedBand())
})

onUnmounted(teardown)
</script>

<template>
  <div class="geotiff-preview">
    <div ref="container" class="map" :class="{ hidden: loading || error }"></div>

    <!-- Kept up while tiles load too, which for a large file is the longest
         part and used to happen behind no indicator at all -->
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

    <!-- Only shown for files too wide for the GPU to take whole, where picking
         a band is the only way to see anything but the first one -->
    <div v-if="!loading && !error && bandCount > MAX_BANDS" class="bands">
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
           the stepper buttons replace them. Anything unparseable is discarded
           on commit anyway. -->
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
