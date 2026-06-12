<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { CToastType } from '@cscfi/csc-ui'

import { OlMap, OlOverlay, OlView } from 'vue3-openlayers/map';
import { OlTileLayer, OlVectorLayer } from 'vue3-openlayers/layers';
import { OlOverviewMapControl } from 'vue3-openlayers/controls';
import { OlInteractionSelect, OlInteractionDraw, OlInteractionDragBox } from 'vue3-openlayers/interactions';
import type Map from 'ol/Map.js'

import { mdiClose } from '@mdi/js'
import type SelectInteraction from 'ol/interaction/Select'
import type { FeatureLike } from 'ol/Feature'
import { Fill, Stroke, Style, Text } from 'ol/style'
import { always, noModifierKeys } from 'ol/events/condition'
import { MapBrowserEvent } from 'ol'
import { GeoJSON } from 'ol/format'
import { KeyboardZoom, KeyboardPan } from 'ol/interaction'

import { currentDataset, fetchMetadata } from '@/modules/datasets'
import { APP_SETTINGS } from '@/shared/constants'
import { useToasts } from '@/composables/toasts'
import { currentLocale } from '@/modules/locale'

import SearchBar from './SearchBar.vue'
import ToolBar from './ToolBar.vue'
import ButtonColumn from './ButtonColumn.vue'
import HelpBox from '../help/HelpBox.vue'

import {
  indexSource,
  osmSource,
  dataSource,
  dataLayerMaxResolution,
  municipalitiesSource,
  catchmentSource,
  highlightSource,
  fetchFeatureInfo,
  loadIndexLayer,
  dataHidden,
} from '@/modules/layers'

import {
  selectedOlFeatures,
  featureSelected,
  selectSheetsByGeometry,
  dragboxEnd,
  polyDrawEnd,
  autoSelectSheets,
  selectAll,
} from '@/modules/selection'

import {
  fileSelectedCallback,
  selectMode,
  showLayer,
  toolbarMode
} from '@/modules/controls'
import { getMapInteraction } from '@/shared/util'

const { addToast } = useToasts()
const { t } = useI18n()

// The map instance exposed (dynamically) by OL
const olMapRef = ref<{ map: Map } | null>(null)
const mapView = computed(() => olMapRef.value!.map.getView())

onMounted(async () => {
  // Fetch datasets on mount
  fetchDatasets()

  const map = olMapRef.value!.map as Map
  const olMapElement = map.getTargetElement()

  // Ensure map is focusable and refocus when pointing
  olMapElement.tabIndex = 0
  olMapElement.addEventListener('pointerenter', () => olMapElement.focus())

  // Add drag-n-drop listeners
  olMapElement.addEventListener('drop', dragDropHandler)
  olMapElement.addEventListener('dragover', (e) => e.preventDefault())

  // Stop keyboard zooming OL interaction (from intercepting +/- keystrokes)
  const zoom = getMapInteraction(map, KeyboardZoom)
  if (zoom) map.removeInteraction(zoom)

  // Stop OL view panning interaction from intercepting arrow keys while typing
  const kb = getMapInteraction(map, KeyboardPan)
  if (kb) map.removeInteraction(kb)
  map.addInteraction(new KeyboardPan({
    condition: (event) =>
      noModifierKeys(event) &&
      !(document.activeElement?.matches('c-text-field'))
  }))

  // Tweak some OL overlay styles which CSS cannot hit
  const overlays = document.querySelector('.ol-overlay-container') as HTMLElement
  overlays.style.pointerEvents = 'none'
})

// Fetch datasets again if locale changes, due to the
// endpoint returning different descriptions for each locale
watch(currentLocale, async () => fetchDatasets())

// Update index layer whenever the current dataset changes,
// and automatically select map sheets if we have only one
watch(currentDataset, async (dataset) => {

  // Clear our highlights and popups at this point
  highlightSource.clear()
  closePopup()

  if (!dataset) return
  try {
    await loadIndexLayer(dataset.data_id)
    if (autoSelectSheets.value) selectAll()
  } catch (exc) {
    addToast({
      type: CToastType.Error,
      title: t('toasts.fetching.index_failed'),
      message: t('toasts.fetching.please_refresh', { error: exc })
    })
  }
})

