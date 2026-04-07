import { computed, ref, shallowRef } from 'vue'

import { geojson as FGBGeoJson } from 'flatgeobuf'

import { GeoJSON } from 'ol/format'
import { TileWMS, WMTS } from 'ol/source'
import VectorSource from 'ol/source/Vector'
import WMTSTileGrid from 'ol/tilegrid/WMTS'
import { getWidth, type Extent } from 'ol/extent'
import { get as getProjection, type ProjectionLike } from 'ol/proj'
import type { GeoJSONFeatureCollection } from 'ol/format/GeoJSON'
import type { Geometry } from 'ol/geom'
import Feature from 'ol/Feature'
import { fromExtent } from 'ol/geom/Polygon'
import { Stroke, Style } from 'ol/style'

import { LAYER, URLS } from '@/shared/constants'
import { currentDataset } from '@/modules/datasets'
import type { ImageTile } from 'ol'
import { currentLocale } from './locale'
import { mapViewResolution } from './controls'

// Background map source
export const osmSource = new TileWMS({
  url: 'https://ows.terrestris.de/osm/service?',
  params: {
    LAYERS: 'OSM-WMS',
    VERSION: '1.1.0',
  },
})

// Mapsheet source
export const indexSource = shallowRef<VectorSource | null>(null)

// Utility layers WMS sources
export const muncipalitiesSource = new TileWMS({
  url: URLS.WMS_PAITULI_BASE,
  params: {
    LAYERS: LAYER.MUNICIPALITIES_LAYER,
    VERSION: '1.1.0',
  },
});
export const catchmentSource = new TileWMS({
  url: URLS.WMS_PAITULI_BASE,
  params: {
    LAYERS: LAYER.CATCHMENT_AREAS_LAYER,
    VERSION: '1.1.0',
  },
});


// Tile grid for WMTS data layer
const projection = getProjection('EPSG:3857')!
const projSize = getWidth(projection.getExtent()) / 256;
const wmtsGrid = new WMTSTileGrid({
  extent: projection.getExtent(),
  resolutions: [...Array(31)].map((_, z) => projSize / 2 ** z),
  matrixIds: [...Array(31)].map((_, z) => 'EPSG:900913:'+z),
})

// Data layer WMTS source for rendering
export const dataSource = computed(() => {
  if (!currentDataset.value?.data_url) return null
  return new WMTS({
    url: URLS.WMTS_PAITULI_BASE_GWC,
    layer: currentDataset.value.data_url,
    tileGrid: wmtsGrid,
    version: '1.0.0',
    format: 'image/png',
    style: 'default',
    matrixSet: 'EPSG:3857',

    // Set a temporary loading image while loading the real image
    // in the background. After that we request a redraw to display it
    tileLoadFunction: (tile, url) => {
      const loader = new Image()
      loader.src = url
      const target = (tile as ImageTile).getImage() as HTMLImageElement
      target.src = `loading_tile_${currentLocale.value}.png`
      loader.onerror = () => target.src = ''
      loader.onload = () => {
        target.src = url
        tileLoadCallback.value?.()
      }
    },
  })
})

// A callback for source redraws upon tile loading
export const tileLoadCallback = ref<() => void>()

// The resolution at which the current dataset should start rendering its data layer.
export const dataLayerMaxResolution = computed(() => {
  const max_scale = currentDataset.value?.data_max_scale
  // We can convert from scale denominators to view resolutions
  // (px/m) by multiplying with standard OGC pixel size.
  // For datasets without a max scale we simply use a resolution
  // which should cover Finland at all at once.
  return max_scale ? (max_scale * 0.00028) : 4000
})

// Is our map view not zoomed in enough?
export const dataHidden = computed(() =>
  mapViewResolution.value > dataLayerMaxResolution.value)

// Fetches index data for provided dataset and replaces index layer
export async function loadIndexLayer(data_id: string) {

  const format = new GeoJSON()
  const source = new VectorSource({ format: format })
  indexSource.value = source

  const fetch_url = URLS.WFS_INDEX_MAP_LAYER
    .replace('!key!', 'data_id')
    .replace('!value!', data_id) +
    '&outputFormat=application/flatgeobuf'

  const response = await fetch(fetch_url)
  if (!response.ok || response.body == null) throw new Error(`HTTP error ${response.status}`)

  const geojson = FGBGeoJson.deserialize(response.body)
  for await (const feature of geojson) source.addFeatures(format.readFeatures(feature))
}

// A vector source for highlights
export const highlightSource = new VectorSource<Feature<Geometry>>({
  features: []
})

// Uses the highlight source to display an extent polygon
export function drawBoundingBox(extent: Extent) {
  const feature = new Feature({ geometry: fromExtent(extent) })
  feature.setStyle(new Style({
    stroke: new Stroke({
      color: 'red', width: 2
    })
  }))
  highlightSource.clear()
  highlightSource.addFeature(feature)
}

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
export async function fetchFeatureInfo(
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
