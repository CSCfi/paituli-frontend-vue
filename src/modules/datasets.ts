import type { Dataset } from '@/shared/types'
import { ref } from 'vue'

// Global state for fetched datasets and the selected one
export const datasets = ref<Dataset[]>([])
export const currentDataset = ref<Dataset | null>(null)
export const isFetching = ref(false)

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