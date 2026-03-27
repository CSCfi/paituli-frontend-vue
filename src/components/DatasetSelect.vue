<script setup lang="ts">
import { ref, computed, watchEffect, watch } from 'vue'

import { useI18n } from 'vue-i18n'
import { CToastType } from '@cscfi/csc-ui'

import { useToasts } from '@/composables/toasts'
import {
  clearCurrent,
  currentDataset,
  datasets,
  getById,
  setCurrent
} from '@/modules/datasets';

const { addToast } = useToasts();
const { t } = useI18n()

const props = defineProps<{ loadId?: string }>()

// Dropdown selections
const selectedProducer = ref<string>('')
const selectedData = ref<string>('')
const selectedScale = ref<string>('')
const selectedYear = ref<string>('')
const selectedFormat = ref<string>('')

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
  if (selectedDataset) {
    setCurrent(selectedDataset.data_id)
  }
})

// When datasets are fetched, check if we should load one
watch(datasets, () => {
  // If we have a dataset currently selected, we use its id.
  // If not, we use the id user requested upon mounting
  const data_id = currentDataset.value?.data_id ?? props.loadId
  if (!data_id) return

  const dataset = getById(data_id)
  if (!dataset) {
    if (props.loadId) {
      // Requested id does not match any fetched dataset
      addToast({
        type: CToastType.Error,
        title: t('toasts.failed.title'),
        message: t('toasts.failed.message', { id: props.loadId }),
      })
    }
    else {
      // Metadata does not exist for new locale...?
      console.error(
        'Dataset not found upon metadata refresh: ' + data_id)
      clearCurrent()
    }
    return
  }
  selectedProducer.value = dataset.org
  selectedData.value = dataset.name
  selectedScale.value = dataset.scale
  selectedYear.value = dataset.year
  selectedFormat.value = dataset.format
}, { immediate: true })

// Precomputed dataset count map to be displayed in producer dropdown,
// indexed with producer id
const datasetCount = computed(() => {
  const map: Record<string, number> = {}
  for (const producer of producerOptions.value) {
    const filtered = datasets.value.filter(d => d.org === producer)
    const distinctNames = new Set(filtered.map(d => d.name))
    map[producer] = distinctNames.size
  }
  return map
})

</script>

<template>
  <c-toasts
    ref="toasts"
    horizontal="center"
    vertical="center"
  />

  <div>
    <c-select
      v-model="selectedProducer"
      v-control
      :placeholder="`${t('choose')} ${t('labels.producer')}...`"
      :label="t('labels.producer')"
      :key="producerOptions"
      hide-details>
      <c-option
        v-for="producer in producerOptions"
        :key="producer"
        v-bind="{ value: producer, name: producer }">
        <c-row align="center" justify="space-between">
          {{ producer }}
          <c-tag flat>
            {{ datasetCount[producer] }} {{ t('labels.data', datasetCount[producer]) }}
          </c-tag>
        </c-row>
      </c-option>
    </c-select>

    <c-select
      v-model="selectedData"
      v-control
      :placeholder="`${t('choose')} ${t('labels.data')}...`"
      :label="t('labels.data')"
      :disabled="dataOptions.length < 1"
      hide-details>
      <c-option
        v-for="dataset in dataOptions"
        :key="dataset"
        v-bind="{ value: dataset, name: dataset }">
        {{ dataset }}
      </c-option>
    </c-select>

    <c-select
      v-model="selectedScale"
      v-control
      :label="t('labels.scale')"
      :disabled="scaleOptions.length < 1"
      hide-details>
      <c-option
        v-for="scale in scaleOptions"
        :key="scale"
        v-bind="{ value: scale, name: scale }">
        {{ scale }}
      </c-option>
    </c-select>

    <c-select
      v-model="selectedYear"
      v-control
      :label="t('labels.year')"
      :disabled="yearOptions.length < 1"
      hide-details>
      <c-option
        v-for="year in yearOptions"
        :key="year"
        v-bind="{ value: year, name: year }">
        {{ year }}
      </c-option>
    </c-select>

    <c-select
      v-model="selectedFormat"
      v-control
      :label="t('labels.format')"
      :disabled="formatOptions.length < 1"
      hide-details>
      <c-option
        v-for="format in formatOptions"
        :key="format"
        v-bind="{ value: format, name: format }">
        {{ format }}
      </c-option>
    </c-select>

  </div>

</template>

<i18n>
  {
    "en": {
      "choose": "Choose",
      "labels": {
        "producer": "Producer",
        "data": "Dataset | Datasets",
        "scale": "Scale",
        "year": "Year",
        "format": "Format",
      },
      "toasts": {
        "failed": {
          "title": "Could not load dataset",
          "message": "Unknown dataset id '{id}'",
        },
      },
    },
    "fi": {
      "choose": "Valitse",
      "labels": {
        "producer": "Tuottaja",
        "data": "Aineisto | Aineistoa",
        "scale": "Mittakaava",
        "year": "Vuosi",
        "format": "Formaatti",
      },
      "toasts": {
        "failed": {
          "title": "Aineiston lataaminen epäonnistui",
          "message": "Tuntematon aineisto tunnisteella '{id}'",
        },
      },
    },
  }
</i18n>

<style scoped>

c-select {
  padding-top: 0.75rem;
  --c-select-active-color: white;
  --c-select-background-color: var(--c-primary-800);
  --c-select-inactive-color: white;
  --c-select-option-background-color: white;
  --c-select-option-background-color-hover: white;
  --c-select-option-text-color: white;
  --c-select-text-color: white;
  --c-select-placeholder-color: var(--c-tertiary-300);
}

.controls {
  display: flex;
  flex-direction: column;
}

div {
  margin-bottom: .5em;
}

</style>
