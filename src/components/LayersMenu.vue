<script setup lang="ts">
import { showLayer } from '@/modules/controls';
import { dataHidden, dataSource, indexSource } from '@/modules/layers';
import { watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { mdiHelpCircle } from '@mdi/js'

const { t } = useI18n()

// Update data layer switch state when changing datasets
watch(dataSource, (newSource) => {
  showLayer.data.value = !!newSource
}, { immediate: true })

</script>

<template>
  <h3>{{ t("heading") }}</h3>
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
            :disabled="dataSource == null || dataHidden"
            v-control>
    <span>
      {{ t("data") }}
      <c-icon
        v-if="dataHidden"
        :path="mdiHelpCircle"
        v-tooltip="t('datahidden')"
        size="20px" />
    </span>
  </c-switch>
</template>

<i18n>
{
  "en": {
    "heading": "Layers",
    "background": "Background map",
    "muncipalities": "Muncipalities",
    "catchment": "Catchment areas",
    "index": "Mapsheets",
    "data": "Data layer",
    "datahidden": "To adjust data layer visibility, zoom in until you see the data layer",
  },
  "fi": {
    "heading": "Karttatasot",
    "background": "Taustakartta",
    "muncipalities": "Kuntarajat",
    "catchment": "Valuma-alueet",
    "index": "Karttalehdet",
    "data": "Aineisto",
    "datahidden": "Säätääksesi tätä karttatasoa, zoomaa sisään kunnes näet datan esikatselun.",
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
  padding-top: .3em;
  width: 100%;
}
h3 {
  margin-top: 0;
  margin-bottom: .5em;
  text-align: center;
}
span {
  display: inline-flex;
  align-items: center;
  gap: .5em;
}
</style>
