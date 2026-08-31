import { defineAsyncComponent, type Component } from 'vue'

import { URLS } from '@/shared/constants'
import type { Dataset } from '@/shared/types'

// Everything a renderer needs about the previewed file. PreviewView builds this
// from the route query alone: the preview always opens in its own tab, so it
// cannot reach the map's in-memory selection.
export interface PreviewSource {
  // Index entry the preview was opened for, as stored on the index layer
  path: string
  // The single file that entry resolves to, relative to the geodata root
  file: string
  // Absolute URL of that file in the Funet archive, for links shown to the user
  url: string
  // Where a renderer reads the same file from, which differs in development
  fetchUrl: string
  // Filename, or the last segment when the entry names a directory
  name: string
  // Dataset the file belongs to. Null when the metadata could not be resolved,
  // which costs us the header details and any glob resolution below.
  dataset: Dataset | null
  // Index entries of some datasets name a whole directory rather than one file.
  // The FMI daily rasters are one map sheet covering a folder of 65 yearly files.
  directory: boolean
}

// Renderers load on demand to keep their decoders out of the main bundle. That
// only matters more as formats are added: geotiff.js for TIFF, and eventually a
// WebGL point cloud renderer for LAZ.
const imagePreview = defineAsyncComponent(
  () => import('@/components/preview/ImagePreview.vue'))
const geoTiffPreview = defineAsyncComponent(
  () => import('@/components/preview/GeoTiffPreview.vue'))
const unsupportedPreview = defineAsyncComponent(
  () => import('@/components/preview/UnsupportedPreview.vue'))

// Which renderer handles a file, keyed by extension. Datasets do carry a
// `format` field, but it is free-form prose ("TIFF, with marginalia") and
// describes the dataset rather than the file, so the extension decides.
const RENDERERS: Record<string, Component> = {
  png: imagePreview,
  jpg: imagePreview,
  jpeg: imagePreview,
  tif: geoTiffPreview,
  tiff: geoTiffPreview,
}

// Extensions the file list offers an eye button for. Kept separate from
// RENDERERS so that a format whose renderer is still a placeholder resolves to
// a helpful page when its URL is opened directly, without advertising a
// preview that cannot draw anything yet.
const OFFERED: string[] = ['png', 'jpg', 'jpeg', 'tif', 'tiff']

// Dataset formats are prose, so match on the substrings that distinguish the
// ones we can name a file extension for.
const FORMAT_EXTENSIONS: [string, string][] = [
  ['TIFF', 'tif'],
  ['PNG', 'png'],
  ['JPEG2000', 'jp2'],
  ['LAZ', 'laz'],
]

export function fileName(path: string): string {
  const segments = path.replace(/\/+$/, '').split('/')
  return segments[segments.length - 1] ?? path
}

export function fileExtension(path: string): string {
  const name = fileName(path)
  const dot = name.lastIndexOf('.')
  return dot > 0 ? name.slice(dot + 1).toLowerCase() : ''
}

// Directory entries carry a trailing slash, and never an extension
export function isDirectory(path: string): boolean {
  return path.endsWith('/') || fileExtension(path) === ''
}

// Index entries are download specifications rather than plain file locators:
// besides a filename they can name a directory, or a `NAME.*` glob standing for
// a raster together with its sidecars (K3R.png, K3R.pgw, K3R.prj). A glob
// resolves to the one file whose extension matches the dataset's format, which
// is why previewing a glob entry needs the dataset metadata.
export function needsDataset(path: string): boolean {
  return path.includes('*')
}

export function resolvePath(path: string, dataset: Dataset | null): string {
  if (!needsDataset(path)) return path
  const format = dataset?.format.toUpperCase() ?? ''
  const extension = FORMAT_EXTENSIONS
    .find(([name]) => format.includes(name))?.[1]
  return extension ? path.replace(/\*$/, extension) : path
}

export function fileUrl(path: string): string {
  return URLS.HTTP_LINKS_BASE + path.replace(/^\/+/, '')
}

export function fileFetchUrl(path: string): string {
  return URLS.GEODATA_FETCH_BASE + path.replace(/^\/+/, '')
}

// Whether to show the eye button for this index entry at all
export function previewOffered(path: string, dataset: Dataset | null): boolean {
  const file = resolvePath(path, dataset)
  return !isDirectory(file)
    && !needsDataset(file)
    && OFFERED.includes(fileExtension(file))
}

export function rendererFor(source: PreviewSource): Component {
  if (source.directory || needsDataset(source.file)) return unsupportedPreview
  return RENDERERS[fileExtension(source.file)] ?? unsupportedPreview
}

// The preview resolves everything it shows from these two parameters, which
// keeps its URLs linkable, reloadable and openable side by side.
export function previewHref(dataId: string, path: string): string {
  const query = new URLSearchParams({ data_id: dataId, path })
  return `/preview?${query}`
}

export function buildSource(path: string, dataset: Dataset | null): PreviewSource {
  const file = resolvePath(path, dataset)
  return {
    path,
    file,
    url: fileUrl(file),
    fetchUrl: fileFetchUrl(file),
    name: fileName(file),
    dataset,
    directory: isDirectory(file),
  }
}
