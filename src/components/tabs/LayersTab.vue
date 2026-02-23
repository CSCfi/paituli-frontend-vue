<script setup lang="ts">
import { showLayer } from '@/modules/controls';
import { dataSource, indexSource } from '@/modules/layers';
import { useI18n } from 'vue-i18n';

const { t } = useI18n()

</script>

<template>
  <p><strong>{{ t("show") }}...</strong></p>
  <c-switch v-model="showLayer.background.value" v-control>
    {{ t("background") }}
  </c-switch>
  <c-switch v-model="showLayer.muncipalities.value" v-control>
    {{ t("muncipalities") }}
  </c-switch>
  <c-switch v-model="showLayer.catchment.value" v-control>
    {{ t("catchment") }}
  </c-switch>
  <c-switch v-model="showLayer.index.value" :disabled="!indexSource" v-control>
    {{ t("index") }}
  </c-switch>
  <c-switch v-model="showLayer.data.value"
            :disabled="dataSource == null"
            :checked="dataSource != null"
            v-control>
    {{ t("data") }}
  </c-switch>
</template>

<i18n>
{
  "en": {
    "show": "Show",
    "background": "Background map",
    "muncipalities": "Muncipalities",
    "catchment": "Catchment areas",
    "index": "Mapsheets",
    "data": "Data layer",
  },
  "fi": {
    "show": "Näytä",
    "background": "Taustakartta",
    "muncipalities": "Kuntarajat",
    "catchment": "Valuma-alueet",
    "index": "Karttalehdet",
    "data": "Datakerros",
  },
}
</i18n>

<style scoped>
c-switch {
  --c-switch-border-color: var(--c-primary-400);
  --c-switch-handle-color: var(--c-primary-200);
  --c-switch-slider-color: var(--c-primary-700);
  --c-switch-border-color-active: var(--c-primary-100);
  --c-switch-handle-color-active: var(--c-primary-100);
  --c-switch-slider-color-active: var(--c-secondary-500);
  --c-switch-slider-color-disabled: var(--c-primary-700);
  --c-switch-border-color-disabled: var(--c-primary-600);
  padding-top: 5px;
  width: 100%;
}
</style>
