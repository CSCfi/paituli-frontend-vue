<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useDatasets } from '@/composables/datasets'
import { Map, Layers, MapControls, Interactions } from 'vue3-openlayers'
import { Fill, Stroke, Style, Text } from 'ol/style'
import { useSources } from '@/composables/sources'
import { shiftKeyOnly } from 'ol/events/condition'
import { useControls } from '@/composables/controls'
import type { FeatureLike } from 'ol/Feature'

import * as proj from 'ol/proj'
import { LAYER, URLS } from '@/shared/constants'
import { TileWMS } from 'ol/source'
import type { NominatimResponse } from '@/shared/types'
import { useToasts } from '@/composables/toasts'
import { CToastType } from '@cscfi/csc-ui'
import { MapBrowserEvent } from 'ol'
import type { GeoJSONFeatureCollection } from 'ol/format/GeoJSON'

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
  featureInfoSource,
  dataLayerSource,
  dataLayerMaxResolution
} = useSources()

const {
  selectFeatureSearch,
  indexVisible,
  dataVisible,
  backgroundVisible,
  muncipalitiesVisible,
  catchmentVisible,
  mapCenter,
  mapZoom,
  selectedOlFeatures,
  mapsheetSearch,
  featureSelected,
  dragboxEnd } = useControls()

// Fetch datasets on load
onMounted(async () => {
  try {
    await fetchDatasets()
  } catch (error) {
    addToast({
      type: CToastType.Error,
      title: 'Failed to load datasets',
      message: `Refresh the page to retry. If the problem persists, please try again later. (${error})`,
    })
  }
})

const indexStyle = (feature: FeatureLike) => {
  // Note: If we define this outside of the component file, the style prop is undefined during patch (??)
  return new Style({
    stroke: new Stroke({ color: 'rgba(0, 0, 255, 1.0)', width: 2 }),
    fill: new Fill({ color: 'rgba(0, 0, 255, 0)' }),
    text: new Text({
      text: feature.get('label'),
      stroke: new Stroke({ width: 0.6 }),
    }),
  })
}

// Method to search for either a location to zoom to, or
// a location which to use for mapsheet selection
const search = async () => {
  if (searchStr.value.trim().length === 0) return

  // Query Nominatim API for loctation data
  let result: NominatimResponse
  try {
    const response = await fetch(
      URLS.NOMINATIM_API.replace( '!query!', encodeURIComponent(searchStr.value)))
    const json = await response.json()
    if (json.length == 0)
    {
      addToast({
        type: CToastType.Warning,
        message: 'Location or address not found. Please double check your spelling'
      })
      return
    }
    result = json[0] // Just select the first result
  } catch (error) {
    addToast({
      type: CToastType.Error,
      message: 'The search API encountered an error. Please try again later.',
    })
    console.error('Nominatim search error: ' + error)
    return;
  }

  // If set by user, we select mapsheets.
  // Otherwise the map is zoomed to found location.
  if (mapsheetSearch.value)
  {
    selectFeatureSearch(searchStr.value, result.boundingbox);
    return;
  }
  else {
    const projected = proj.transform([result.lon, result.lat], 'EPSG:4326', 'EPSG:3857')
    mapCenter.value = [projected[0], projected[1]]
    mapZoom.value = searchStr.value.includes(',') ? 16 : 13
  }
}
const searchStr = ref('')

const muncipalitiesSource = new TileWMS({
  url: URLS.WMS_PAITULI_BASE,
  params: {
    LAYERS: LAYER.MUNICIPALITIES_LAYER,
    VERSION: '1.1.0',
  },
});
const catchmentSource = new TileWMS({
  url: URLS.WMS_PAITULI_BASE,
  params: {
    LAYERS: LAYER.CATCHMENT_AREAS_LAYER,
    VERSION: '1.1.0',
  },
});

