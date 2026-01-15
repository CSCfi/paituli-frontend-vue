<script setup lang="ts">
import { useControls } from '@/composables/controls'
import { useSources } from '@/composables/sources'
import { useI18n } from 'vue-i18n';

const { indexLayerSource, dataLayerSource } = useSources();
const controls = useControls();
const { t } = useI18n()

</script>

<template>
  {{ t("search") }}
  <c-switch v-model="controls.mapsheetSearch.value" v-control>
    {{ t("alt_search") }}
  </c-switch>
  <p>{{ t("show") }}...</p>
  <c-switch v-model="controls.backgroundVisible.value" v-control>
    {{ t("background") }}
  </c-switch>
  <c-switch v-model="controls.muncipalitiesVisible.value" v-control>
    {{ t("muncipalities") }}
  </c-switch>
  <c-switch v-model="controls.catchmentVisible.value" v-control>
    {{ t("catchment") }}
  </c-switch>
  <c-switch v-model="controls.indexVisible.value" :disabled="!indexLayerSource" v-control>
    {{ t("index") }}
  </c-switch>
  <c-switch v-model="controls.dataVisible.value" :disabled="!dataLayerSource" v-control>
    {{ t("data") }}
  </c-switch>
</template>

<i18n>
{
  "en": {
    "search": "Search",
    "alt_search": "Select mapsheets with result bounding box",
    "show": "Show",
    "background": "Background map",
    "muncipalities": "Muncipalities",
    "catchment": "Catchment areas",
    "index": "Index layer",
    "data": "Data layer",
  },
  "fi": {
    "search": "Haku",
    "alt_search": "Valitse karttalehtiä haun tuloksen rajoilla",
    "show": "Näytä",
    "background": "Taustakartta",
    "muncipalities": "Kuntarajat",
    "catchment": "Valuma-alueet",
    "index": "Indeksikartta",
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
p {
  margin-bottom: 0px;
}
</style>