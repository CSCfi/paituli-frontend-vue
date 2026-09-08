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

// Scale, year and format may be empty for some datasets. An empty value is
// indistinguishable from "nothing selected" to c-select, so empty fields get
// a stand-in value instead. Dataset fields are always compared in this same
// mapped space, which also lets a literal 'N/A' field share the option.
const NOT_AVAILABLE = 'N/A'
const optionValue = (value: string) => value || NOT_AVAILABLE

// A dropdown holding a single option has nothing to choose from,
// as does an empty one further down the cascade
const hasNoChoice = (options: string[]) => options.length < 2

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
const scaleToNumber = (scale: string) => {
  // Trims all whitespace and then multiplies all found numbers
  // with each other. This should make all scales sortable, such as:
  // 1:20 000, 2m x 2m, 0.5p/m2, etc.
  const numbers = scale.replace(/\s/g, '')
    .match(/\d*\.?\d+/g)?.map(Number) || [];
  return numbers.reduce((acc, n) => acc * n, 1);
}
const scaleOptions = computed(() =>
  datasets.value
    .filter((d) => d.org === selectedProducer.value)
    .filter((d) => d.name === selectedData.value)
    .map((d) => optionValue(d.scale))
    .filter(onlyDistinct)
    .sort((a, b) => scaleToNumber(a) - scaleToNumber(b)),
)
const dateToYear = (date: string) =>  {
  // Trims all whitespace and then returns the last number amongst all found numbers.
  // This returns the (last) year from strings such as `01.01.2000` or `1980-2026`.
  // Numbers in parantheses are not matched and plain years return as-is.
  return date
    .replace(/\s/g, '')
    .match(/(?<!\()\d+(?!\))/g)
    ?.map(Number)
    .at(-1);
}
const yearOptions = computed(() =>
  datasets.value
    .filter((d) => d.org === selectedProducer.value)
    .filter((d) => d.name === selectedData.value)
    .filter((d) => optionValue(d.scale) === selectedScale.value)
    .map((d) => optionValue(d.year))
    .filter(onlyDistinct)
    .sort((a, b) => (dateToYear(b) ?? 0) - (dateToYear(a) ?? 0)),
)
const formatOptions = computed(() =>
  datasets.value
    .filter((d) => d.org === selectedProducer.value)
    .filter((d) => d.name === selectedData.value)
    .filter((d) => optionValue(d.scale) === selectedScale.value)
    .filter((d) => optionValue(d.year) === selectedYear.value)
    .map((d) => optionValue(d.format))
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
    optionValue(d.scale) === selectedScale.value &&
    optionValue(d.year) === selectedYear.value &&
    optionValue(d.format) === selectedFormat.value,
  ) ?? null
  if (selectedDataset) {
    setCurrent(selectedDataset.data_id)
  }
})

// When selected dataset changes, force year to the first index
// to prevent matching years carrying over to the new selection
watch(selectedData, () => {
  selectedYear.value = yearOptions.value[0] ?? ''
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
  selectedScale.value = optionValue(dataset.scale)
  selectedYear.value = optionValue(dataset.year)
  selectedFormat.value = optionValue(dataset.format)
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

  <div class="dropdowns">
    <c-select
      v-model="selectedProducer"
      v-control
      v-dropdown-fit
      :placeholder="`${t('choose')} ${t('labels.producer')}...`"
      :label="t('labels.producer')"
      :key="producerOptions"
      hide-details>
      <c-option
        v-for="producer in producerOptions"
        :key="producer"
        v-bind="{ value: producer, name: producer }">
        <c-row align="center" justify="space-between" nowrap>
          {{ producer }}
          <c-tag flat>
            {{ datasetCount[producer] }}
          </c-tag>
        </c-row>
      </c-option>
    </c-select>

    <c-select
      v-model="selectedData"
      v-control
      v-dropdown-fit
      :placeholder="`${t('choose')} ${t('labels.data')}...`"
      :label="t('labels.data')"
      :disabled="hasNoChoice(dataOptions)"
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
      v-dropdown-fit
      :label="t('labels.scale')"
      :disabled="hasNoChoice(scaleOptions)"
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
      v-dropdown-fit
      :label="t('labels.year')"
      :disabled="hasNoChoice(yearOptions)"
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
      v-dropdown-fit
      :label="t('labels.format')"
      :disabled="hasNoChoice(formatOptions)"
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

  --c-icon-button-text-text-color: var(--c-white);
  --c-icon-button-text-background-color-hover: var(--c-primary-600);
  --c-icon-button-text-disabled-text-color: transparent;

  /* A disabled c-input colors both its label and its value text with
     --c-tertiary-500 and dims the field to 75% opacity, leaving them too
     faint to read. White carries through the dimming. */
  --c-tertiary-500: var(--c-white);
}

.controls {
  display: flex;
  flex-direction: column;
}

div {
  margin-bottom: .5em;
}

</style>
