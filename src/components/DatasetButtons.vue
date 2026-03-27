<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

import InfoModal from './modals/InfoModal.vue'
import ServicesModal from '@/components/modals/ServicesModal.vue';


import { mdiCloudDownloadOutline, mdiDownload, mdiInformationVariantCircleOutline } from '@mdi/js'

import type { MetadataParse } from '@/shared/types'
import { useToasts } from '@/composables/toasts'
import { CToastType } from '@cscfi/csc-ui'
import { useI18n } from 'vue-i18n'
import { currentDataset } from '@/modules/datasets'

import { fetchEtsinMetadata } from '@/modules/etsin'
import { menuMode } from '@/modules/controls';

const { addToast } = useToasts()
const { t } = useI18n()

// In compact mode we try to save vertical space, and hide
// the downloads button as its only shown in non-compact mode
const props = defineProps<{ compact: boolean }>()

const parsedMetadata = ref<MetadataParse>();
const infoModal = ref();
const servicesModal = ref()

// Fetches and parses the metadata of the current dataset, if any
async function loadMetadata() {
  if (!currentDataset.value) return
  try {
    parsedMetadata.value = await fetchEtsinMetadata(currentDataset.value)
  } catch (err) {
    parsedMetadata.value = undefined // Undefining disables the info button
    addToast({
      type: CToastType.Warning,
      message: t('metafail')
    })
    console.error(`Failed to parse Etsin metadata: ${(err as Error).message}`)
  }
}

// When mounting or selected dataset changes, reload metadata
onMounted(async () => await loadMetadata())
watch(currentDataset, async () => await loadMetadata())

</script>

<template>
  <div id="buttons">
    <div v-if="parsedMetadata">
      <InfoModal :meta="parsedMetadata" ref="infoModal" />
    </div>
    <div :class="{ compact: props.compact }">
      <c-button
        :disabled="!parsedMetadata"
        :loading="!parsedMetadata"
        v-tooltip="t('info.tooltip')"
        outlined
        @click="infoModal?.open()">
        {{ t(props.compact ? "info.label-compact" : "info.label") }}
        <c-icon :path="mdiInformationVariantCircleOutline"></c-icon>
      </c-button>
      <c-button
        outlined
        v-tooltip="t('apis.tooltip')"
        @click="servicesModal.open('FileTransferTab')">
        {{ t(props.compact ? "apis.label-compact" : "apis.label") }}
        <c-icon :path="mdiCloudDownloadOutline"></c-icon>
      </c-button>
    </div>
    <ServicesModal ref="servicesModal"/>
    <c-button v-if="!props.compact" @click="menuMode = 'download'">
      {{ t("download") }}
      <c-icon :path="mdiDownload"></c-icon>
    </c-button>
  </div>

</template>

<i18n>
{
  "en": {
    "info": {
      "label": "Dataset metadata",
      "label-compact": "Metadata",
      "tooltip": "Metadata and documents describing this dataset",
    },
    "apis": {
      label: "Dataset APIs",
      "label-compact": "APIs",
      "tooltip": "Download data via OGC APIs, STAC or HTTP/FTP/rsync",
    },
    "download": "Downloads",
    "metafail": "Failed to load dataset metadata. If the problem persists, please contact CSC.",
  },
  "fi": {
    "info": {
      "label": "Aineiston metatiedot",
      "label-compact": "Metatiedot",
      "tooltip": "Metatiedot ja dokumentit, jotka kuvaavat aineiston",
    },
    "apis": {
      label: "Aineiston rajapinnat",
      "label-compact": "Rajapinnat",
      "tooltip": "Lataa OGC- tai STAC-rajapintojen kautta tai HTTP/FTP/rsync-yhteyksillä",
    },
    "download": "Lataukset",
    "metafail": "Aineiston metatietojen lataaminen epäonnistui. Jos ongelma toistuu, ota yhteyttä CSC:hen.",
  },
}
</i18n>

<style scoped>

c-button {
  width: 100%;
  margin-bottom: .5em;

  --c-button-outlined-background-color: var(--c-primary-700) !important;
  --c-button-outlined-text-color: var(--c-primary-200);
}

.compact {
  display: flex;
  gap: .5em;
}

</style>
