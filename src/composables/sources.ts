import { LAYER, URLS } from '@/shared/constants'
import { GeoJSON } from 'ol/format'
import { computed, shallowRef, watch } from 'vue'

import { TileWMS, WMTS } from 'ol/source'
import VectorSource from 'ol/source/Vector'
import { useDatasets } from './datasets'

import { geojson as FGBGeoJson } from 'flatgeobuf'
import WMTSTileGrid from 'ol/tilegrid/WMTS'
import { getWidth, type Extent } from 'ol/extent'
import { get as getProjection, type ProjectionLike } from 'ol/proj'
import type { GeoJSONFeatureCollection } from 'ol/format/GeoJSON'
import type { Geometry } from 'ol/geom'
import Feature from 'ol/Feature'
import { fromExtent } from 'ol/geom/Polygon'
import { Stroke, Style } from 'ol/style'

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

// Tile grid for WMTS data layer
const projection = getProjection('EPSG:3857')!
const projSize = getWidth(projection.getExtent()) / 256;
const wmtsGrid = new WMTSTileGrid({
  extent: projection.getExtent(),
  resolutions: [...Array(31)].map((_, z) => projSize / 2 ** z),
  matrixIds: [...Array(31)].map((_, z) => 'EPSG:900913:'+z),
})

// Utility layers WMS sources
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

// A vector source for highlights
const highlightSource = new VectorSource<Feature<Geometry>>({
  features: []
})

// Mapsheet source
const indexLayerSource = shallowRef<VectorSource | null>(null)


export function useSources() {
  const { currentDataset } = useDatasets()

  // Update index layer whenever the current dataset changes
  watch(currentDataset, async (dataset) => {
    indexLayerSource.value = null
    if (!dataset?.data_id) {
      return
    }
    // Clear our highlights at this point
    highlightSource.clear()

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
    // TODO: Put the same toast here as MapItem mount
      console.error('Failed to load index map features:', error)
    }
  })

  // Data layer WMTS source for rendering
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
    return max_scale ? max_scale / 2835 : 100
  })

  // Auxiliary WMS source for feature info queries
  const _featureInfoSource = computed(() => {
    if (!currentDataset.value?.data_url) return null
    return new TileWMS({
      url: URLS.WMS_PAITULI_BASE_GWC,
      serverType: 'geoserver',
      params: {
        LAYERS: currentDataset.value.data_url,
        VERSION: '1.1.1',
      },
    })
  })

  // Fetches the feature info of current dataset from the provided point,
  // and parses the info into a string to be to be displayed to the user
  async function fetchFeatureInfo(
    coordinate: number[],
    resolution: number | undefined,
    projection: ProjectionLike): Promise<string> {

    if (!_featureInfoSource.value) throw Error(
      'Cannot fetch feature info for datasets with no data layer!'
    )
    if (resolution == undefined) throw Error('Undefined map resolution!?')

    // Build feature info query
    const url = _featureInfoSource.value.getFeatureInfoUrl(
      coordinate, resolution, projection,
      {INFO_FORMAT: 'application/json'}
    )
    if (!url) throw Error('OpenLayers failed to construct GetFeatureInfo URL')

    // Fetch the information and parse it
    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP code ${response.status}`)

    const json: GeoJSONFeatureCollection = await response.json()
    const info = json.features[0]?.properties
    if (!info) return 'None!'

    return Object.entries(info)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n')
  }

  // Uses the highlight source to display an extent polygon
  function drawBoundingBox(extent: Extent) {
    const feature = new Feature({ geometry: fromExtent(extent) })
    feature.setStyle(new Style({
      stroke: new Stroke({
        color: 'red', width: 2
      })
    }))
    highlightSource.clear()
    highlightSource.addFeature(feature)
  }

  return {
    osmSource,
    indexLayerSource,
    dataLayerSource,
    dataLayerMaxResolution,
    muncipalitiesSource,
    catchmentSource,
    highlightSource,
    fetchFeatureInfo,
    drawBoundingBox,
  }
}
