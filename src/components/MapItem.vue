<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { Map, Layers, MapControls, Interactions } from 'vue3-openlayers'
import { useI18n } from 'vue-i18n'
import { CToastType } from '@cscfi/csc-ui'

import { mdiClose } from '@mdi/js'
import type SelectInteraction from 'ol/interaction/Select'
import type { FeatureLike } from 'ol/Feature'
import { Fill, Stroke, Style, Text } from 'ol/style'
import { always, noModifierKeys } from 'ol/events/condition'
import { MapBrowserEvent } from 'ol'
import { GeoJSON } from 'ol/format'
import OlMap from 'ol/Map.js'
import { KeyboardZoom, KeyboardPan } from 'ol/interaction'

import { currentDataset, fetchMetadata } from '@/modules/datasets'
import { APP_SETTINGS } from '@/shared/constants'
import { useToasts } from '@/composables/toasts'
import { currentLocale } from '@/modules/locale'
import SearchBar from '@/components/SearchBar.vue'
import ToolBar from '@/components/ToolBar.vue'
import HelpBox from '@/components/HelpBox.vue'
import ButtonColumn from '@/components/ButtonColumn.vue'

import {
  indexSource,
  osmSource,
  dataSource,
  dataLayerMaxResolution,
  muncipalitiesSource,
  catchmentSource,
  highlightSource,
  fetchFeatureInfo,
  loadIndexLayer,
  dataHidden,
} from '@/modules/layers'

