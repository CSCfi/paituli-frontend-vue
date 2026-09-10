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
  // ETRS89 / TM35FIN(E,N), the projection of 719 of the 778 datasets
  'EPSG:3067':
    '+proj=utm +zone=35 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
}

// WGS 84 / UTM north, the zones the Landsat scenes are delivered in
for (const zone of [32, 33, 34, 35, 36]) {
  DEFINITIONS[`EPSG:${32600 + zone}`] =
    `+proj=utm +zone=${zone} +datum=WGS84 +units=m +no_defs`
}

// Importing this module teaches OpenLayers the projections above. Only the
// GeoTIFF renderer imports it, and that is itself loaded on demand, so proj4
// stays out of the main bundle.
for (const [code, definition] of Object.entries(DEFINITIONS)) {
  proj4.defs(code, definition)
}
register(proj4)