// Fetches dataset metadata from the backend
async function fetchDatasets() {
  try {
    await fetchMetadata()
  } catch (exc) {
    addToast({
      type: CToastType.Error,
      title: t('toasts.fetching.metadata_failed'),
      message: t('toasts.fetching.please_refresh', { error: exc }),
    })
  }
}

// A popup for displaying feature information
const featureInfoPos = ref([0,0])
const featureInfoContent = ref('')
const closePopup = () => {
  featureInfoContent.value = ''
}

// Displays feature info when clicking features in the inspect mode
const toolBarRef = ref()
const handleClickedFeature = async (e: unknown) => {
  const event = e as MapBrowserEvent<PointerEvent> // OL typing bug
  if (event.dragging) return

  // We only care about these events if we are in feature info mode
  if (toolbarMode.value != 'inspect') return

  // If the data is not visible we ensure user sees the warning
  if (dataHidden.value) {
    toolBarRef.value.doPopAlert()
    return
  }

  const map = olMapRef.value!.map
  const mapEl = map.getTargetElement()
  const normalCursor = mapEl.style.cursor
  mapEl.style.cursor = 'wait'

  // Fetch the feature info and display it
  try {
    const info = await fetchFeatureInfo(
      event.coordinate,
      mapView.value.getResolution(),
      mapView.value.getProjection())

    // For auto-pan to work on first click, we need to wait for
    // new box height to render before we set the position of the box.
    featureInfoContent.value = info
    await nextTick()
    featureInfoPos.value = event.coordinate
  }
  catch (err) {
    addToast({
      type: CToastType.Error,
      message: t('toasts.feature_error'),
    })
    console.error(err)
    closePopup()
  }
  finally {
    mapEl.style.cursor = normalCursor
  }
}

// Handles user drag-and-dropping files onto the map item
const dragDropHandler = (event: DragEvent) => {
  event.preventDefault()

  const files = event.dataTransfer?.files
  if (!files || !currentDataset) return
  for (const file of files) {
    loadGeoJSONFile(file)
  }
}

// Loads provided file as GeoJSON to select map sheets
const loadGeoJSONFile = (file: File) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const text = e.target?.result
      if (!text) throw Error(file.name + ' is empty?')

      const features = new GeoJSON().readFeatures(
        JSON.parse(text.toString()),
        { featureProjection: mapView.value.getProjection() }
      )
      for (const feature of features) {
        selectSheetsByGeometry(feature.getGeometry()!, mapView.value)
      }
      addToast({
        type: CToastType.Success,
        title: t('toasts.geojson.loaded.title'),
        message: t('toasts.geojson.loaded.message'),
      })
    } catch (err) {
      addToast({
        type: CToastType.Error,
        title: t('toasts.geojson.invalid.title'),
        message: t('toasts.geojson.invalid.message', { filename: file.name }),
      })
      console.error('User dropped Invalid GeoJSON', err)
    }
  }
  reader.readAsText(file)
}

// Set the file load callback for file load dialog use
fileSelectedCallback.value = loadGeoJSONFile

const indexStyle = (feature: FeatureLike) => {
  // Note: If we define this outside of the component file,
  // the style prop is undefined during patch (??)
  switch (toolbarMode.value) {
  case 'inspect':
    return new Style({
      stroke: new Stroke({ color: 'rgb(0, 0, 255)', width: 1.5 }),
    })
  default:
    return new Style({
      stroke: new Stroke({ color: 'rgb(0, 0, 255', width: 2 }),
      fill: new Fill({ color: 'transparent' }),
      text: new Text({
        text: feature.get('label'),
        stroke: new Stroke({ width: 0.6 }),
      }),
    })
  }
}

const selectInteraction = ref<{ select: SelectInteraction }>()

// When tool mode changes we clear lingering inspect mode popups,
// and signal OL to redraw index layer (styles). We also disable
// selection interaction when we are out of select mode so user
// does not accidentally select map sheets
watch(toolbarMode, (mode) => {
  closePopup()
  indexSource.value?.changed()
  selectInteraction.value!.select.setActive(mode == 'select')
})
// Disable select also initially (after ref exists)
watch(selectInteraction, () => selectInteraction.value?.select.setActive(false))


