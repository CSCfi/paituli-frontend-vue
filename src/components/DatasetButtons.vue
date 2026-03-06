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

const { addToast } = useToasts()
const { t } = useI18n()

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
  <div>
    <div>
      <div v-if="parsedMetadata">
        <InfoModal :meta="parsedMetadata" ref="infoModal" />
      </div>
      <c-button :disabled="!parsedMetadata" outlined @click="infoModal?.open()">
        {{ t("info") }}
        <c-icon :path="mdiInformationVariantCircleOutline"></c-icon>
      </c-button>
      <c-button outlined @click="servicesModal.open('FileTransferTab')">
        {{ t("apis") }}
        <c-icon :path="mdiCloudDownloadOutline"></c-icon>
      </c-button>
      <ServicesModal ref="servicesModal"/>
      <c-button @click="() => {}">
        {{ t("download") }}
        <c-icon :path="mdiDownload"></c-icon>
      </c-button>
    </div>
  </div>

</template>

<i18n>
{
  "en": {
    "info": "Dataset description",
    "apis": "Dataset APIs",
    "download": "Downloads",
    "metafail": "Failed to load dataset metadata. If the problem persists, please try again later.",
  },
  "fi": {
    "info": "Tietoa aineistosta",
    "apis": "Aineiston rajapinnat",
    "download": "Lataukset",
    "metafail": "Aineiston metatietojen lataaminen epäonnistui. Jos ongelma toistuu, yritä uudelleen myöhemmin.",
  },
}
</i18n>

<style scoped>

c-button {
  width: 100%;
  margin-bottom: .5em;

  --c-button-outlined-text-color: var(--c-primary-200);

  --c-button-outlined-disabled-text-color: var(--c-tertiary-600);
  --c-button-outlined-disabled-background-color: var(--c-tertiary-500);
}


</style>
