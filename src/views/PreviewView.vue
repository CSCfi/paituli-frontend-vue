<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { CAlertType } from '@cscfi/csc-ui'
import { mdiDownloadOutline } from '@mdi/js'

import {
  currentDataset,
  datasets,
  getById,
  licensePath,
  loadMetadata,
} from '@/modules/datasets'
import DownloadModal from '@/components/download/modals/DownloadModal.vue'
import {
  buildSource,
  isPackageEntry,
  locateFile,
  rendererFor,
  resolvePath,
} from '@/modules/preview'

const { t } = useI18n()
const route = useRoute()

const dataId = computed(() => (route.query.data_id as string | undefined) ?? '')
const path = computed(() => (route.query.path as string | undefined) ?? '')

// Metadata only fills in the header, so it is tracked separately from the
// file and blocks rendering only for the glob entries below. As its own tab the
// preview starts with nothing in memory, but the same route reached in-app may
// already have the datasets loaded.
const metadataLoading = ref(!datasets.value.length)

const dataset = computed(() => dataId.value ? getById(dataId.value) : null)
const located = ref('')
const locating = ref(false)

const source = computed(() =>
  buildSource(path.value, dataset.value, located.value || undefined))
const renderer = computed(() => rendererFor(source.value))

// A glob entry has no filename until the dataset's format is known, so it waits
// for the metadata rather than briefly claiming to be unsupported.
const waiting = computed(() =>
  (metadataLoading.value && isPackageEntry(path.value)) || locating.value)

watch([path, dataset], async ([entry, current]) => {
  located.value = ''
  locating.value = false
  const file = resolvePath(entry, current)
  // Nothing to look for until the format has named an extension
  if (!isPackageEntry(entry) || isPackageEntry(file)) return
  locating.value = true
  const found = await locateFile(file)
  // A second file may have been asked for while this one was being looked up
  if (path.value !== entry) return
  located.value = found
  locating.value = false
}, { immediate: true })

const downloadRef = ref()

// Hands the index entry to the same download job the map uses, as stored and
// wildcard intact, so a `NAME.*` entry is expanded by the backend into the
// raster together with its sidecars rather than resolving to the one file we
// happened to draw. The modal reads the dataset from the shared ref rather
// than from a prop, so it is set here instead of on mount - the preview should
// not be changing what the rest of the app thinks is selected just by being
// looked at.
function openDownload() {
  if (!dataset.value) return
  currentDataset.value = dataset.value
  const paths = [path.value]
  const labels = [source.value.name]
  // The download view offers the license as a checkbox; here it's included always if any
  const license = dataset.value.license_url
  if (license) {
    paths.push(licensePath(license))
    labels.push(license)
  }
  downloadRef.value?.open(paths, labels, dataset.value.file_size)
}

onMounted(async () => {
  if (!metadataLoading.value) return
  await loadMetadata()
  metadataLoading.value = false
})
</script>

<template>
  <div class="preview">
    <header class="preview-bar">
      <!-- The same brand as the site header, which this route replaces -->
      <c-csc-logo />
      <RouterLink to="/" class="brand">
        <h2>Paituli</h2>
      </RouterLink>
      <div class="titles">
        <h4 :title="source.name">{{ source.name || t('no_file') }}</h4>
        <span v-if="dataset" class="subtitle">
          {{ dataset.name }} – {{ dataset.org }}
          <span v-if="dataset.scale" class="detail">{{ dataset.scale }}</span>
          <span v-if="dataset.year" class="detail">{{ dataset.year }}</span>
        </span>
        <span v-else-if="dataId && !metadataLoading" class="subtitle">
          {{ t('unknown_dataset', { id: dataId }) }}
        </span>
      </div>
      <!-- The download job is built from the dataset's fields, so without the
           metadata there is nothing to offer -->
      <c-button
        v-if="path && dataset"
        ghost
        @click="openDownload()">
        <c-icon :path="mdiDownloadOutline" />
        {{ t('download') }}
      </c-button>
    </header>

    <div class="preview-body">
      <c-alert v-if="!path" :type="CAlertType.Error">
        {{ t('missing_path') }}
      </c-alert>
      <c-spinner v-else-if="waiting" size="50" />
      <component v-else :is="renderer" :source="source" />
    </div>

    <DownloadModal ref="downloadRef" single-file />
  </div>
</template>

<i18n>
{
  "en": {
    "no_file": "Preview",
    "download": "Download file",
    "missing_path": "This preview link is missing a file path.",
    "unknown_dataset": "Unknown dataset '{id}'",
  },
  "fi": {
    "no_file": "Esikatselu",
    "download": "Lataa tiedosto",
    "missing_path": "Esikatselulinkistä puuttuu tiedostopolku.",
    "unknown_dataset": "Tuntematon aineisto '{id}'",
  },
}
</i18n>

<style scoped>
/* Like the download view, the preview breaks out of the centred content column
   that App.vue wraps every route in. The route hides the site header, so the
   header height it offsets itself by resolves to zero here. */
.preview {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: var(--site-header-height);
  left: 0;
  width: 100%;
  height: calc(100vh - var(--site-header-height));
  background-color: var(--c-tertiary-100);
  overflow: hidden;
}

.preview-bar {
  display: flex;
  align-items: center;
  gap: 1em;
  flex: none;

  padding: 0.75em 1.25em;
  background: var(--c-white);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
}

c-csc-logo,
.brand {
  flex: none;
  text-decoration: none;
}

.brand h2 {
  margin: 5px;
  color: var(--c-info-600);
}

.titles {
  display: flex;
  flex-direction: column;
  min-width: 0;
  margin-right: auto;

  padding-left: 0.9em;
  border-left: 1px solid var(--c-tertiary-300);
}

.titles h4 {
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.subtitle {
  color: var(--c-tertiary-800);
  font-size: 0.85em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Set off from the name and organisation, which run together as prose */
.detail {
  margin-left: 0.5em;
  padding: 0 0.4em;
  border-radius: 3px;
  background: var(--c-tertiary-200);
}

.preview-body {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1 1 0;
  min-height: 0;
  padding: 1.25em;
  overflow: hidden;
}

/* The filename matters more than the brand once room runs short */
@media (max-width: 600px) {
  c-csc-logo {
    display: none;
  }
}

/* The download button takes too much space on mobile, so it's the first
   item to hide, since we mainly support downloads on desktop. */
@media (max-width: 768px) {
  .preview-bar c-button {
    display: none;
  }
}
</style>
