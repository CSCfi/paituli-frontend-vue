<script setup lang="ts">
import ServicesModal from '@/components/modals/ServicesModal.vue';
import { ref } from 'vue';

const servicesModal = ref()

</script>

<template>
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
