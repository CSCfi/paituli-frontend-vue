export const LAYER = {
  INDEX_LAYER: 'paituli:index_wgs84',
  MUNICIPALITIES_LAYER: 'paituli:mml_hallinto_2020_100k',
  CATCHMENT_AREAS_LAYER: 'paituli:syke_valuma_maa',
} as const

export const URLS = {
  METADATA_API: import.meta.env.VITE_METADATA_API,
  DOWNLOAD_API: import.meta.env.VITE_DOWNLOAD_API,

  // Links tab
  FTP_LINKS_BASE: 'ftp://ftp.funet.fi/index/geodata/',
  HTTP_LINKS_BASE: 'http://www.nic.funet.fi/index/geodata/',
  INFO_LINK: 'https://paituli.csc.fi/files.html',

  // Location search
  NOMINATIM_API:
    'https://nominatim.openstreetmap.org/search?q=!query!&format=json',

  // GeoServer
  WMS_PAITULI_BASE:
    import.meta.env.VITE_GEOSERVER_BASE +
    '/wms?',
  WMS_PAITULI_BASE_GWC:
    import.meta.env.VITE_GEOSERVER_BASE +
    '/gwc/service/wms?',
  WFS_INDEX_MAP_LAYER:
    import.meta.env.VITE_GEOSERVER_BASE +
    '/wfs?service=WFS&version=2.0.0&request=GetFeature&srsname=epsg:3857&typeNames=' +
    LAYER.INDEX_LAYER +
    '&cql_filter= !key! = \'!value!\'',

  // Etsin
  ETSIN_METADATA_BASE:
    'http://urn.fi/',
  ETSIN_METADATA_JSON_BASE:
    import.meta.env.VITE_ETSIN_BASE +
    '/rest/datasets?format=json&preferred_identifier=',

} as const

export const APP_SETTINGS = {
  MAP_DEFAULT_ZOOM: 5.5,
  MAP_DEFAULT_CENTER: [2900000, 9800000] as [number, number],
  APP_NAME: 'Paituli',
} as const
