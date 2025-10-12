<script setup lang="ts">
import { ref, computed, watchEffect, watch } from 'vue'
import { useDatasets } from '@/composables/datasets'

import type { Dataset } from '@/shared/types'
import { URLS } from '@/shared/constants'
import { type MetadataParse, parseMetadata } from '@/shared/util'

const { datasets, setCurrent, clearCurrent, currentDataset, getById } = useDatasets()

const props = defineProps<{ loadId?: string }>()

// Dropdown selections
const selectedProducer = ref<string>('')
const selectedData = ref<string>('')
const selectedScale = ref<string>('')
const selectedYear = ref<string>('')
const selectedFormat = ref<string>('')

// Parsed dataset metadata
const parsedMetadata = ref<MetadataParse | null>(null);

// Reactive options for each dropdown,
// based on the current selection from available datasets
const producerOptions = computed(() =>
  datasets.value
    .map((d) => d.org)
    .filter(onlyDistinct)
    .sort(),
)
const dataOptions = computed(() =>
  datasets.value
    .filter((d) => d.org === selectedProducer.value)
    .map((d) => d.name)
    .filter(onlyDistinct)
    .sort(),
)
const scaleOptions = computed(() =>
  datasets.value
    .filter((d) => d.org === selectedProducer.value)
    .filter((d) => d.name === selectedData.value)
    .map((d) => d.scale)
    .filter(onlyDistinct)
    .sort(),
)
const yearOptions = computed(() =>
  datasets.value
    .filter((d) => d.org === selectedProducer.value)
    .filter((d) => d.name === selectedData.value)
    .filter((d) => d.scale === selectedScale.value)
    .map((d) => d.year)
    .filter(onlyDistinct)
    .sort((a, b) => Number(b) - Number(a)),
)
const formatOptions = computed(() =>
  datasets.value
    .filter((d) => d.org === selectedProducer.value)
    .filter((d) => d.name === selectedData.value)
    .filter((d) => d.scale === selectedScale.value)
    .filter((d) => d.year === selectedYear.value)
    .map((d) => d.format)
    .filter(onlyDistinct)
    .sort(),
)
//const onlyAuthorized = (data: Dataset) => data.access === 1 || true // TODO: is this needed?
const onlyDistinct = <T,>(value: T, index: number, self: T[]) => self.indexOf(value) === index

// Cascade dropdown updates when any of them changes,
// except for the producer which never changes automatically
watchEffect(() => {
  if (!dataOptions.value.includes(selectedData.value)) {
    selectedData.value = dataOptions.value[0] ?? ''
  }
  if (!scaleOptions.value.includes(selectedScale.value)) {
    selectedScale.value = scaleOptions.value[0] ?? ''
  }
  if (!yearOptions.value.includes(selectedYear.value)) {
    selectedYear.value = yearOptions.value[0] ?? ''
  }
  if (!formatOptions.value.includes(selectedFormat.value)) {
    selectedFormat.value = formatOptions.value[0] ?? ''
  }
  // Select a dataset matching the updated dropdown selections
  const selectedDataset = datasets.value.find(
    (d) =>
      d.org === selectedProducer.value &&
    d.name === selectedData.value &&
    d.scale === selectedScale.value &&
    d.year === selectedYear.value &&
    d.format === selectedFormat.value,
  ) ?? null
  if (selectedDataset) setCurrent(selectedDataset.data_id)
  else clearCurrent()
})

// When selected dataset changes, fetch its metadata and parse it
watch(currentDataset, async (dataset: Dataset | null) => {
  if (!dataset || !dataset.meta) return

  try {
    const response = await fetch(`${URLS.ETSIN_METADATA_JSON_BASE}${dataset.meta}`)
    if (!response.ok) throw new Error(`HTTP error ${response.status}`)
    parsedMetadata.value = parseMetadata(await response.json());
  } catch (err) {
    alert(`Failed to parse Etsin metadata: ${(err as Error).message}`)
  }
})

// When datasets are fetched, check if we should load one
watch(datasets, () => {
  if (currentDataset.value) {
    // Something already selected which we won't override
    return;
  }
  if (!props.loadId) {
    // No load requested
    return;
  }
  const dataset = getById(props.loadId)
  if (!dataset) {
    alert('Uknown dataset by id ' + props.loadId)
    return
  }
  selectedProducer.value = dataset.org
  selectedData.value = dataset.name
  selectedScale.value = dataset.scale
  selectedYear.value = dataset.year
  selectedFormat.value = dataset.format

  alert('Loaded dataset by id ' + props.loadId)
})


</script>

<template>
  <div class="controls">
    <label>
      <span>Producer</span>
      <select v-model="selectedProducer" :disabled="producerOptions.length <= 1">
        <option v-for="producer in producerOptions" :key="producer" :value="producer">
          {{ producer }}
        </option>
      </select>
    </label>

    <label>
      <span>Data</span>
      <select v-model="selectedData" :disabled="dataOptions.length <= 1">
        <option v-for="data in dataOptions" :key="data" :value="data">
          {{ data }}
        </option>
      </select>
    </label>

    <label>
      <span>Scale</span>
      <select v-model="selectedScale" :disabled="scaleOptions.length <= 1" >
        <option v-for="scale in scaleOptions" :key="scale" :value="scale" >
          {{ scale }}
        </option>
      </select>
    </label>

    <label>
      <span>Year</span>
      <select v-model="selectedYear" :disabled="yearOptions.length <= 1" >
        <option v-for="year in yearOptions" :key="year" :value="year">
          {{ year }}
        </option>
      </select>
    </label>

    <label>
      <span>Format</span>
      <select v-model="selectedFormat" :disabled="formatOptions.length <= 1" >
        <option v-for="format in formatOptions" :key="format" :value="format" >
          {{ format }}
        </option>
      </select>
    </label>
  </div>

</template>

<style scoped>
.controls {
  display: flex;
  flex-direction: column;
}
label {
  display: flex;
  align-items: center;
  color: white;
  padding-top: 0.3rem;

  select {
    flex: 1;
  }
  span {
    display: inline-flex;
    justify-content: flex-start;
    width: 80px;
  }
}
</style>
