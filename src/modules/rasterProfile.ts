import { fromUrl, type GeoTIFF, type GeoTIFFImage } from 'geotiff'

// PhotometricInterpretation of a colour-mapped image, whose samples are indices
// into the file's own ColorMap rather than intensities.
const PALETTE = 3

// PhotometricInterpretation of an image whose lowest sample value is white.
// OpenLayers reads every non-RGB file as if zero were black.
const WHITE_IS_ZERO = 0

// Longest side of the sample read to find what range a band covers. The sample
// only has to be representative of the file, and on one with no overview
// pyramid every extra pixel means decoding more of the full-resolution image.
const SAMPLE = 512

// How many pixels an image may hold before it is sampled through a window cut
// out of the middle rather than read whole. The smallest level of a pyramid is
// far below this, so most files are sampled in full.
const SAMPLE_BUDGET = 4_000_000

// The keys GDAL writes into TIFF tag 42112, and the only ones OpenLayers looks
// for when deciding what range to scale a band from.
const STATISTICS = ['STATISTICS_MINIMUM', 'STATISTICS_MAXIMUM'] as const

// TIFF Compression values geotiff.js registers a decoder for: raw, LZW, JPEG,
// Deflate in both flavours, PackBits, LERC, Zstd and web image codecs. Its own
// registry is not reachable through the package's exports, so the list is
// repeated here.
const DECODABLE = new Set([1, 5, 7, 8, 32773, 32946, 34887, 50000, 50001])

// A file whose pixels no bundled decoder can read. Separate from every other
// profile failure because the preview cannot carry on without it: each tile
// would fail the same way, leaving an empty map behind a silent console error.
export class UnreadableRaster extends Error {}

export type Rgba = [number, number, number, number]

// What a file does not say about itself but a renderer needs anyway.
export interface RasterProfile {
  // The file's ColorMap as RGBA entries, for a `palette` style expression.
  // Present only for colour-mapped files.
  palette?: Rgba[]
  // Range to scale each band from, sampled from the file. Present only where
  // the file states no statistics of its own, indexed by band as OpenLayers
  // wants it, with a hole for any band the sample said nothing about.
  min?: number[]
  max?: number[]
  // Size of the smallest overview level, which is what a zoomed out view has
  // to be drawn from - the full-resolution image on a file with no pyramid.
  overview?: { width: number, height: number }
}

// Overview levels are entries in the directory chain like any other, and so are
// mask images. OpenLayers tells them apart the same way.
function isMask(image: GeoTIFFImage): boolean {
  const type = Number(image.fileDirectory.getValue('NewSubfileType') ?? 0)
  return (type & 4) === 4
}

// A ColorMap is three consecutive blocks of 16 bit values, one per channel,
// each indexed by sample value.
function paletteFrom(map: ArrayLike<number>): Rgba[] {
  const entries = Math.floor(map.length / 3)
  const colors: Rgba[] = new Array(entries)
  for (let index = 0; index < entries; index++) {
    colors[index] = [
      Math.floor(map[index] / 256),
      Math.floor(map[index + entries] / 256),
      Math.floor(map[index + entries * 2] / 256),
      1,
    ]
  }
  return colors
}

// The smallest overview level, which is the cheapest place to sample values
// from. Falls back to the full-resolution image on a file with no pyramid.
async function coarsest(file: GeoTIFF): Promise<GeoTIFFImage> {
  const count = await file.getImageCount()
  let smallest = await file.getImage(0)
  let smallestArea = smallest.getWidth() * smallest.getHeight()
  for (let index = 1; index < count; index++) {
    const image = await file.getImage(index)
    if (isMask(image)) continue
    const area = image.getWidth() * image.getHeight()
    if (area < smallestArea) {
      smallest = image
      smallestArea = area
    }
  }
  return smallest
}

