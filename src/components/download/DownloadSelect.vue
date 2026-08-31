<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { mdiDownload, mdiEyeOutline } from '@mdi/js'
import DownloadModal from './modals/DownloadModal.vue'
import { APP_SETTINGS } from '@/shared/constants'
import { useI18n } from 'vue-i18n'
import { currentDataset } from '@/modules/datasets'
import { checkboxStates, selectedFeaturesArray, selectedOlFeatures, hoverFeature, unhoverFeature } from '@/modules/selection'
import { CAlertType } from '@cscfi/csc-ui'
import AppLink from '@/components/common/AppLink.vue'
import { previewHref, previewOffered } from '@/modules/preview'
import { vTooltip } from '@/directives/tooltip'
import { useRouter } from 'vue-router'
import type Feature from 'ol/Feature'

const { t } = useI18n()
const router = useRouter()

function previewUrl(feature: Feature) {
  const id = currentDataset.value!.data_id
  // The index path is passed through unresolved; the preview repeats the same
  // resolution once it has the dataset, so its links stay stable.
  return router.resolve(previewHref(id, feature.get('path'))).href
}

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
  // The download button is disabled if the map sheet selection is empty,
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
}, { deep: true, immediate: true })

</script>

<template>
  <div class="download-panel">
    <c-button
      id="download"
      ghost
      :disabled="downloadButtonDisabled"
      @click="openDownloadModal()">
      <c-icon :path="mdiDownload" />
      {{ t("size", { size: downloadSize }) }}
    </c-button>
    <c-alert :type="CAlertType.Warning" v-if="downloadSizeExceeded">
      <span>
        {{ t("warnings.size", { size: APP_SETTINGS.MAX_ZIP_SIZE }) }}
        <AppLink to="/files" new-tab>
          {{ t("warnings.size_link") }}
        </AppLink>
      </span>
    </c-alert>

    <c-alert :type="CAlertType.Info" v-if="showSelectWarning">
      {{ t("warnings.select") }}
    </c-alert>
    <div v-else class="selection">
      <h4>{{ t("files") }}</h4>
      <label>
        <input type="checkbox" v-model="licenseChecked" />
        <AppLink :to="licenseUrl!" new-tab>
          {{ t("license") }}
        </AppLink>
      </label>
      <div v-if="selectedFeaturesArray.length">
        <div class="files"
             v-for="feature in selectedFeaturesArray"
             :key="feature.getId()"
             @mouseenter="hoverFeature(feature)"
             @mouseleave="unhoverFeature(feature)">
          <label>
            <input
              type="checkbox"
              v-model="checkboxStates[feature.get('label')]" />
            <span class="sheet-name" :title="feature.get('label')">
              {{ feature.get('label') }}
            </span>
          </label>
          <!-- The preview is a plain link so that it opens in its own tab, and
               keeps middle-clicking and bookmarking working. -->
          <a
            v-if="currentDataset && previewOffered(feature.get('path'), currentDataset)"
            class="preview-link"
            :href="previewUrl(feature)"
            target="_blank"
            rel="noopener"
            :aria-label="t('preview')"
            v-tooltip="t('preview')">
            <c-icon :path="mdiEyeOutline" size="18" />
          </a>
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
      "size": "Downloads over {size} MB are only available through ",
      "size_link": "batch download",
      "select": "Select at least one map sheet to download data. Click 'Select map sheets' from the toolbar to start.",
    },
    "documents": "Documents",
    "files": "Files",
    "license": "License",
    "preview": "Preview file in a new tab",
  },
  "fi": {
    "size": "Lataa ({size} MB)",
    "warnings": {
      "size": "Yli {size} MB:n lataukset ovat saatavilla vain ",
      "size_link": "massalatauksena",
      "select": "Ladataksesi tiedostoja, valitse vähintään yksi karttalehti. Napsauta 'Valitse karttalehtiä' työkalupalkista aloittaaksesi.",
    },
    "documents": "Asiakirjat",
    "files": "Tiedostot",
    "license": "Käyttöehdot",
    "preview": "Esikatsele tiedostoa uudessa välilehdessä",
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
  overflow-y: auto;
  overflow-x: hidden;
}

c-button#download {
  margin-bottom: 1.5em;
}
c-button#shortcut {
  --c-button-outlined-text-color: var(--c-white);
  --c-button-outlined-disabled-text-color: var(--c-tertiary-500);
  --c-button-outlined-disabled-border-color: var(--c-tertiary-500);
}
c-alert {
  margin-bottom: 1em;
}

h4, label {
  color: var(--c-white);
  a {
    color: var(--c-accent-400);
  }
  a:hover {
    background: var(--c-accent-700);
  }
}
h4 {
  margin-bottom: .75em;
}
.selection > h4:first-of-type {
  margin-top: 0;
}

input {
  accent-color: var(--c-accent-300);
  transform: scale(1.25);
  margin-right: .5em;
}

label {
    height: 26px;
}

.files {
  display: flex;
  align-items: center;

  label {
    display: flex;
    align-items: center;
    flex: 1 1 auto;
    min-width: 0;
    cursor: pointer;
  }
  label:hover {
    background: var(--c-primary-500);
  }
  input {
    flex: none;
  }
  .sheet-name {
    flex: 1 1 auto;
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .preview-link {
    display: flex;
    flex: none;
    align-items: center;
    padding: 0 .25em;
    color: var(--c-white);
  }
  .preview-link:hover {
    color: var(--c-accent-300);
  }
}

c-link {
  --c-link-color: var(--c-white);
  --c-link-hover: var(--c-primary-400);
}

c-alert c-link {
  --c-link-color: var(--c-info-700);
  --c-link-hover: var(--c-info-200);
}

</style>
