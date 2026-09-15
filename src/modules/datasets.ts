import { ref } from 'vue'

import type { Dataset } from '@/shared/types'
import { ROIHU_BLACKLIST, URLS } from '@/shared/constants'
import { currentLocale } from '@/modules/locale'

// Fetches datasets for the current locale from the backend.
// This metadata is used to fetch actual layer data in other modules.
async function fetchMetadata() {
  const response = await fetch(`${URLS.METADATA_API}/${currentLocale.value}`)
  if (!response.ok) throw new Error(`HTTP code ${response.status}`)
  datasets.value = await response.json()
}

// Why the last fetch failed, or empty when it did not.
// This is tracked by the app to display error messages to the user.
export const metadataError = ref('')

// Returns whether the metadata arrived and records the above failure, if any.
export async function loadMetadata(): Promise<boolean> {
  try {
    await fetchMetadata()
    metadataError.value = ''
    return true
  } catch (error) {
    console.warn('Could not fetch dataset metadata:', error)
    metadataError.value = String(error)
    return false
  }
}

// Global state for fetched datasets and the selected one
export const datasets = ref<Dataset[]>([])
export const currentDataset = ref<Dataset | null>(null)

// Helper methods
export function getById(id: string) {
  return datasets.value.find((d) => d.data_id === id) ?? null
}
export function setCurrent(id: string) {
  currentDataset.value = getById(id)
}
export function clearCurrent() {
  currentDataset.value = null
}
export function hasRasterData(dataset: Dataset): boolean {
  const formats = ['TIFF', 'PNG']
  return formats.some(f => dataset.format.toUpperCase().includes(f))
}
export function hasVectorData(dataset: Dataset): boolean {
  const formats = ['SHAPE', 'GEOPACKAGE']
  return formats.some(f => dataset.format.toUpperCase().includes(f))
}
export function isOnRoihu(dataset: Dataset): boolean {
  return !ROIHU_BLACKLIST.some(r => r.test(dataset.funet) || r.test(dataset.data_id))
}