<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useDatasets } from '@/composables/datasets'
import { useControls } from '@/composables/controls'
import { mdiDownload } from '@mdi/js'
import DownloadModal from './DownloadModal.vue'

const { selectedFeaturesArray } = useControls()
const { currentDataset } = useDatasets()

const MAX_DOWNLOADABLE_SIZE = 3000

const licenseChecked = ref(true)
const licenseUrl = computed(() => currentDataset.value?.license_url)

const filePaths = computed(() => {
  return selectedFeaturesArray.value
    .filter((f) => checkboxStates.value[f.get('label')])
    .map((f) => f.get('path'))
})

const fileLabels = computed(() => {
  const labels: string[] = selectedFeaturesArray.value
    .filter((f) => checkboxStates.value[f.get('label')])
    .map((f) => f.get('label'))
  if (licenseUrl.value && licenseChecked.value) {
    labels.push(cutLicenseURL(licenseUrl.value))
  }
  return labels
})

const checkboxStates = ref<Record<string, boolean>>({})
watch(
  selectedFeaturesArray,
  (features) => {
    // Update checkbox states when feature selection changes
    const newStates: Record<string, boolean> = {}
    features.forEach((f) => {
      newStates[f.get('label')] = checkboxStates.value[f.get('label')] === false ? false : true
    })
    checkboxStates.value = newStates
  },
  { deep: true },
)

const downloadSize = computed(() => {
  const fileSize = currentDataset.value?.file_size
  return fileSize ? Math.ceil(fileSize * filePaths.value.length) : 0
})

const canDownload = computed(() => {
  return filePaths.value.length > 0 && downloadSize.value <= MAX_DOWNLOADABLE_SIZE
})

function cutLicenseURL(url: string) {
  if (!url) return ''
  return url.split('geodata/')[1] || url
}

// Exposed download modal control
const modalRef = ref()
function openDownloadModal(zipped: boolean) {
  modalRef.value.open(filePaths.value, fileLabels.value, 123, zipped ? 'ZIP' : 'LIST')
}
</script>

<template>
  <div class="download-panel">
    <c-button :disabled="!canDownload" @click="openDownloadModal(false)">
      <c-icon :path="mdiDownload" />
      Download ({{ downloadSize }} MB)
    </c-button>

    <div class="columns">
      <div class="documents" v-if="licenseUrl">
        <h4>Documents</h4>
        <label>
          <input type="checkbox" v-model="licenseChecked" />
          <a :href="licenseUrl" target="_blank">License</a>
        </label>
      </div>

      <div class="files" v-if="selectedFeaturesArray.length">
        <h4>Files</h4>
        <div v-for="feature in selectedFeaturesArray" :key="feature.getId()" class="file-item">
          <label>
            <input type="checkbox" v-model="checkboxStates[feature.get('label')]" />
            {{ feature.get('label') }}
          </label>
        </div>
      </div>
    </div>
  </div>

  <DownloadModal ref="modalRef" />
</template>

<style scoped>
.download-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.columns {
  display: flex;
  gap: 20px;
}

.documents,
.files {
  flex: 1;
}

.file-item {
  display: flex;
  align-items: center;
}
</style>