import {
  selectedOlFeatures,
  featureSelected,
  selectSheetsByExtent,
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
const olMapRef = ref<{ map: OlMap } | null>(null)
const mapView = computed(() => olMapRef.value!.map.getView())

onMounted(async () => {
  // Fetch datasets on mount
  fetchDatasets()

  const map = olMapRef.value!.map as OlMap
  const olMapElement = map.getTargetElement()
  olMapElement.tabIndex = 0 // Maintain map focus for arrow key movement

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
const featureInfoPopup = ref({
  visible: false,
  coordinate: [0,0],
  content: ''
})
const closePopup = () => {
  featureInfoPopup.value.visible = false
}

// Displays feature info when clicking features in the inspect mode
const handleClickedFeature = async (e: unknown) => {
  const event = e as MapBrowserEvent<PointerEvent> // OL typing bug
  if (event.dragging) return

  // We only care about these events if we are in feature info mode
  // and the data layer is visible
  if (toolbarMode.value != 'inspect' || dataHidden.value) return

  const mapEl = olMapRef.value!.map.getTargetElement()
  const normalCursor = mapEl.style.cursor
  mapEl.style.cursor = 'wait'

  // Fetch the feature info and display it
  try {
    const info = await fetchFeatureInfo(
      event.coordinate,
      mapView.value.getResolution(),
      mapView.value.getProjection())

    featureInfoPopup.value.content = info
    featureInfoPopup.value.coordinate = event.coordinate
    featureInfoPopup.value.visible = true
  }
  catch (err) {
    addToast({
      type: CToastType.Error,
      message: t('toasts.feature_error'),
    })
    console.error(err)
    featureInfoPopup.value.visible = false
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
        const extent = feature.getGeometry()!.getExtent()
        selectSheetsByExtent(extent, mapView.value)
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

// We observe the view width to tell some elements to enter
// a compacted state, if space gets too cramped
const horizontalSpace = ref(0)
const toolsContainerRef = ref<HTMLElement>()
onMounted(() => {
  const observer = new ResizeObserver(entries => {
    horizontalSpace.value = entries[0].contentRect.width
  })
  observer.observe(toolsContainerRef.value!)
})

</script>

<template>
  <Map.OlMap style="width: 100%; height: 100%; position: relative;"
             ref="olMapRef"
             @click="handleClickedFeature" >

    <div ref="toolsContainerRef">
      <!-- Mount tools only after OL has provided us the map ref! -->
      <div class="tools" v-if="olMapRef">
        <ButtonColumn id="button-column" :map="(olMapRef.map as OlMap)" />
        <div class="tools-flex">
          <HelpBox id="help" />
          <ToolBar id="toolbar" :map="(olMapRef.map as OlMap)" :compact="horizontalSpace < 750" />
          <SearchBar id="search" :map="(olMapRef.map as OlMap)" :compact="horizontalSpace < 900" />
        </div>
      </div>
    </div>

    <Map.OlView
      :center="APP_SETTINGS.MAP_DEFAULT_CENTER"
      :zoom="APP_SETTINGS.MAP_DEFAULT_ZOOM"
      projection="EPSG:3857" />

    <!--Layers-->

    <Layers.OlTileLayer
      :source="osmSource"
      :visible="showLayer.background.value"
    />
    <Layers.OlVectorLayer
      v-if="indexSource"
      :source="indexSource"
      :style="indexStyle"
      :visible="showLayer.index.value"
    />
    <Layers.OlTileLayer
      v-if="dataSource"
      :source="dataSource"
      :max-resolution="dataLayerMaxResolution"
      :visible="showLayer.data.value"
    />
    <Layers.OlTileLayer
      :source="muncipalitiesSource"
      :visible="showLayer.muncipalities.value"
    />
    <Layers.OlTileLayer
      :source="catchmentSource"
      :visible="showLayer.catchment.value"
    />
    <Layers.OlVectorLayer
      :source="highlightSource"
    />

    <!-- Controls and interactions -->

    <Interactions.OlInteractionSelect
      ref="selectInteraction"
      @select="featureSelected"
      :features="selectedOlFeatures"
      :toggle-condition="always"
    />
    <Interactions.OlInteractionDragbox
      v-if="toolbarMode == 'select' && selectMode == 'basic'"
      @boxend="dragboxEnd"
    />
    <Interactions.OlInteractionDraw
      v-if="toolbarMode == 'select' && selectMode == 'poly'"
      type="Polygon"
      @drawend="polyDrawEnd"
      :stop-click="true"
    />
    <MapControls.OlOverviewmapControl :collapsed="true">
      <Layers.OlTileLayer :source="osmSource" />
    </MapControls.OlOverviewmapControl>


    <!-- Feature info popup -->
    <Map.OlOverlay
      v-if="featureInfoPopup.visible && !dataHidden"
      :position="featureInfoPopup.coordinate"
      :auto-pan="true"
      :auto-pan-animation="{ duration: 250 }">
      <div class="popup">
        <c-alert>
          <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
          <div slot="title">{{ t('feature') }}</div>
          <c-icon-button size="x-small" @click="closePopup">
            <c-icon :path="mdiClose" />
          </c-icon-button>
          <div class="content">
            <pre>{{ featureInfoPopup.content }}</pre>
          </div>
        </c-alert>
      </div>
    </Map.OlOverlay>
  </Map.OlMap>

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
  #help,
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

@media (max-width: 1700px) {
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
  }
}

@media (max-width: 1325px) {
  .tools-flex {
    #toolbar {
      margin-left: auto;
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

@media (max-width: 1150px) {
  .tools-flex {
    #search {
      display: none;
    }
    #toolbar {
      margin-top: -0.25em;
    }
  }
  #button-column {
    top: unset;
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
  transform: translateY(-50%);
  margin-left: 1em;

  c-icon-button {
    position: absolute;
    top: .75em;
    right: .75em;
    --c-icon-button-text-color: var(--c-primary-500);
    --c-icon-button-background-color: var(--c-white);
    --c-icon-button-background-color-hover: var(--c-primary-200);
  }

  .content {
    max-height: 500px;
    overflow-y: scroll;
    font-family: monospace;
    font-size: large;
  }
}

.popup::before {
  /* Left-pointing triangle */
  content: "";
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: -16px;
  border-top: 18px solid transparent;
  border-bottom: 18px solid transparent;
  border-right: 18px solid var(--c-primary-600);
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