</script>

<template>
  <OlMap id="map"
         ref="olMapRef"
         @click="handleClickedFeature" >

    <div class="tools-container">
      <!-- Mount tools only after OL has provided us the map ref! -->
      <div class="tools" v-if="olMapRef">
        <ButtonColumn id="button-column" :map="(olMapRef.map as Map)" />
        <div class="tools-flex">
          <HelpBox id="help" />
          <ToolBar id="toolbar"
                   ref="toolBarRef"
                   :map="(olMapRef.map as Map)" />
          <SearchBar id="search" :map="(olMapRef.map as Map)" />
        </div>
      </div>
    </div>

    <OlView
      :center="APP_SETTINGS.MAP_DEFAULT_CENTER"
      :zoom="APP_SETTINGS.MAP_DEFAULT_ZOOM"
      projection="EPSG:3857" />

    <!--Layers-->

    <OlTileLayer
      :source="osmSource"
      :visible="showLayer.background.value"
    />
    <OlVectorLayer
      v-if="indexSource"
      :source="indexSource"
      :style="indexStyle"
      :visible="showLayer.index.value"
    />
    <OlTileLayer
      v-if="dataSource"
      :source="dataSource"
      :max-resolution="dataLayerMaxResolution"
      :visible="showLayer.data.value"
    />
    <OlTileLayer
      :source="municipalitiesSource"
      :visible="showLayer.municipalities.value"
    />
    <OlTileLayer
      :source="catchmentSource"
      :visible="showLayer.catchment.value"
    />
    <OlVectorLayer
      :source="highlightSource"
    />

    <!-- Controls and interactions -->

    <OlInteractionSelect
      ref="selectInteraction"
      @select="featureSelected"
      :features="selectedOlFeatures"
      :multi="true"
      :toggle-condition="always"
    />
    <OlInteractionDragBox
      v-if="toolbarMode == 'select' && selectMode == 'basic'"
      @boxend="dragboxEnd"
    />
    <OlInteractionDraw
      v-if="toolbarMode == 'select' && selectMode == 'poly'"
      type="Polygon"
      @drawend="polyDrawEnd"
      :stop-click="true"
    />
    <OlOverviewMapControl :collapsed="true">
      <OlTileLayer :source="osmSource" />
    </OlOverviewMapControl>


    <!-- Feature info popup -->
    <OlOverlay
      :position="featureInfoPos"
      :positioning="'center-left'"
      :auto-pan="{ margin: 30 }">
      <div class="popup-container" v-show="featureInfoContent">
        <div class="popup-buffer"></div>
        <div class="popup">
          <c-alert>
            <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
            <div slot="title">{{ t('feature') }}</div>
            <c-icon-button size="x-small" @mousedown.prevent @click="closePopup">
              <c-icon :path="mdiClose" />
            </c-icon-button>
            <div class="content">
              <pre>{{ featureInfoContent }}</pre>
            </div>
          </c-alert>
        </div>
      </div>
    </OlOverlay>
  </OlMap>

</template>

<i18n>
{
  "en": {
    "feature": "Feature info",
    "toasts": {
      "fetching": {
        "index_failed": "Failed to load map sheets",
        "metadata_failed": "Failed to load datasets",
        "please_refresh": "Refresh the page to retry. If the problem persists, please contact CSC. Cause: {error}",
      },
      "geojson": {
        "loaded": {
          "title": "Selection by GeoJSON",
          "message": "Map sheets overlapping GeoJSON polygons have been selected.",
        },
        "invalid": {
          "title": "Invalid GeoJSON",
          "message": "Failed to load valid GeoJSON from '{filename}'.",
        },
      },
      "feature_error": "Failed to load feature info. If the problem persists, please contact CSC.",
    },
  },
  "fi": {
    "feature": "Kohteen tiedot",
    "toasts": {
      "fetching": {
        "index_failed": "Karttalehtien noutaminen epäonnistui",
        "metadata_failed": "Aineistojen noutaminen epäonnistui",
        "please_refresh": "Päivitä sivu yrittääksesi uudelleen. Jos ongelma jatkuu, ota yhteyttä CSC:hen. Syy: {error}",
      },
      "geojson": {
        "loaded": {
          "title": "Valinta GeoJSON:lla",
          "message": "GeoJSON:in polygonien kanssa päällekäiset karttalehdet ovat lisätty valintaan.",
        },
        "invalid": {
          "title": "Virheellinen GeoJSON",
          "message": "Kelvollista GeoJSON:ia ei voitu ladata tiedostosta '{filename}'.",
        },
      },
      "feature_error": "Kohteen tietojen lataaminen epäonnistui. Jos ongelma jatkuu, ota yhteyttä CSC:hen.",
    },
  },
}
</i18n>

