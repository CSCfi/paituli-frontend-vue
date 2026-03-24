<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { mdiDownload } from '@mdi/js'
import DownloadModal from './modals/DownloadModal.vue'
import { APP_SETTINGS } from '@/shared/constants'
import { useI18n } from 'vue-i18n'
import { currentDataset } from '@/modules/datasets'
import { selectedFeaturesArray, selectedOlFeatures } from '@/modules/selection'
import { selectMode, toolbarMode } from '@/modules/controls'
import { vHelp } from '@/directives/help';

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

// Tracks selection warning which we will only show once per dataset
const showSelectWarning = ref(true)
watch(currentDataset, () => showSelectWarning.value = true)
watch(selectedFeaturesArray, () => {
  if (selectedFeaturesArray.value.length) showSelectWarning.value = false
}, { deep: true })

</script>

<template>
  <div class="download-panel">
    <c-button
      id="download"
      :disabled="downloadButtonDisabled"
      @click="openDownloadModal()">
      <c-icon :path="mdiDownload" />
      {{ t("size", { size: downloadSize }) }}
    </c-button>
    <div class="warning" v-if="downloadSizeExceeded">
      <p>{{ t("warnings.size", { size: APP_SETTINGS.MAX_ZIP_SIZE }) }}</p>
    </div>

    <div class="warning" v-if="showSelectWarning">
      <p>{{ t("warnings.select") }}</p>
      <!-- Note: The help ID points to a <help-content> in ToolBar.vue -->
      <c-button
        id="shortcut"
        outlined
        :disabled="toolbarMode == 'select'"
        @click="toolbarMode = 'select'; selectMode = 'basic'"
        v-help="'#basic-help'"
        size="small">
        {{ t("shortcut") }}
      </c-button>
    </div>
    <div v-else class="selection">
      <h4>{{ t("documents") }}</h4>
      <label>
        <input type="checkbox" v-model="licenseChecked" />
        <a :href="licenseUrl" target="_blank">{{ t("license") }}</a>
      </label>
      <div v-if="selectedFeaturesArray.length">
        <h4>{{ t("files") }}</h4>
        <div class="files"
             v-for="feature in selectedFeaturesArray"
             :key="feature.getId()">
          <label>
            <input
              type="checkbox"
              v-model="checkboxStates[feature.get('label')]" />
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
    "warnings": {
      "size": "Note: You have selected over {size} MB of data, which is over the limit of compressed archive download.",
      "select": "You must select at least one map sheet to proceed to download. You can do this by using the map view in select mode.",
    },
    "shortcut": "Change to select mode",
    "documents": "Documents",
    "files": "Files",
    "license": "License",
  },
  "fi": {
    "size": "Lataa ({size} MB)",
    "warnings": {
      "size": "Huom: Olet valinnut yli {size} MB dataa, mikä ylittää pakatun arkistolatauksen kokorajan.",
      "select": "Sinun täytyy valita vähintään yksi karttalehti jatkaaksesi lataukseen. Voit tehdä näin käyttämällä karttanäkymän valintatilaa.",
    },
    "shortcut": "Vaihda valintatilaan",
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

  flex: 1 1 0;
  min-height: 0;

}
.selection {
  overflow-y: scroll;
  overflow-x: hidden;
}
.warning {
  color: yellow;
}

c-button#download {
  margin-bottom: 1.5em;
}
c-button#shortcut {
  --c-button-outlined-text-color: var(--c-white);
  --c-button-outlined-disabled-text-color: var(--c-tertiary-500);
  --c-button-outlined-disabled-border-color: var(--c-tertiary-500);
}

h4, label {
  color: var(--c-white);

  a {
    margin-left: .25em;
    color: var(--c-accent-400);
  }
  a:hover {
    background: var(--c-accent-700);
  }
}
h4 {
  margin-bottom: .75em;
}
.warning > p,
.selection > h4:first-of-type {
  margin-top: 0;
}

.files {

  label {
    display: flex;
    align-items: center;
    width: 100%;
    cursor: pointer;
  }
  label:hover {
    background: var(--c-primary-500);
  }
}

</style>
