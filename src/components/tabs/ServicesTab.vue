<script setup lang="ts">
import ServicesModal from '@/components/modals/ServicesModal.vue';
import { mdiOpenInNew } from '@mdi/js';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n()

const servicesModal = ref()

</script>

<template>
  <p>
    {{ t("info") }}
  </p>
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
  <p>
    {{ t("documentation") }}
    <c-link href='/webservices' target="_blank">
      {{ t("link") }}<c-icon :path="mdiOpenInNew" size="18" />
    </c-link>
  </p>

  <ServicesModal ref="servicesModal"/>

</template>

<i18n>
{
  "en": {
    "info": "Paituli provides various alternative web services and APIs for accessing and downloading its datasets.",
    "file_transfer": "File transfer",
    "stac": "STAC",
    "apis": "OGC APIs",
    "documentation": "For details and help on these services, please refer to Paituli",
    "link": "documentation",
  },
  "fi": {
    "info": "Paituli tarjoaa erilaisia vaihtoehtoisia verkkopalveluita ja rajapintoja aineistojen selaamiseen ja lataamiseen.",
    "file_transfer": "Tiedostonsiirto",
    "stac": "STAC",
    "apis": "OGC APIt",
    "documentation": "Lisätietoja ja ohjeita näihin palveluihin löydät Paitulin",
    "link": "dokumentaatiosta",
  },
}
</i18n>

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
