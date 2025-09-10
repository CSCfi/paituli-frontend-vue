import { URLS } from '@/shared/constants'
import { GeoJSON } from 'ol/format'
import { computed, shallowRef, watch } from 'vue'

import { TileWMS, WMTS } from 'ol/source'
import VectorSource from 'ol/source/Vector'
import { useDatasets } from './datasets'

import { geojson as FGBGeoJson } from 'flatgeobuf'
import WMTSTileGrid from 'ol/tilegrid/WMTS'
import { getWidth } from 'ol/extent'
import { get as getProjection } from 'ol/proj'

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
  const format = new GeoJSON()
  const source = new VectorSource({ format: format })
  indexLayerSource.value = source

  try {
    const response = await fetch(fetch_url + '&outputFormat=application/flatgeobuf')
    if (!response.ok || response.body == null) throw new Error(`HTTP error ${response.status}`)

    const geojson = FGBGeoJson.deserialize(response.body)
    for await (const feature of geojson) source.addFeatures(format.readFeatures(feature))

  } catch (error) {
    console.error('Failed to load index map features:', error)
  }
})

// Generate WMTS tile grid for data layers
const projection = getProjection('EPSG:3857')!
const projSize = getWidth(projection.getExtent()) / 256;
const wmtsGrid = new WMTSTileGrid({
  extent: projection.getExtent(),
  resolutions: [...Array(19)].map((_, z) => projSize / 2 ** z),
  matrixIds: [...Array(19)].map((_, z) => 'EPSG:900913:'+z),
})

// Data layer source
const dataLayerSource = computed(() => {
  if (!currentDataset.value?.data_url) return null
  return new WMTS({
    url: URLS.WMTS_PAITULI_BASE_GWC,
    layer: currentDataset.value.data_url,
    tileGrid: wmtsGrid,
    version: '1.0.0',
    format: 'image/png',
    style: 'default',
    matrixSet: 'EPSG:3857'
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
