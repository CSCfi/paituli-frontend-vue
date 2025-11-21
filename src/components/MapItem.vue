<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useDatasets } from '@/composables/datasets'
import { Map, Layers, MapControls, Interactions } from 'vue3-openlayers'
import { Fill, Stroke, Style, Text } from 'ol/style'
import { useSources } from '@/composables/sources'
import { always } from 'ol/events/condition'
import { useControls } from '@/composables/controls'
import type { FeatureLike } from 'ol/Feature'
import OlMap from 'ol/Map.js'
import { getCenter } from 'ol/extent.js'

import * as proj from 'ol/proj'
import { APP_SETTINGS, URLS } from '@/shared/constants'
import type { NominatimResponse } from '@/shared/types'
import { useToasts } from '@/composables/toasts'
import { CToastType } from '@cscfi/csc-ui'
import { MapBrowserEvent } from 'ol'
import { GeoJSON } from 'ol/format'
import ControlsRibbon from './ControlsRibbon.vue'

const { addToast } = useToasts()

const {
  datasets,
  currentDataset,
  fetchDatasets,
  isFetching
} = useDatasets()

const {
  indexLayerSource,
  osmSource,
  dataLayerSource,
  dataLayerMaxResolution,
  muncipalitiesSource,
  catchmentSource,
  highlightSource,
  fetchFeatureInfo,
} = useSources()

const {
  selectFeatureSearch,
  indexVisible,
  dataVisible,
  backgroundVisible,
  muncipalitiesVisible,
  catchmentVisible,
  selectedOlFeatures,
  mapsheetSearch,
  featureSelected,
  selectSheetsByExtent,
  dragboxEnd,
  polyDrawEnd,
  fileSelectedCallback,
  controlMode,
  selectMode,
} = useControls()

// The map instance exposed (dynamically) by OL
const olMapRef = ref<{ map: OlMap } | null>(null)
const mapView = computed(() => olMapRef.value!.map.getView())

onMounted(async () => {

  // Fetch datasets on mount
  await fetchDatasets()

  // Add drag-n-drop listeners
  const olMapElement = olMapRef.value!.map.getTargetElement()
  olMapElement.addEventListener('drop', dragDropHandler)
  olMapElement.addEventListener('dragover', (e) => e.preventDefault())
})

// A popup for displaying feature information
const featureInfoPopup = ref({
  visible: false,
  coordinate: [0,0],
  content: ''
})
const closePopup = () => {
  featureInfoPopup.value.visible = false
}

// Queries Nominatim API for location data
const fetchLocationData = async (searchString: string): Promise<NominatimResponse[]> => {
  const response = await fetch(
    URLS.NOMINATIM_API.replace('!query!', encodeURIComponent(searchString)))
  if (!response.ok) throw Error(`HTTP code ${response.status}`)
  return response.json()
}

// Searches either a location to zoom to, or
// a location which to use for mapsheet selection
const search = async () => {
  if (searchStr.value.trim().length === 0) return

  // Fetch location info
  let result: NominatimResponse
  try {
    const results = await fetchLocationData(searchStr.value)
    if (results.length == 0) {
      addToast({
        type: CToastType.Warning,
        message: 'Location or address not found. Please double check your spelling'
      })
      return
    }
    result = results[0] // Just select the first result
  } catch (error) {
    addToast({
      type: CToastType.Error,
      message: 'The search API encountered an error. Please try again later.',
    })
    console.error('Nominatim search error: ' + error)
    return
  }

  // If set by user, we select mapsheets.
  // Otherwise the map is zoomed to found location.
  if (mapsheetSearch.value) {
    selectFeatureSearch(searchStr.value, result.boundingbox);
  }
  else {
    const projected = proj.transform([result.lon, result.lat], 'EPSG:4326', 'EPSG:3857')
    mapView.value.animate({
      center: [projected[0], projected[1]],
      zoom: searchStr.value.includes(',') ? 16 : 13,
      duration: 1000,
    })
  }
}
const searchStr = ref('')

const handleClickedFeature = async (e: unknown) => {
  const event = e as MapBrowserEvent<PointerEvent> // OL typing bug
  if (event.dragging) return

  // We only care about these events if we are in feature info mode
  if (controlMode.value != 'inspect') return

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
      message: 'Failed to load feature information. ' +
               'If the problem persists, please try again later.',
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
        type: CToastType.Success, title: 'Loaded provided GeoJSON',
        message: 'Mapsheets have been selected using the extents'
      })
    } catch (err) {
      addToast({
        type: CToastType.Error, title: 'Invalid GeoJSON',
        message: 'Could not load valid GeoJSON from ' + file.name,
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
      <input v-model="searchStr" @keypress.enter="search" placeholder="Helsinki" />
      <button @click="search">Search</button>
    </div>

    <Map.OlView
      :center="APP_SETTINGS.MAP_DEFAULT_CENTER"
      :zoom="APP_SETTINGS.MAP_DEFAULT_ZOOM"
      projection="EPSG:3857" />

    <!--Layers-->
    <Layers.OlTileLayer
      :source="osmSource"
      :visible="backgroundVisible"
    />
    <Layers.OlVectorLayer
      v-if="indexLayerSource"
      :source="indexLayerSource"
      :style="indexStyle"
      :visible="indexVisible"
    />
    <Layers.OlTileLayer
      v-if="dataLayerSource"
      :source="dataLayerSource"
      :max-resolution="dataLayerMaxResolution"
      :visible="dataVisible"
    />
    <Layers.OlTileLayer
      :source="muncipalitiesSource"
      :visible="muncipalitiesVisible"
    />
    <Layers.OlTileLayer
      :source="catchmentSource"
      :visible="catchmentVisible"
    />
    <Layers.OlVectorLayer
      :source="highlightSource"
    />

    <Interactions.OlInteractionSelect
      @select="featureSelected"
      :features="selectedOlFeatures"
      :toggle-condition="always"
    />
    <Interactions.OlInteractionDragbox
      v-if="controlMode == 'select' && selectMode == 'multi'"
      @boxend="dragboxEnd"
    />
    <Interactions.OlInteractionDraw
      v-if="controlMode == 'select' && selectMode == 'draw'"
      type="Polygon"
      @drawend="polyDrawEnd"
      :stop-click="true"
    />
    <MapControls.OlOverviewmapControl :collapsed="true">
      <Layers.OlTileLayer :source="osmSource" />
    </MapControls.OlOverviewmapControl>

    <div class="controls-ribbon">
      <!-- Mount only after OL has provided us the map ref! -->
      <ControlsRibbon v-if="olMapRef" :map="(olMapRef.map as OlMap)" />
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
          <p>Feature info:</p>
          <pre>{{ featureInfoPopup.content }}</pre>
        </div>
      </div>
    </Map.OlOverlay>
  </Map.OlMap>

  <!-- debug stuff -->
  <div class="debug">
    {{ controlMode }}
    {{ selectMode }}
    <div v-if="isFetching">Loading datasets...</div>
    <div v-else-if="datasets.length > 0">
      Found {{ datasets.length }} datasets
      <div v-if="currentDataset">{{ currentDataset.data_id }}</div>
    </div>
    <div v-else>No datasets found.</div>
    <div v-if="dataLayerSource">Data layer visible</div>
    <div v-if="!indexLayerSource">Waiting for index layer...</div>
    <div v-else>Index layer visible</div>
  </div>
</template>

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