<style scoped>

#map {
  width: 100%;
  height: 100%;
  position: relative;
}

#map:focus {
  outline: none;
}

/*
  Cover #map and act as the query container for the tool overlay, so the
  breakpoints below respond to the actual map width (which now varies with
  the collapsible sidebar) rather than the viewport width.
*/
.tools-container {
  position: absolute;
  inset: 0;
  pointer-events: none;
  container-type: inline-size;
}

.tools {
  position: absolute;
  left: 0;
  right: 0;
  top: 1em;
  bottom: 0;
  padding-right: 3.75em;
  z-index: 1;

  #button-column {
    position: absolute;
    right: 0;
    margin: 0 1em;
  }

  pointer-events: none;

  #button-column,
  #toolbar,
  #search {
    pointer-events: all;
  }
}

.tools-flex {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  #help {
    margin-top: -1em;
  }
  #search {
    margin-left: auto;
  }
  #toolbar {
     margin-top: .25em;
     margin-left: auto;
  }
}

@container (max-width: 1275px) {
  .tools-flex {
    #help {
      position: absolute;
      bottom: 0;
      right: 0;
    }
    #toolbar {
      margin-left: 1em;
      --c-tab-item-padding: 0.5em 0 0 0;
    }
    :deep(.help-button) {
      position: unset;
      margin-left: auto;
    }
    :deep(.help-box) {
      position: absolute;
    }
  }
}

@container (max-width: 900px) {
  .tools-flex {
    #toolbar {
      --c-tab-item-padding: 0.3em 0 0 0;
    }
    #search {
      width: 230px;
      margin-right: -2.75em;
      margin-left: auto;
    }
    :deep(#json-button) {
      margin-top: .5em;
    }
  }
  #button-column {
    top: 4em;
  }
}

@container (max-width: 750px) {
  .tools-flex {
    #search {
      display: none;
    }
    #toolbar {
      margin-top: -0.25em;
    }
  }
  #button-column {
    top: -0.25em;
  }
}

@container (max-width: 275px) {
  .tools {
    padding-right: 1em;
  }
  #button-column {
    display: none;
  }
}

@container (max-width: 230px)
{
  .tools-flex {
    display: none;
  }
}

:global(.ol-zoom) {
  /* We have our own zoom buttons */
  display: none;
}

.popup {
  position: relative;
  background-color: var(--c-white);
  min-width: 200px;

  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  pointer-events: auto;

  c-icon-button {
    position: absolute;
    top: .75em;
    right: .75em;
    --c-icon-button-text-color: var(--c-primary-500);
    --c-icon-button-background-color: var(--c-white);
    --c-icon-button-background-color-hover: var(--c-primary-200);
  }

  .content {
    min-height: 100px;
    max-height: min(35vh, 350px);
    max-width: 50vw;
    overflow-y: scroll;
    font-family: monospace;
    font-size: large;
  }
}

.popup-container {
  position: relative;
  margin-left: 1em;
}

.popup-container::before {
  /* Left-pointing triangle */
  content: "";
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: -16px;
  border-top: 18px solid transparent;
  border-bottom: 18px solid transparent;
  border-right: 18px solid var(--c-primary-600);
  z-index: 1;
}

.popup-buffer {
  height: 75px;
  opacity: 0;
  pointer-events: none;
}

.debug {
  position: fixed;
  right: 0;
  bottom: 0;
  margin: 50px 10px;
  padding: 10px;
  text-align: end;
  background-color: rgba(255, 255, 255, 0.5);
}
</style>