const featureInfoAvailable = (currentResolution: number | undefined): boolean => {
  // Do we have feature data, it's visible and we are zoomed in enough?
  if (!featureInfoSource.value) return false
  if (!dataVisible || currentResolution == undefined) return false
  if (currentResolution > dataLayerMaxResolution.value) return false
  return true
}

const onPointerMove = (_event: unknown) => {

  // A silly cast here because OL's typing mismatch
  const event = _event as MapBrowserEvent<PointerEvent>

  if (featureInfoAvailable(event.map.getView().getResolution())) {
    // Change cursor to crosshair
    event.map.getTargetElement().style.cursor = 'crosshair'
  }
  else {
    // No feature info available, change cursor back
    event.map.getTargetElement().style.cursor = ''
  }

}

const onPointerClick = (_event: unknown) => {

  // A silly cast here because OL's typing mismatch
  const event = _event as MapBrowserEvent<PointerEvent>
  if (event.dragging) return

  // We only handle clicks if we have feature info
  const view = event.map.getView()
  if (!featureInfoAvailable(view.getResolution())) return

  // Get feature info URL
  const url = featureInfoSource.value!.getFeatureInfoUrl(
    event.coordinate, view.getResolution()!, view.getProjection(),
    {INFO_FORMAT: 'application/json'}
  )
  if (!url) {
    console.warn('OpenLayers failed to construct GetFeatureInfo URL')
    return
  }

  // Fetch the feature info and display it
  fetch(url)
    .then(response => {
      if (!response.ok) throw Error(`HTTP code ${response.status}`)
      return response.json();
    })
    .then((json: GeoJSONFeatureCollection) => {
      popup.value.content = parseFeatureInfo(json)
      popup.value.coordinate = event.coordinate
      popup.value.visible = true
    })
    .catch(err => {
      addToast({
        type: CToastType.Error,
        message: 'Failed to load feature information. ' +
                 'If the problem persists, please try again later.',
      })
      console.error(err)
    })
}

// Parses GeoJSON feature properties into a human-readable string
const parseFeatureInfo = (json: GeoJSONFeatureCollection): string => {
  const info = json.features[0]?.properties
  if (!info) return 'None!'
  return Object.entries(info)
    // A bit like JSON.Stringify but without braces etc.
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n')
}

const popup = ref({
  visible: false,
  coordinate: [0,0],
  content: ''
})

const closePopup = () => {
  popup.value.visible = false
}

</script>

<template>

  <Map.OlMap style="width: 100%; height: 100%; position: relative;"
             @pointermove="onPointerMove"
             @click="onPointerClick">

    <div class="location-search">
      <input v-model="searchStr" @keypress.enter="search" placeholder="Helsinki" />
      <button @click="search">Search</button>
    </div>

    <Map.OlView :center="mapCenter" :zoom="mapZoom" projection="EPSG:3857" />
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

    <!--Controls-->
    <Interactions.OlInteractionSelect
      @select="featureSelected"
      :features="selectedOlFeatures"
      :multi="true"
    />
    <Interactions.OlInteractionDragbox
      @boxend="dragboxEnd"
      :condition="shiftKeyOnly"
    />
    <MapControls.OlOverviewmapControl :collapsed="true">
      <Layers.OlTileLayer :source="osmSource" />
    </MapControls.OlOverviewmapControl>

    <!-- Feature info popup -->
    <Map.OlOverlay
      v-if="popup.visible"
      :position="popup.coordinate"
      :auto-pan="true"
      :auto-pan-animation="{ duration: 250 }"
    >
      <div class="popup">
        <button class="popup-closer" @click="closePopup">×</button>
        <div class="popup-content">
          <p>Feature info:</p>
          <pre>{{ popup.content }}</pre>
        </div>
      </div>
    </Map.OlOverlay>
  </Map.OlMap>

  <!-- debug stuff -->
  <div class="debug">
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
.debug {
  position: fixed;
  right: 0;
  margin: 50px 10px;
  padding: 10px;
  text-align: end;
  background-color: rgba(255, 255, 255, 0.5);
}
</style>
