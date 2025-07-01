import { URLS } from '@/shared/constants'
import { GeoJSON } from 'ol/format'
import { computed, shallowRef, watch } from 'vue'

import { TileWMS } from 'ol/source'
import VectorSource from 'ol/source/Vector'
import { useDatasets } from './datasets'

const { currentDataset } = useDatasets()

// Background map source
const osmSource = new TileWMS({
  url: 'https://ows.terrestris.de/osm/service?',
  params: {
    LAYERS: 'OSM-WMS',
    VERSION: '1.1.0',
  },
  attributions: `Background map: © <a target="_blank" href="https://ows.terrestris.de/dienste.html">terrestris</a>.
     Data: © <a target="_blank" href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>`,
})

// Mapsheet source
const indexLayerSource = shallowRef<VectorSource | null>(null)

// Update it whenever the current dataset changes
watch(currentDataset, async (dataset) => {
  indexLayerSource.value = null
  if (!dataset?.data_id) {
    return
  }

  const fetch_url = URLS.WFS_INDEX_MAP_LAYER.replace('!key!', 'data_id').replace(
    '!value!',
    dataset.data_id,
  )
  const source = new VectorSource({ format: new GeoJSON() })

  try {
    const response = await fetch(fetch_url + '&outputFormat=application/json')
    if (!response.ok) throw new Error(`HTTP error ${response.status}`)

    const features = source.getFormat()?.readFeatures(await response.json())
    if (!features?.length) throw new Error('Fetched 0 features')
    source.addFeatures(features)

    indexLayerSource.value = source
  } catch (error) {
    console.error('Failed to load index map features:', error)
  }
})

// Data layer source
const dataLayerSource = computed(() => {
  if (!currentDataset.value?.data_url) return null
  return new TileWMS({
    url: URLS.WMS_PAITULI_BASE_GWC,
    params: {
      LAYERS: currentDataset.value.data_url,
      VERSION: '1.1.1',
    },
    serverType: 'geoserver',
  })
})

const dataLayerMaxResolution = computed(() => {
  const max_scale = currentDataset.value?.data_max_scale
  if (!max_scale) return 100
  return max_scale / 2835
})

export function useSources() {
  return {
    osmSource,
    indexLayerSource,
    dataLayerSource,
    dataLayerMaxResolution,
  }
}
