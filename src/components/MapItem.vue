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


</script>

<template>

  <Map.OlMap style="width: 100%; height: 100%; position: relative;">

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
