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

  addToast({
    type: CToastType.Info,
    title: t('toasts.loaded.title'),
    message: t('toasts.loaded.message', { id: dataset.data_id }),
    duration: 5000,
  })
})


</script>

<template>
  <c-toasts
    ref="toasts"
    horizontal="center"
    vertical="center"
  />

  <div class="controls">
    <label>
      <span>{{ t("labels.producer") }}</span>
      <select v-model="selectedProducer" :disabled="producerOptions.length <= 1">
        <option v-for="producer in producerOptions" :key="producer" :value="producer">
          {{ producer }}
        </option>
      </select>
    </label>

    <label>
      <span>{{ t("labels.data") }}</span>
      <select v-model="selectedData" :disabled="dataOptions.length <= 1">
        <option v-for="data in dataOptions" :key="data" :value="data">
          {{ data }}
        </option>
      </select>
    </label>

    <label>
      <span>{{ t("labels.scale") }}</span>
      <select v-model="selectedScale" :disabled="scaleOptions.length <= 1" >
        <option v-for="scale in scaleOptions" :key="scale" :value="scale" >
          {{ scale }}
        </option>
      </select>
    </label>

    <label>
      <span>{{ t("labels.year") }}</span>
      <select v-model="selectedYear" :disabled="yearOptions.length <= 1" >
        <option v-for="year in yearOptions" :key="year" :value="year">
          {{ year }}
        </option>
      </select>
    </label>

    <label>
      <span>{{ t("labels.format") }}</span>
      <select v-model="selectedFormat" :disabled="formatOptions.length <= 1" >
        <option v-for="format in formatOptions" :key="format" :value="format" >
          {{ format }}
        </option>
      </select>
    </label>
  </div>

</template>

<i18n>
  {
    "en": {
      "labels": {
        "producer": "Producer",
        "data": "Dataset",
        "scale": "Scale",
        "year": "Year",
        "format": "Format",
      },
      "toasts": {
        "loaded": {
          "title": "Dataset loaded",
          "message": "Loaded dataset {id}",
        },
        "failed": {
          "title": "Could not load dataset",
          "message": "Unknown dataset by id {id}",
        },
      },
    },
    "fi": {
      "labels": {
        "producer": "Tuottaja",
        "data": "Aineisto",
        "scale": "Mittakaava",
        "year": "Vuosi",
        "format": "Formaatti",
      },
      "toasts": {
        "loaded": {
          "title": "Aineisto ladattu",
          "message": "Aineisto {id} ladattu",
        },
        "failed": {
          "title": "Aineiston lataaminen epäonnistui",
          "message": "Tuntematon aineisto tunnisteella {id}",
        },
      },
    },
  }
</i18n>

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
    width: 90px;
  }
}
</style>
