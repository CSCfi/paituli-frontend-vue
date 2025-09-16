import { URLS } from '@/shared/constants'
import type { Dataset } from '@/shared/types'
import { readonly, ref } from 'vue'

const datasets = ref<Dataset[]>([])
const currentDataset = ref<Dataset | null>(null)

const isFetching = ref(false)

const getById = (id: string) => datasets.value.find((d) => d.data_id === id) ?? null

const setCurrent = (id: string) => {
  currentDataset.value = getById(id)
}

const clearCurrent = () => {
  currentDataset.value = null
}

// Query dataset metadata from the backend
const fetchDatasets = async (): Promise<void> => {
  isFetching.value = true
  try {
    const response = await fetch(`${URLS.METADATA_API}`)
    if (!response.ok) throw new Error(`HTTP error ${response.status}`)
    datasets.value = await response.json()
  } finally {
    isFetching.value = false
  }
}

function hasRasterData(dataset: Dataset): boolean
{
  const formats = ['TIFF', 'PNG']
  return formats.some(f => dataset.format.toUpperCase().includes(f))
}

function hasVectorData(dataset: Dataset): boolean
{
  const formats = ['SHAPE', 'GEOPACKAGE']
  return formats.some(f => dataset.format.toUpperCase().includes(f))
}

export function useDatasets() {
  return {
    datasets: readonly(datasets),
    currentDataset: readonly(currentDataset),
    isFetching: readonly(isFetching),
    getById,
    setCurrent,
    clearCurrent,
    fetchDatasets,
    hasRasterData,
    hasVectorData,
  }
}
