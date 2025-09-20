<script setup lang="ts">
import { ref, computed, watchEffect, watch } from 'vue'
import { useDatasets } from '@/composables/datasets'

import InfoTab from '@/components/tabs/InfoTab.vue'
import InfoModal from './modals/InfoModal.vue'
import ServicesTab from '@/components/tabs/ServicesTab.vue'
import type { Dataset } from '@/shared/types'
import { URLS } from '@/shared/constants'
import SettingsTab from './tabs/SettingsTab.vue'
import { type MetadataParse, parseMetadata } from '@/shared/util'

const { datasets, setCurrent, clearCurrent, currentDataset } = useDatasets()

// Dropdown selections
const selectedProducer = ref<string>('')
const selectedData = ref<string>('')
const selectedScale = ref<string>('')
const selectedYear = ref<string>('')
const selectedFormat = ref<string>('')

// Parsed dataset metadata
const parsedMetadata = ref<MetadataParse | null>(null);

// Modals and tab selection
type MenuTab = 'infotab' | 'servicestab' | 'settingstab'
const tab = ref<MenuTab>('infotab')
const infoModal = ref();

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

</script>

<template>
  <div class="controls">
    <label>
      Producer:
      <select v-model="selectedProducer" :disabled="producerOptions.length <= 1">
        <option v-for="producer in producerOptions" :key="producer" :value="producer">
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

    <label>
      Scale:
      <select v-model="selectedScale" :disabled="scaleOptions.length <= 1" >
        <option v-for="scale in scaleOptions" :key="scale" :value="scale" >
          {{ scale }}
        </option>
      </select>
    </label>

    <label>
      Year:
      <select v-model="selectedYear" :disabled="yearOptions.length <= 1" >
        <option v-for="year in yearOptions" :key="year" :value="year">
          {{ year }}
        </option>
      </select>
    </label>

    <label>
      Format:
      <select v-model="selectedFormat" :disabled="formatOptions.length <= 1" >
        <option v-for="format in formatOptions" :key="format" :value="format" >
          {{ format }}
        </option>
      </select>
    </label>

    <div v-if="!currentDataset" class="suggestion">
      <p>Please select a Producer to start browsing available datasets.</p>
    </div>
    <div v-else class="extra">
      <c-tabs v-model="tab" v-control>
        <c-tab value="infotab">Info</c-tab>
        <c-tab value="servicestab">Services</c-tab>
        <c-tab value="settingstab">Settings</c-tab>

        <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
        <c-tab-items slot="items">
          <c-tab-item value="infotab" class="faded">
            <InfoTab :desc="parsedMetadata?.description" />
          </c-tab-item>
          <div v-if="parsedMetadata">
            <InfoModal :desc="parsedMetadata.description"
                       :links="parsedMetadata.links"
                       ref="infoModal" />
            <c-button outlined class="read-more" @click="infoModal?.open()">
              Read more
            </c-button>
          </div>
          <c-tab-item value="servicestab">
            <ServicesTab />
          </c-tab-item>
          <c-tab-item value="settingstab">
            <SettingsTab />
          </c-tab-item>
        </c-tab-items>
      </c-tabs>
    </div>
  </div>
</template>

<style scoped>
.controls {
  display: flex;
  flex-direction: column;
}
label {
  display: flex;
  flex-direction: column;
  color: white;
  padding-top: 0.3rem;
}
c-tabs {
  --c-tab-background-color-hover: var(--c-primary-400);
  --c-tab-text-color: white;
  --c-tabs-indicator-color: var(--c-primary-100);
}
c-tab-item {
  height: 270px;
  color: var(--c-primary-200);
}
.faded {
  mask-image: linear-gradient(to bottom, black 50%, transparent 100%);
  -webkit-mask-image: linear-gradient(to bottom, black 50%, transparent 100%);
}
.suggestion {
  margin: 5px;
  color: yellow;
}

.read-more {
  position: absolute;
  bottom: 0;
  right: 0;
  color: white;
  z-index: 1;
}
</style>
