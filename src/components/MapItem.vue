<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { Map, Layers, MapControls, Interactions } from 'vue3-openlayers'
import { useI18n } from 'vue-i18n'
import { CToastType } from '@cscfi/csc-ui'

import type { FeatureLike } from 'ol/Feature'
import { Fill, Stroke, Style, Text } from 'ol/style'
import { always } from 'ol/events/condition'
import { getCenter } from 'ol/extent.js'
import { MapBrowserEvent } from 'ol'
import { GeoJSON } from 'ol/format'
import OlMap from 'ol/Map.js'

import { currentDataset, datasets, fetchMetadata } from '@/modules/datasets'
import { APP_SETTINGS } from '@/shared/constants'
import { useToasts } from '@/composables/toasts'
import { currentLocale } from '@/modules/locale'
import SearchBar from '@/components/SearchBar.vue'
import ToolBar from '@/components/ToolBar.vue'

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

const { addToast } = useToasts()
const { t } = useI18n()

// The map instance exposed (dynamically) by OL
const olMapRef = ref<{ map: OlMap } | null>(null)
const mapView = computed(() => olMapRef.value!.map.getView())

// Fetch datasets on mount
onMounted(async () => {
  fetchDatasets()

  // Add drag-n-drop listeners
  const olMapElement = olMapRef.value!.map.getTargetElement()
  olMapElement.addEventListener('drop', dragDropHandler)
  olMapElement.addEventListener('dragover', (e) => e.preventDefault())
})

// Fetch datasets again if locale changes, due to the
// endpoint returning different descriptions for each locale
watch(currentLocale, async () => fetchDatasets())

// Update index layer whenever the current dataset changes,
// and automatically select mapsheets if we have only one
watch(currentDataset, async (dataset) => {

  // Clear our highlights at this point
  highlightSource.clear()

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

  // We only care about these events if we are in feature info mode
  if (toolbarMode.value != 'inspect') return
  if (event.dragging) return

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
}

// Handles user drag-and-dropping files onto the map item
const dragDropHandler = (event: DragEvent) => {
  event.preventDefault()

  const files = event.dataTransfer?.files
  if (!files) return
  for (const file of files) {
    loadGeoJSONFile(file)
  }
}

// Loads provided file as GeoJSON to select mapsheets
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
        selectSheetsByExtent(extent)
        mapView.value.animate({
          center: getCenter(extent),
          duration: 1000,
        })
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
  return new Style({
    stroke: new Stroke({ color: 'rgba(0, 0, 255, 1.0)', width: 2 }),
    fill: new Fill({ color: 'rgba(0, 0, 255, 0)' }),
    text: new Text({
      text: feature.get('label'),
      stroke: new Stroke({ width: 0.6 }),
    }),
  })
}

</script>

<template>
  <Map.OlMap style="width: 100%; height: 100%; position: relative;"
             ref="olMapRef"
             @click="handleClickedFeature" >

    <div class="location-search">
      <SearchBar v-if="olMapRef" :map="(olMapRef.map as OlMap)" />
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

    <div class="controls-ribbon">
      <!-- Mount only after OL has provided us the map ref! -->
      <ToolBar v-if="olMapRef" :map="(olMapRef.map as OlMap)" />
    </div>

    <!-- Feature info popup -->
    <Map.OlOverlay
      v-if="featureInfoPopup.visible"
      :position="featureInfoPopup.coordinate"
      :auto-pan="true"
      :auto-pan-animation="{ duration: 250 }">
      <div class="popup">
        <button class="popup-closer" @click="closePopup">×</button>
        <div class="popup-content">
          <p>{{ t("feature") }}</p>
          <pre>{{ featureInfoPopup.content }}</pre>
        </div>
      </div>
    </Map.OlOverlay>
  </Map.OlMap>

  <!-- debug stuff -->
  <div class="debug">
    <b>Dev info</b>
    <div v-if="datasets.length > 0">
      Fetched {{ datasets.length }} datasets
      <div v-if="currentDataset">{{ currentDataset.data_id }}</div>
    </div>
    <div v-else>No datasets found.</div>
    <div v-if="dataSource">Data layer source active</div>
    <div v-if="!indexSource">Waiting for index layer...</div>
    <div v-else>Index layer source active</div>
  </div>
</template>

<i18n>
{
  "en": {
    "feature": "Feature info:",
    "toasts": {
      "fetching": {
        "index_failed": "Failed to load index map features",
        "metadata_failed": "Failed to load datasets",
        "please_refresh": "Refresh the page to retry. If the problem persists, please try again later. Cause: {error}",
      },
      "geojson": {
        "loaded": {
          "title": "Loaded provided GeoJSON",
          "message": "Mapsheets have been selected using the extents",
        },
        "invalid": {
          "title": "Invalid GeoJSON",
          "message": "Could not load valid GeoJSON from {filename}",
        },
      },
      "feature_error": "Failed to load feature information. If the problem persists, please try again later.",
    },
  },
  "fi": {
    "feature": "Kohteen tiedot:",
    "toasts": {
      "fetching": {
        "index_failed": "Indeksikartan noutaminen epäonnistui",
        "metadata_failed": "Aineistojen noutaminen epäonnistui",
        "please_refresh": "Päivitä sivu yrittääksesi uudelleen. Jos ongelma jatkuu, yritä myöhemmin uudelleen. Syy: {error}",
      },
      "geojson": {
        "loaded": {
          "title": "GeoJSON ladattu",
          "message": "Karttalehdet valittu rajojen perusteella",
        },
        "invalid": {
          "title": "Virjeellinen GeoJSON",
          "message": "Kelvollista GeoJSON:ia ei voitu ladata tiedostosta {filename}",
        },
      },
      "feature_error": "Kohdetietojen lataaminen epäonnistui. Jos ongelma jatkuu, yritä myöhemmin uudelleen.",
    },
  },
}
</i18n>

<style scoped>
.popup {
  position: relative;
  background-color: white;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
  min-width: 160px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}
.popup-closer {
  position: absolute;
  top: 4px;
  right: 6px;
  border: none;
  background: transparent;
  font-size: 16px;
  cursor: pointer;
}
.popup-content {
  margin-top: 10px;
  font-family: monospace;
}

.location-search {
  position: absolute;
  right: 0;
  z-index: 1;
  margin: .5em 1em;
}
.controls-ribbon {
  position: absolute;
  width: 250px;
  margin: .5em 1em;
  left: 1.5em;
  z-index: 1;
}
.debug {
  position: fixed;
  right: 0;
  margin: 50px 10px;
  padding: 10px;
  text-align: end;
  background-color: rgba(255, 255, 255, 0.5);
}
</style>
