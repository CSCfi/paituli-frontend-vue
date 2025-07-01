export const LAYER = {
  INDEX_LAYER: 'paituli:index_wgs84',
  MUNICIPALITIES_LAYER: 'paituli:mml_hallinto_2020_100k',
  CATCHMENT_AREAS_LAYER: 'paituli:syke_valuma_maa',
} as const

export const URLS = {
  NOMINATIM_API: 'https://nominatim.openstreetmap.org/search?q=!query!&format=json',
  API_BASE: 'https://api.example.com/v1',
  METADATA_API: import.meta.env.VITE_METADATA_API,
  DOWNLOAD_API: import.meta.env.VITE_DOWNLOAD_API,
  WMS_PAITULI_BASE_GWC: import.meta.env.VITE_GEOSERVER_BASE + '/gwc/service/wms?',
  WFS_INDEX_MAP_LAYER:
    import.meta.env.VITE_GEOSERVER_BASE +
    '/wfs?service=WFS&version=2.0.0&request=GetFeature&srsname=epsg:3857&typeNames=' +
    LAYER.INDEX_LAYER +
    "&cql_filter= !key! = '!value!'",
} as const

export const APP_SETTINGS = {
  MAP_DEFAULT_ZOOM: 5,
  MAP_DEFAULT_CENTER: [3078568, 9574992] as [number, number],
  APP_NAME: 'My Vue App',
} as const
