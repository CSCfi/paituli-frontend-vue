import { URLS } from '@/shared/constants'
import type { Dataset } from '@/shared/types'
import { computed, readonly, ref } from 'vue'

const datasets = ref<Dataset[]>([])
const currentDataset = ref<Dataset | null>(null)

const isFetching = ref(false)

const getById = (id: string) => datasets.value.find((d) => d.data_id === id) ?? null

const hasFeatureInfo = computed(() => !!currentDataset.value?.data_url)
const hasCurrent = computed(() => !!currentDataset.value)

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

export function useDatasets() {
  return {
    datasets: readonly(datasets),
    currentDataset: readonly(currentDataset),
    isFetching: readonly(isFetching),
    hasFeatureInfo,
    hasCurrent,
    getById,
    setCurrent,
    clearCurrent,
    fetchDatasets,
  }
}
