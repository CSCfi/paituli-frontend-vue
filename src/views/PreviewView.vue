<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { CAlertType } from '@cscfi/csc-ui'
import { mdiDownloadOutline } from '@mdi/js'

import AppLink from '@/components/common/AppLink.vue'
import { datasets, fetchMetadata, getById } from '@/modules/datasets'
import { buildSource, needsDataset, rendererFor } from '@/modules/preview'

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
const source = computed(() => buildSource(path.value, dataset.value))
const renderer = computed(() => rendererFor(source.value))

// A glob entry has no filename until the dataset's format is known, so it waits
// for the metadata rather than briefly claiming to be unsupported.
const waiting = computed(() => metadataLoading.value && needsDataset(path.value))

onMounted(async () => {
  if (!metadataLoading.value) return
  try {
    await fetchMetadata()
  } catch (error) {
    console.warn('Preview could not fetch dataset metadata:', error)
  }
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
        </span>
        <span v-else-if="dataId && !metadataLoading" class="subtitle">
          {{ t('unknown_dataset', { id: dataId }) }}
        </span>
      </div>
      <!-- Hidden while a glob entry has no concrete file, since the archive
           URL would still carry the wildcard -->
      <AppLink
        v-if="path && !needsDataset(source.file)"
        :to="source.url"
        new-tab
        :c-button="{ ghost: true }">
        <c-icon :path="mdiDownloadOutline" />
        {{ t('original') }}
      </AppLink>
    </header>

    <div class="preview-body">
      <c-alert v-if="!path" :type="CAlertType.Error">
        {{ t('missing_path') }}
      </c-alert>
      <c-spinner v-else-if="waiting" size="50" />
      <component v-else :is="renderer" :source="source" />
    </div>
  </div>
</template>

<i18n>
{
  "en": {
    "no_file": "Preview",
    "original": "Original file",
    "missing_path": "This preview link is missing a file path.",
    "unknown_dataset": "Unknown dataset '{id}'",
  },
  "fi": {
    "no_file": "Esikatselu",
    "original": "Alkuperäinen tiedosto",
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
</style>
