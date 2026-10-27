<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { OlVectorTileLayer } from 'vue3-openlayers/layers'
import type VectorTileLayer from 'ol/layer/VectorTile'
import { applyBackground, applyStyle } from 'ol-mapbox-style'
import { fallBackFrom, openFreeMapSource } from '@/modules/layers'

const styleUrl = 'https://tiles.openfreemap.org/styles/bright'

// ol-mapbox-style styles an existing layer, so this applies the OpenFreeMap
// style once the layer is mounted. The style's background layer paints the
// land, so it is applied too.
const layerRef = ref<{ vectorTileLayer: VectorTileLayer } | null>(null)
onMounted(async () => {
  const layer = layerRef.value!.vectorTileLayer
  try {
    await Promise.all([
      applyStyle(layer, styleUrl, 'openmaptiles'),
      applyBackground(layer, styleUrl),
    ])
    openFreeMapSource.setState('ready')
  } catch (error) {
    fallBackFrom(openFreeMapSource, `Could not load the OpenFreeMap style (${error})`)
  }
})
</script>

<template>
  <OlVectorTileLayer ref="layerRef" :source="openFreeMapSource" :declutter="true" />
</template>
