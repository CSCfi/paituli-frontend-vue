<script setup lang="ts">
import { URLS } from '@/shared/constants'
import { useDatasets } from '@/composables/datasets'
import { mdiOpenInNew } from '@mdi/js';
import ServicesModal from '@/components/modals/ServicesModal.vue';
import { ref } from 'vue';

const { currentDataset } = useDatasets()

const servicesModal = ref()

</script>

<template>
  <div v-if="currentDataset?.meta">
    <p>
      You can view more metadata on
      <c-link :href="URLS.ETSIN_METADATA_BASE + currentDataset.meta" target="_blank">
        Fairdata Etsin<c-icon :path="mdiOpenInNew" color="var(--c-primary-100)" size="18" />
      </c-link>
    </p>
  </div>

  <div>
    <c-button @click="servicesModal.open('FileTransferTab')">
      File transfer
    </c-button>
  </div>

  <div>
    <c-button @click="servicesModal.open('StableOGCTab')">
      OGC APIs
    </c-button>
  </div>

  <ServicesModal ref="servicesModal"/>

</template>

<style scoped>
p {
  margin: 0;
  margin-bottom: 10px;
}

</style>