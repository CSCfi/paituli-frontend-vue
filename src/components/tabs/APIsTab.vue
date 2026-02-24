<script setup lang="ts">
import ServicesModal from '@/components/modals/ServicesModal.vue';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n()

const servicesModal = ref()

</script>

<template>
  <div class="buttons">
    <c-button @click="servicesModal.open('FileTransferTab')">
      {{ t("file_transfer") }}
    </c-button>
    <c-button @click="servicesModal.open('STACTab')">
      {{ t("stac") }}
    </c-button>
    <c-button @click="servicesModal.open('StableOGCTab')">
      {{ t("apis") }}
    </c-button>
  </div>
  <p>{{ t("info") }}</p>
  <ServicesModal ref="servicesModal"/>

</template>

<i18n>
{
  "en": {
    "info": "Paituli provides various alternative web services and APIs for accessing and downloading its datasets. Use the buttons above for more information.",
    "file_transfer": "File transfer",
    "stac": "STAC",
    "apis": "OGC APIs",
  },
  "fi": {
    "info": "Paituli tarjoaa erilaisia vaihtoehtoisia verkkopalveluita ja rajapintoja aineistojen selaamiseen ja lataamiseen. Käytä painikkeita yllä saadaksesi lisätietoa.",
    "file_transfer": "Tiedostonsiirto",
    "stac": "STAC",
    "apis": "OGC APIt",
  },
}
</i18n>

<style scoped>
.buttons {
  display: flex;
  gap: .5em;
  margin: .5em;

  c-button {
    flex: 1;
  }
}

</style>
