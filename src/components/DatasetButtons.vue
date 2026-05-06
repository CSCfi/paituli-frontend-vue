<script setup lang="ts">
import { ref } from 'vue'

import InfoModal from './modals/InfoModal.vue'
import ServicesModal from '@/components/modals/ServicesModal.vue';

import { mdiCloudDownloadOutline, mdiDownload, mdiInformationVariantCircleOutline } from '@mdi/js'

import { useI18n } from 'vue-i18n'
import { menuMode } from '@/modules/controls';

const { t } = useI18n()

// We have a separate download button in tabbed mode
const props = defineProps<{ showDownload: boolean }>()

const infoModal = ref();
const servicesModal = ref()

</script>

<template>
  <div>
    <div>
      <InfoModal ref="infoModal" />
    </div>
    <div id="buttons" :class="{ padded: showDownload }">
      <c-button
        v-tooltip="t('info.tooltip')"
        outlined
        @click="infoModal?.open()">
        <c-icon :path="mdiInformationVariantCircleOutline"></c-icon>
        {{ t("info.label") }}
      </c-button>
      <c-button
        outlined
        v-tooltip="t('apis.tooltip')"
        @click="servicesModal.open('FileTransferTab')">
        <c-icon :path="mdiCloudDownloadOutline"></c-icon>
        {{ t("apis.label") }}
      </c-button>
    </div>
    <ServicesModal ref="servicesModal"/>
    <c-button
      v-if="props.showDownload"
      ghost
      @click="menuMode = 'download'">
      {{ t("download") }}
      <c-icon :path="mdiDownload"></c-icon>
    </c-button>
  </div>

</template>

<i18n>
{
  "en": {
    "info": {
      "label": "Metadata",
      "tooltip": "Metadata and documents describing this dataset",
    },
    "apis": {
      "label": "APIs",
      "tooltip": "Download data via OGC APIs, STAC or HTTP/FTP/rsync",
    },
    "download": "Downloads",
  },
  "fi": {
    "info": {
      "label": "Metatiedot",
      "tooltip": "Metatiedot ja dokumentit, jotka kuvaavat aineiston",
    },
    "apis": {
      "label": "Rajapinnat",
      "tooltip": "Lataa OGC- tai STAC-rajapintojen kautta tai HTTP/FTP/rsync-yhteyksillä",
    },
    "download": "Lataukset",
  },
}
</i18n>

<style scoped>

c-button {
  width: 100%;
  margin-bottom: .5em;


  --c-button-outlined-border-color: var(--c-primary-300);
  --c-button-outlined-background-color: var(--c-primary-700);
  --c-button-outlined-background-color-hover: var(--c-primary-500);
  --c-button-outlined-text-color: var(--c-primary-100);
}

#buttons {
  display: flex;
  gap: .5em;
}

.padded {
  padding-top: .5em;
}

</style>
