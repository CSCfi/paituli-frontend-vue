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
  <div class="buttons">
    <c-button @click="servicesModal.open('FileTransferTab')">
      File transfer
    </c-button>
    <c-button @click="servicesModal.open('StableOGCTab')">
      OGC APIs
    </c-button>
  </div>
  <p>
    For details and help on these services,
    please refer to Paituli
    <c-link href='/webservices' target="_blank">
      documentation<c-icon :path="mdiOpenInNew" size="18" />
    </c-link>
  </p>

  <ServicesModal ref="servicesModal"/>

</template>

<style scoped>
p {
  margin: 0;
  margin-bottom: 10px;
}
.buttons {
  display: flex;
  gap: 10px;
  margin: 15px;
}
c-button {
  flex: 1;
}

</style>
