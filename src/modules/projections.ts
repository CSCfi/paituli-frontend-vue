import proj4 from 'proj4'
import { register } from 'ol/proj/proj4'

// Coordinate systems that Paituli's data files declare in their own metadata.
// The map views themselves work in EPSG:3857, which OpenLayers knows natively,
// but a GeoTIFF carries its own projection and OL can only build a view for one
// it has a definition for.
//
// OL can also fetch missing definitions from spatialreference.org via the
// `loadMissingProjection` source option. That is deliberately not used here: it
// would make rendering a file depend on a third-party service at runtime.
const DEFINITIONS: Record<string, string> = {
  // ETRS89 / TM35FIN(E,N), which almost every dataset is delivered in
  'EPSG:3067':
    '+proj=utm +zone=35 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
}

// WGS 84 / UTM north, the zones the Landsat scenes are delivered in
for (const zone of [32, 33, 34, 35, 36]) {
  DEFINITIONS[`EPSG:${32600 + zone}`] =
    `+proj=utm +zone=${zone} +datum=WGS84 +units=m +no_defs`
}

// KKJ, the older basic map series, by zone: the zone number gives both the
// central meridian and the prefix on the easting. All six are needed because
// the 25k series is filed one directory per zone, and a dataset's `coord_sys`
// says only "KKJ" for every one of them - so which zone a sheet is in can only
// come from the sheet. Zone 3 doubles as YKJ, the Finland Uniform Coordinate
// System, which the small-scale rasters use on its own.
const KKJ_CODES = [3386, 2391, 2392, 2393, 2394, 3387]
const KKJ_SHIFT = '-96.062,-82.428,-121.753,-4.801,-0.345,1.376,1.496'
KKJ_CODES.forEach((code, zone) => {
  DEFINITIONS[`EPSG:${code}`] =
    `+proj=tmerc +lat_0=0 +lon_0=${18 + zone * 3} +k=1 +x_0=${zone * 1000000 + 500000} +y_0=0 +ellps=intl +towgs84=${KKJ_SHIFT} +units=m +no_defs`
})

// Importing this module teaches OpenLayers the projections above. Only the
// GeoTIFF renderer imports it, and that is itself loaded on demand, so proj4
// stays out of the main bundle.
for (const [code, definition] of Object.entries(DEFINITIONS)) {
  proj4.defs(code, definition)
}
register(proj4)
