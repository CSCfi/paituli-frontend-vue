<script setup lang="ts">
import { mdiFileDownloadOutline, mdiOpenInNew } from '@mdi/js';
import { currentDataset } from '@/modules/datasets';
import { URLS } from '@/shared/constants';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import type { MetadataParse } from '@/shared/types';

const { t } = useI18n()

const props = defineProps<{ meta: MetadataParse }>()

const showModal = ref(false)
const open = () => {
  showModal.value = true
}

defineExpose({ open })
</script>

<template>

  <c-modal v-model="showModal"
           v-control
           dismissable
           disable-backdrop-blur>
    <c-card>
      <c-card-title>
        {{ t("title") }}
      </c-card-title>

      <c-card-content>

        <div v-if="currentDataset?.meta">
          <c-link :href="URLS.ETSIN_METADATA_BASE + currentDataset.meta" target="_blank">
            {{ t("metadata") }}
            <c-icon :path="mdiOpenInNew" size="18" />
          </c-link>
        </div>

        <div>
          <h3>{{ currentDataset?.name }} - {{ currentDataset?.org }}</h3>
          <span id="urn-label">URN: </span>
          <span id="urn">{{ currentDataset?.meta }}</span>
        </div>
        <div id="etsin">
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
    "gpkg": {
      "download": "Download index map as GeoPackage",
      "info": "The geopackage contains names, paths and geometry of mapsheets.",
    },
  },
  "fi": {
    "title": "Aineiston metatiedot",
    "files": "Aineistoa kuvaavat tiedostot",
    "metadata": "Kaikki metatiedot saatavilla Fairdata Etsimessä",
    "close": "Sulje",
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
  max-height: 500px;
  overflow-y: auto;
}

span#urn-label {
  user-select: none;
}

span#urn {
  user-select: text;
}

[id^="urn"] {
  color: var(--c-tertiary-500);
}

</style>
