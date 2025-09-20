<script setup lang="ts">
import ServicesModal from '@/components/modals/ServicesModal.vue';
import { mdiOpenInNew } from '@mdi/js';
import { ref } from 'vue';

const servicesModal = ref()

</script>

<template>
  <p>
    Paituli provides various alternative web services and APIs for accessing and downloading its datasets.
  </p>
  <p>
    For detailed documentation on how to use these services,
    please refer to the
    <c-link href='/webservices' target="_blank">
      documentation<c-icon :path="mdiOpenInNew" size="18" />
    </c-link>
  </p>
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
