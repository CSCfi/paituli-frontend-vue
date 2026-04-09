<script setup lang="ts">
import { mdiFileDownloadOutline, mdiOpenInNew } from '@mdi/js';
import { currentDataset } from '@/modules/datasets';
import { URLS } from '@/shared/constants';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { copyToClipboard } from '@/shared/util';
import type { MetadataParse } from '@/shared/types'
import { CAlertType } from '@cscfi/csc-ui'
import { fetchEtsinMetadata } from '@/modules/etsin'

const { t } = useI18n()

const showModal = ref(false)
const open = () => {
  loadMetadata()
  showModal.value = true
}

const etsinLink = computed(() =>
  URLS.ETSIN_METADATA_BASE + currentDataset.value?.meta)

defineExpose({ open })

const parsedMetadata = ref<MetadataParse>();
const parseFailed = ref(false);

// Fetches and parses the metadata of the current dataset, if any
async function loadMetadata() {
  parsedMetadata.value = undefined
  parseFailed.value = false
  if (!currentDataset.value) return
  try {
    parsedMetadata.value = await fetchEtsinMetadata(currentDataset.value)
  } catch (err) {
    parseFailed.value = true
    console.error(`Failed to parse Etsin metadata: ${(err as Error).message}`)
  }
}

</script>

<template>

  <c-modal v-model="showModal"
           v-control
           dismissable
           width=750
           disable-backdrop-blur>
    <c-card>
      <c-card-title>
        {{ t("title") }}
      </c-card-title>

      <c-card-content>
        <h3>{{ currentDataset?.name }} - {{ currentDataset?.org }}</h3>
        <div id="etsin">
          {{ t("metadata") }}:
          <div id="link" v-if="currentDataset?.meta">
            <c-link :href="etsinLink" target="_blank">
              {{ etsinLink }}
              <c-icon :path="mdiOpenInNew" size="18" />
            </c-link>
            <c-button
              outlined
              @click="copyToClipboard(etsinLink)"
              size="small">
              {{ t('copy') }}
            </c-button>
          </div>
        </div>

        <div v-if="parseFailed">
          <c-alert :type="CAlertType.Warning">
            {{ t('metafail') }}
          </c-alert>
        </div>
        <div v-else-if="parsedMetadata" id="meta">
          <div v-html="parsedMetadata.description"></div>
          <div v-if="parsedMetadata.links.length">
            <strong>{{ t("files") }}:</strong>
            <ul class="metadata-links">
              <li v-for="link in parsedMetadata.links" :key="link.url">
                <c-link :href="link.url" target="_blank">{{ link.title }}</c-link>
              </li>
            </ul>
          </div>
        </div>
        <div v-else>
          <c-loader>{{ t('loading') }}...</c-loader>
        </div>

        <p v-if="currentDataset?.data_id">
          <c-link :href="URLS.GEOPACKAGE_BASE.replace('!id!', currentDataset.data_id)">
            <c-icon :path="mdiFileDownloadOutline" />{{ t('gpkg.download') }}
          </c-link>
          <br>{{ t('gpkg.info') }}
        </p>

      </c-card-content>

      <c-card-actions justify="end">
        <c-button @click="showModal = false">
          {{ t("close") }}
        </c-button>
      </c-card-actions>
    </c-card>
  </c-modal>
</template>

<i18n>
{
  "en": {
    "title": "Dataset metadata",
    "files": "Files describing this dataset",
    "metadata": "All metadata available at Fairdata Etsin",
    "close": "Close",
    "copy": "Copy",
    "loading": "Fetching metadata",
    "gpkg": {
      "download": "Download index map as GeoPackage",
      "info": "The geopackage contains names, paths and geometry of map sheets.",
    },
    "metafail": "Failed to load dataset metadata. If the problem persists, please contact CSC.",
  },
  "fi": {
    "title": "Aineiston metatiedot",
    "files": "Aineistoa kuvaavat tiedostot",
    "metadata": "Kaikki metatiedot saatavilla Fairdata Etsimessä",
    "close": "Sulje",
    "copy": "Kopioi",
    "loading": "Haetaan metatietoja",
    "gpkg": {
      "download": "Lataa indeksikartta GeoPackage -muodossa",
      "info": "Geopackage sisältää karttalehtien nimet, polut sekä geometrian.",
    },
    "metafail": "Aineiston metatietojen lataaminen epäonnistui. Jos ongelma toistuu, ota yhteyttä CSC:hen.",
  },
}
</i18n>

<style scoped>

h3 {
  margin: 0;
  margin-bottom: 0.25em;
}

div#etsin {
  display: flex;
  flex-direction: column;

  div#link {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.25em;

    c-link {
      flex: 1 1 auto;
      min-width: 0;
    }

    c-button {
      flex: 0 0 auto;
    }
  }
}

div#meta {
  max-height: 500px;
  overflow-y: auto;
}

c-button {
  --c-button-outlined-background-color: var(--c-white) !important;
  --c-button-outlined-background-color-hover: var(--c-primary-200) !important;
}

</style>
