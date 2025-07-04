<script setup lang="ts">
import { onMounted, provide, ref } from 'vue'

import { APP_SETTINGS } from '@/shared/constants'
import { useDatasets } from '@/composables/datasets'
import LocationSearchField from './LocationSearchField.vue'
import DownloadTab from './DownloadTab.vue'

import { Map, Layers, MapControls, Interactions } from 'vue3-openlayers'
import { Fill, Stroke, Style, Text } from 'ol/style'
import type { FeatureLike } from 'ol/Feature'
import { useSources } from '@/composables/sources'
import { shiftKeyOnly } from 'ol/events/condition'
import { useControls } from '@/composables/controls'

const { datasets, currentDataset, fetchDatasets, isFetching, setCurrent } =
  useDatasets()
const { indexLayerSource, osmSource, dataLayerSource, dataLayerMaxResolution } =
  useSources()
const { selectedFeatures, featureSelected, dragboxEnd } = useControls()

// Define and expose center and zoom control
const mapCenter = ref<[number, number]>(APP_SETTINGS.MAP_DEFAULT_CENTER)
const mapZoom = ref<number>(APP_SETTINGS.MAP_DEFAULT_ZOOM)
provide('mapCenter', mapCenter)
provide('mapZoom', mapZoom)

// Fetch datasets on startup
onMounted(async () => {
  try {
    await fetchDatasets()
    setCurrent('mml_korkeusmalli_25m_2000_tiff_ykj') // DEBUG: select dataset on mount
  } catch (error) {
    alert(`Failed to load datasets: ${(error as Error).message}`)
  }
})

const indexStyle = (feature: FeatureLike) => {
  // Note: If we define this outside of the component file, the prop is undefined during patch
  return new Style({
    stroke: new Stroke({ color: 'rgba(0, 0, 255, 1.0)', width: 2 }),
    fill: new Fill({ color: 'rgba(0, 0, 255, 0)' }),
    text: new Text({
      text: feature.get('label'),
      stroke: new Stroke({ width: 0.6 }),
    }),
  })
}

//const downloadTabExpanded = ref(true)
</script>

<template>
  <!--
  <div class="sidebar">
    <c-accordion :value="[]" multiple outlined>
      <c-accordion-item heading="Select data" value="dataset" expanded="true">
        <DatasetSelect />
      </c-accordion-item>
      <c-accordion-item heading="Dataset Info" value="info"> wip </c-accordion-item>
      <c-accordion-item heading="Links" value="links"> wip </c-accordion-item>
      <c-accordion-item heading="Downloads" value="downloads" :expanded="downloadTabExpanded">
        <DownloadTab />
      </c-accordion-item>
    </c-accordion>
  </div>
-->

  <!--LocationSearchField /-->
  <Map.OlMap style="width: 100%; height: 100%">
    <Map.OlView :center="mapCenter" :zoom="mapZoom" projection="EPSG:3857" />
    <!--Layers-->
    <Layers.OlTileLayer :source="osmSource" />
    <Layers.OlVectorLayer
      v-if="indexLayerSource"
      :source="indexLayerSource"
      :style="indexStyle"
    />
    <Layers.OlTileLayer
      v-if="dataLayerSource"
      :source="dataLayerSource"
      :max-resolution="dataLayerMaxResolution"
    />
    <!--Controls-->
    <Interactions.OlInteractionSelect
      @select="featureSelected"
      :features="selectedFeatures"
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

  <!-- debug stuff
  <div v-if="isFetching">Loading datasets...</div>
  <div v-else-if="datasets.length > 0">
    Found {{ datasets.length }} datasets.
    <div v-if="currentDataset">{{ currentDataset.data_id }}</div>
  </div>
  <div v-else>No datasets found.</div>
  <div v-if="dataLayerSource">Data layer visible</div>
  <div v-if="!indexLayerSource">Loading index layer...</div>
  <div v-else>Index layer visible</div-->
</template>

<style scoped>
/*
.sidebar {
  width: 500px;
  flex-shrink: 0;
}
  */

.map {
  /*
  position: fixed;
  top: 0;
  left: 0;
  */
}
</style>
