<script setup lang="ts">
import MapItem from '@/components/MapItem.vue'

import DatasetSelect from '@/components/DatasetSelect.vue'
import DatasetTabs from '@/components/DatasetTabs.vue'
import DownloadTab from '@/components/DownloadSelect.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const route = useRoute()
const dataset_id = computed(() => route.query.data_id as string | undefined)

</script>

<template>
  <div class="wrapper">
    <c-side-navigation>
      <c-side-navigation-title>{{ t("select") }}</c-side-navigation-title>
      <DatasetSelect :loadId="dataset_id"/>
      <DatasetTabs />
      <c-side-navigation-title>{{ t("downloads") }}</c-side-navigation-title>
      <DownloadTab />
    </c-side-navigation>
    <MapItem/>
  </div>
</template>

<style global>
c-side-navigation {

  c-button {
    --c-button-background-color: var(--c-info-500);
    --c-button-background-color-hover: var(--c-info-400);
    --c-button-disabled-background-color: var(--c-primary-500);
    --c-button-disabled-text-color: var(--c-tertiary-400);

    --c-button-outlined-background-color: var(--c-primary-600);
    --c-button-outlined-background-color-hover: var(--c-primary-500);
    --c-button-outlined-border-color: var(--c-primary-400);
  }
}
</style>

<i18n>
{
  "en": {
    "select": "Select data",
    "downloads": "Downloads",
  },
  "fi": {
    "select": "Valitse aineisto",
    "downloads": "Lataukset",
  }
}
</i18n>

<style scoped>
.wrapper {
  display: flex;
  position: absolute;
  top: var(--site-header-height);
  left: 0;
  width: 100%;
  height: calc(100vh - var(--site-header-height));
  background-color: var(--c-tertiary-100);
}

c-side-navigation {
  width: 550px;
  padding-right: 25px;
}

</style>