// Reads enough of an image to see what range its values actually cover. Every
// band is sampled, so the sample shrinks as they multiply: the widest files
// here hold one band per day of the year, and each one is a separate decode.
function sample(image: GeoTIFFImage) {
  const side = Math.max(64,
    Math.floor(SAMPLE / Math.sqrt(image.getSamplesPerPixel() || 1)))
  const width = image.getWidth()
  const height = image.getHeight()
  if (width * height <= SAMPLE_BUDGET) {
    return image.readRasters({
      interleave: false,
      width: Math.min(width, side),
      height: Math.min(height, side),
    })
  }

  // Too much to decode whole, so the middle of it stands in for the rest
  const left = Math.max(0, Math.floor((width - side) / 2))
  const top = Math.max(0, Math.floor((height - side) / 2))
  return image.readRasters({
    interleave: false,
    window: [
      left,
      top,
      Math.min(width, left + side),
      Math.min(height, top + side),
    ],
  })
}

function rangeOf(values: ArrayLike<number>, nodata: number | null) {
  // GDAL records nodata as text, and a float32 raster's sentinel does not
  // survive the trip back: the double parsed from "-3.4e+38" is not the double
  // a Float32Array hands back for the float32 the file actually stores, so
  // comparing the two never matches and the sentinel is taken for data. One
  // such value is enough to stretch a band of temperatures into a flat white
  // silhouette. Narrowing it to float32 as well catches the value at whichever
  // width it was written.
  const narrowed = nodata === null ? null : Math.fround(nodata)
  let min = Infinity
  let max = -Infinity
  for (let index = 0; index < values.length; index++) {
    const value = values[index]
    // Skips NaN, which is what a nodata value often is in a float raster
    if (!Number.isFinite(value)) continue
    if (value === nodata || value === narrowed) continue
    if (value < min) min = value
    if (value > max) max = value
  }
  return min <= max ? { min, max } : undefined
}

// Reads what a GeoTIFF leaves OpenLayers unable to work out for itself.
//
// OpenLayers only reaches for RGB conversion at three samples per pixel, so a
// palette file's indices are drawn as intensities unless its ColorMap is
// passed in. And with no GDAL statistics it scales a band from the whole range
// of its sample type, so a 16 bit height model spanning a few hundred metres
// lands in the bottom hundredth of -32768..32767.
export async function readProfile(url: string): Promise<RasterProfile> {
  const file = await fromUrl(url)
  const image = await file.getImage(0)

  const compression = Number(image.fileDirectory.getValue('Compression') ?? 1)
  if (!DECODABLE.has(compression)) {
    throw new UnreadableRaster(
      `No decoder for this file's compression (TIFF Compression ${compression})`)
  }

  // Read for every file, because it decides how far the view may zoom out
  // whether or not anything else here applies
  const smallest = await coarsest(file)
  const profile: RasterProfile = {
    overview: { width: smallest.getWidth(), height: smallest.getHeight() },
  }

  const photometric = image.fileDirectory.getValue('PhotometricInterpretation')
  if (photometric === PALETTE) {
    const map = await image.fileDirectory.loadValue('ColorMap')
    if (map?.length) return { ...profile, palette: paletteFrom(map) }
  }

  // Scaling a band backwards is the only way to tell OpenLayers that its low
  // end is the white one, so such a file needs a range even where one would
  // otherwise be left alone.
  const inverted = photometric === WHITE_IS_ZERO
  if (!inverted) {
    // 8 bit samples already fill the range OpenLayers assumes for them
    if (image.getBitsPerSample(0) === 8) return profile
    const metadata = await image.getGDALMetadata(0)
    if (metadata && STATISTICS.every((key) => key in metadata)) return profile
  }

  const bands = await sample(smallest)
  const nodata = image.getGDALNoData()
  const min: number[] = []
  const max: number[] = []
  for (let band = 0; band < bands.length; band++) {
    const range = rangeOf(bands[band], nodata)
    if (!range) continue
    const low = range.min
    // A band of one value would otherwise be scaled by a division by zero
    const high = range.max > range.min ? range.max : range.min + 1
    min[band] = inverted ? high : low
    max[band] = inverted ? low : high
  }
  return min.length ? { ...profile, min, max } : profile
}
