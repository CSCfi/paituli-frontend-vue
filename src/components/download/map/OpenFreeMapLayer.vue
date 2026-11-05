<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { OlVectorTileLayer } from 'vue3-openlayers/layers'
import type VectorTileLayer from 'ol/layer/VectorTile'
import { applyBackground, applyStyle } from 'ol-mapbox-style'
import { fallBackFrom, openFreeMapSource, openFreeMapStyle } from '@/modules/layers'

// ol-mapbox-style styles an existing layer, so this applies the OpenFreeMap
// style once the layer is mounted, and again whenever the style changes.
// The style's background layer paints the land, so it is applied too.
const layerRef = ref<{ vectorTileLayer: VectorTileLayer } | null>(null)
async function applyOpenFreeMapStyle() {
  const layer = layerRef.value!.vectorTileLayer
  const styleUrl = `https://tiles.openfreemap.org/styles/${openFreeMapStyle.value}`
  try {
    await Promise.all([
      applyStyle(layer, styleUrl, 'openmaptiles'),
      applyBackground(layer, styleUrl),
    ])
    openFreeMapSource.setState('ready')
  } catch (error) {
    fallBackFrom(openFreeMapSource, `Could not load the OpenFreeMap style (${error})`)
  }
}
onMounted(() => {
  // Draw nothing until then, instead of the OL default style
  layerRef.value!.vectorTileLayer.setStyle(null)
  applyOpenFreeMapStyle()
})
watch(openFreeMapStyle, applyOpenFreeMapStyle)
</script>

<template>
  <OlVectorTileLayer ref="layerRef" :source="openFreeMapSource" :declutter="true" />
</template>
