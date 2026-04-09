<script setup lang="ts">
import { mdiFileDownloadOutline, mdiOpenInNew } from '@mdi/js';
import { currentDataset } from '@/modules/datasets';
import { URLS } from '@/shared/constants';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import type { MetadataParse } from '@/shared/types';
import { copyToClipboard } from '@/shared/util';

const { t } = useI18n()

const props = defineProps<{ meta: MetadataParse }>()

const showModal = ref(false)
const open = () => {
  showModal.value = true
}

const etsinLink = computed(() =>
  URLS.ETSIN_METADATA_BASE + currentDataset.value?.meta)

defineExpose({ open })
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

        <div id="meta">
          <div v-html="props.meta.description"></div>
          <div v-if="props.meta.links.length">
            <strong>{{ t("files") }}:</strong>
            <ul class="metadata-links">
              <li v-for="link in props.meta.links" :key="link.url">
                <c-link :href="link.url" target="_blank">{{ link.title }}</c-link>
              </li>
            </ul>
          </div>
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
    "gpkg": {
      "download": "Download index map as GeoPackage",
      "info": "The geopackage contains names, paths and geometry of map sheets.",
    },
  },
  "fi": {
    "title": "Aineiston metatiedot",
    "files": "Aineistoa kuvaavat tiedostot",
    "metadata": "Kaikki metatiedot saatavilla Fairdata Etsimessä",
    "close": "Sulje",
    "copy": "Kopioi",
    "gpkg": {
      "download": "Lataa indeksikartta GeoPackage -muodossa",
      "info": "Geopackage sisältää karttalehtien nimet, polut sekä geometrian.",
    },
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
