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
  HTTP_LINKS_BASE: 'https://www.nic.funet.fi/index/geodata/',
  FTP_LINKS_BASE: 'ftp://ftp.funet.fi/index/geodata/',
  RSYNC_LINKS_BASE: 'rsync://rsync.nic.funet.fi/ftp/index/geodata/',

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
  GEOPACKAGE_BASE: _GS_BASE + '/wfs?service=WFS&version=2.0.0&request=GetFeature&srsname=epsg:4326&typeNames=paituli:index_wgs84&outputFormat=gpkg&propertyname=label,path,geom&cql_filter=data_id=\'!id!\'',

  // STAC
  STAC_PAITULI_BASE: _GS_BASE + '/ogc/stac/v1',
  STAC_BROWSER_BASE: 'https://radiantearth.github.io/stac-browser/#/external/paituli.csc.fi/geoserver/ogc/stac/v1/collections',

  // Etsin
  ETSIN_METADATA_BASE:
    'http://urn.fi/',
  ETSIN_METADATA_JSON_BASE:
    import.meta.env.VITE_ETSIN_BASE +
    '/rest/datasets?format=json&preferred_identifier=',

  // Puhti
  PUHTI_GEO_BASE: '/appl/data/geo/'

} as const

export const APP_SETTINGS = {
  MAP_DEFAULT_ZOOM: 5.7,
  MAP_DEFAULT_CENTER: [2900000, 9950000],
  MAP_DEFAULT_EXTENT: [2124332, 8279202, 3516216, 11098822],
  MAP_DEFAULT_PADDING: [150, 40, 40, 40],
  MAP_ZOOM_STEP: 0.65,
  APP_NAME: 'Paituli',
  MAX_ZIP_SIZE: 3000 // MB
}
