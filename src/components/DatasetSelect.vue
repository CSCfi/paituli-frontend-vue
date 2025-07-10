<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'
import { useDatasets } from '@/composables/datasets'

const { datasets, setCurrent, clearCurrent } = useDatasets()

// Dropdown selections
const selectedProducer = ref<string>('')
const selectedData = ref<string>('')
const selectedScale = ref<string>('')
const selectedYear = ref<string>('')
const selectedFormat = ref<string>('')
const selectedCoordSys = ref<string>('')

// Filter helpers
const onlyDistinct = <T,>(value: T, index: number, self: T[]) =>
  self.indexOf(value) === index
//const onlyAuthorized = (data: Dataset) => data.access === 1 || true // TODO: implement proper auth check

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
const coordSysOptions = computed(() =>
  datasets.value
    .filter((d) => d.org === selectedProducer.value)
    .filter((d) => d.name === selectedData.value)
    .filter((d) => d.scale === selectedScale.value)
    .filter((d) => d.year === selectedYear.value)
    .filter((d) => d.format === selectedFormat.value)
    .map((d) => d.coord_sys)
    .filter(onlyDistinct)
    .sort(),
)

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
  if (!coordSysOptions.value.includes(selectedCoordSys.value)) {
    selectedCoordSys.value = coordSysOptions.value[0] ?? ''
  }
  // Set the current dataset matching the updated selections
  const dataset = datasets.value.find(
    (d) =>
      d.org === selectedProducer.value &&
      d.name === selectedData.value &&
      d.scale === selectedScale.value &&
      d.year === selectedYear.value &&
      d.format === selectedFormat.value &&
      d.coord_sys === selectedCoordSys.value,
  )
  if (dataset) {
    setCurrent(dataset.data_id)
  } else {
    clearCurrent()
  }
})

type Tab = 'tab1' | 'tab2' | 'tab3'
const tab = ref<Tab>('tab1')
</script>

<template>
  <div class="dropdowns">
    <label>
      Producer:
      <select
        v-model="selectedProducer"
        :disabled="producerOptions.length <= 1"
      >
        <option
          v-for="producer in producerOptions"
          :key="producer"
          :value="producer"
        >
          {{ producer }}
        </option>
      </select>
    </label>

    <label>
      Data:
      <select v-model="selectedData" :disabled="dataOptions.length <= 1">
        <option v-for="data in dataOptions" :key="data" :value="data">
          {{ data }}
        </option>
      </select>
    </label>

    <c-tabs v-model="tab" v-control>
      <c-tab value="tab1">Info</c-tab>
      <c-tab value="tab2">Links</c-tab>
      <c-tab value="tab3">Settings</c-tab>

      <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
      <c-tab-items slot="items">
        <c-tab-item value="tab1">
          This is the content for the first tab
        </c-tab-item>

        <c-tab-item value="tab2">
          This is the content for the second tab
        </c-tab-item>

        <c-tab-item value="tab3">
          <label>
            Scale:
            <select
              v-model="selectedScale"
              :disabled="scaleOptions.length <= 1"
            >
              <option v-for="scale in scaleOptions" :key="scale" :value="scale">
                {{ scale }}
              </option>
            </select>
          </label>

          <label>
            Year:
            <select v-model="selectedYear" :disabled="yearOptions.length <= 1">
              <option v-for="year in yearOptions" :key="year" :value="year">
                {{ year }}
              </option>
            </select>
          </label>

          <label>
            Format:
            <select
              v-model="selectedFormat"
              :disabled="formatOptions.length <= 1"
            >
              <option
                v-for="format in formatOptions"
                :key="format"
                :value="format"
              >
                {{ format }}
              </option>
            </select>
          </label>

          <label>
            Coordinate System:
            <select
              v-model="selectedCoordSys"
              :disabled="coordSysOptions.length <= 1"
            >
              <option v-for="cs in coordSysOptions" :key="cs" :value="cs">
                {{ cs }}
              </option>
            </select>
          </label>
        </c-tab-item>
      </c-tab-items>
    </c-tabs>
  </div>
</template>

<style scoped>
.dropdowns {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
label {
  display: flex;
  flex-direction: column;
  color: white;
}
c-tabs {
  --c-tab-background-color-hover: var(--c-primary-400);
  --c-tab-text-color: white;
  --c-tabs-indicator-color: var(--c-primary-100);
}
</style>
