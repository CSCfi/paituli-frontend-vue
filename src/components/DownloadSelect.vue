<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useDatasets } from '@/composables/datasets'
import { useControls } from '@/composables/controls'
import { mdiDownload } from '@mdi/js'
import DownloadModal from './modals/DownloadModal.vue'
import { APP_SETTINGS } from '@/shared/constants'
import { useI18n } from 'vue-i18n'

const { selectedFeaturesArray, selectedOlFeatures } = useControls()
const { currentDataset } = useDatasets()
const { t } = useI18n()

const licenseChecked = ref(true)
const licenseUrl = computed(() => currentDataset.value?.license_url)

const filePaths = computed(() => {
  const paths: string[] = selectedFeaturesArray.value
    .filter((f) => checkboxStates.value[f.get('label')])
    .map((f) => f.get('path'));
  if (licenseUrl.value && licenseChecked.value) {
    paths.push(cutLicenseURL(licenseUrl.value))
  }
  return paths;
})

function cutLicenseURL(url: string): string {
  if (!url) return ''
  return url.split('geodata/')[1] || url
}

const fileLabels = computed(() => {
  const labels: string[] = selectedFeaturesArray.value
    .filter((f) => checkboxStates.value[f.get('label')])
    .map((f) => f.get('label'))
  if (licenseUrl.value && licenseChecked.value) {
    labels.push(licenseUrl.value)
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
      newStates[f.get('label')] =
        checkboxStates.value[f.get('label')] === false ? false : true
    })
    checkboxStates.value = newStates
  },
  { deep: true },
)

// Reset base feature selection when the dataset changes
watch(currentDataset, () => {
  selectedOlFeatures.clear()
})

const downloadSize = computed(() => {
  const fileSize = currentDataset.value?.file_size
  if (!fileSize) return 0
  // License is exluded from the file count
  const fileCount = filePaths.value.length;
  return Math.ceil(fileSize * (licenseChecked.value ? fileCount-1 : fileCount))
})

const downloadButtonDisabled = computed(() => {
  // The download button is disabled if the mapsheet selection is empty,
  // or if we have selected only the license
  return (filePaths.value.length == 1 && licenseChecked.value)
    || filePaths.value.length == 0
})

const downloadSizeExceeded = computed(() => {
  return downloadSize.value > APP_SETTINGS.MAX_ZIP_SIZE
})

// Exposed download modal control
const modalRef = ref()
function openDownloadModal() {
  modalRef.value.open(
    filePaths.value,
    fileLabels.value,
    downloadSize.value,
  )
}
</script>

<template>
  <div class="download-panel">
    <c-button :disabled="downloadButtonDisabled" @click="openDownloadModal()">
      <c-icon :path="mdiDownload" />
      {{ t("size", { size: downloadSize }) }}
    </c-button>
    <div class="download-size-warning" v-if="downloadSizeExceeded">
      {{ t("warning", { size: APP_SETTINGS.MAX_ZIP_SIZE }) }}
    </div>

    <div class="columns">
      <div class="documents" v-if="licenseUrl">
        <p>{{ t("documents") }}</p>
        <label>
          <input type="checkbox" v-model="licenseChecked" />
          <a :href="licenseUrl" target="_blank">{{ t("license") }}</a>
        </label>
      </div>

      <div class="files" v-if="selectedFeaturesArray.length">
        <p>{{ t("files") }}</p>
        <div
          v-for="feature in selectedFeaturesArray"
          :key="feature.getId()"
          class="file-item"
        >
          <label>
            <input
              type="checkbox"
              v-model="checkboxStates[feature.get('label')]"
            />
            {{ feature.get('label') }}
          </label>
        </div>
      </div>
    </div>
  </div>

  <DownloadModal ref="modalRef" />
</template>

<i18n>
{
  "en": {
    "size": "Download ({size} MB)",
    "warning": "Note: You have selected over {size} MB of data, which is over the limit of compressed archive download.",
    "documents": "Documents",
    "files": "Files",
    "license": "License",
  },
  "fi": {
    "size": "Lataa ({size} MB)",
    "warning": "Huom: Olet valinnut yli {size} MB dataa, mikä ylittää pakatun arkistolatauksen kokorajan.",
    "documents": "Asiakirjat",
    "files": "Tiedostot",
    "license": "Lisenssi",
  },
}
</i18n>

<style scoped>
.download-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.download-size-warning {
  color: var(--c-warning-400);
}
.columns {
  display: flex;
  gap: 20px;
}

.documents,
.files {
  flex: 1;
  color: white;
}

a {
  color: var(--c-secondary-300);
}

.file-item {
  display: flex;
  align-items: center;
}
</style>
