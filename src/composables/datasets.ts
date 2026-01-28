import { URLS } from '@/shared/constants'
import type { Dataset } from '@/shared/types'
import { readonly, ref } from 'vue'
import { useToasts } from './toasts'
import { CToastType } from '@cscfi/csc-ui'
import { useLocale } from './locale'

// Global shared state
const datasets = ref<Dataset[]>([])
const currentDataset = ref<Dataset | null>(null)
const isFetching = ref(false)

export function useDatasets() {

  const { addToast } = useToasts()
  const { currentLocale } = useLocale()

  function getById(id: string) {
    return datasets.value.find((d) => d.data_id === id) ?? null
  }

  function setCurrent(id: string) {
    currentDataset.value = getById(id)
  }

  function clearCurrent() {
    currentDataset.value = null
  }

  // Query dataset metadata from the backend
  async function fetchDatasets(): Promise<void> {
    isFetching.value = true
    try {
      const response = await fetch(`${URLS.METADATA_API}/${currentLocale.value}`)
      if (!response.ok) throw new Error(`HTTP code ${response.status}`)
      datasets.value = await response.json()
    } catch (error) {
      addToast({
        type: CToastType.Error,
        title: 'Failed to load datasets',
        message: 'Refresh the page to retry. If the problem persists, ' +
               `please try again later. (${error})`,
      })
    } finally {
      isFetching.value = false
    }
  }

  function hasRasterData(dataset: Dataset): boolean {
    const formats = ['TIFF', 'PNG']
    return formats.some(f => dataset.format.toUpperCase().includes(f))
  }

  function hasVectorData(dataset: Dataset): boolean {
    const formats = ['SHAPE', 'GEOPACKAGE']
    return formats.some(f => dataset.format.toUpperCase().includes(f))
  }

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
