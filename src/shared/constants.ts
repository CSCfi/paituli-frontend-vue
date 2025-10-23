export const LAYER = {
  INDEX_LAYER: 'paituli:index_wgs84',
  MUNICIPALITIES_LAYER: 'paituli:mml_hallinto_2020_100k',
  CATCHMENT_AREAS_LAYER: 'paituli:syke_valuma_maa',
} as const

const _GS_BASE = import.meta.env.VITE_GEOSERVER_BASE

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
  WMS_PAITULI_BASE: _GS_BASE + '/wms?',
  WMS_PAITULI_BASE_GWC: _GS_BASE + '/gwc/service/wms?',
  WMTS_PAITULI_BASE_GWC: _GS_BASE + '/gwc/service/wmts?',
  WCS_PAITULI_BASE: _GS_BASE + '/wcs?',
  WFS_PAITULI_BASE: _GS_BASE + '/wfs?',
  WFS_INDEX_MAP_LAYER:
    _GS_BASE +
    '/wfs?service=WFS&version=2.0.0&request=GetFeature&srsname=epsg:3857&typeNames=' +
    LAYER.INDEX_LAYER +
    '&cql_filter= !key! = \'!value!\'',
  OGC_MAPS_PAITULI_BASE: _GS_BASE + '/ogc/maps/v1',
  OGC_TILES_PAITULI_BASE: _GS_BASE + '/ogc/tiles/v1',
  OGC_FEATURES_PAITULI_BASE: _GS_BASE + '/ogc/features/v1',
  OGC_COVERAGES_PAITULI_BASE: _GS_BASE + '/ogc/coverages/v1',

  // STAC
  STAC_PAITULI_BASE: _GS_BASE + '/ogc/stac/v1',
  STAC_BROWSER_BASE: 'https://radiantearth.github.io/stac-browser/#/external/paituli.csc.fi/geoserver/ogc/stac/v1/collections',

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
  MAX_ZIP_SIZE: 1000 // MB
} as const
