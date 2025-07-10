<script setup lang="ts">
import { ref } from 'vue'
import MapItem from '@/components/MapItem.vue'
import LocationSearchField from '@/components/LocationSearchField.vue'

import { APP_SETTINGS } from '@/shared/constants'
import DatasetSelect from '@/components/DatasetSelect.vue'
import DownloadTab from '@/components/DownloadTab.vue'

// Define shared map center and zoom control
const mapCenter = ref<[number, number]>(APP_SETTINGS.MAP_DEFAULT_CENTER)
const mapZoom = ref<number>(APP_SETTINGS.MAP_DEFAULT_ZOOM)
</script>

<template>
  <div class="wrapper">
    <c-side-navigation>
      <LocationSearchField v-model:center="mapCenter" v-model:zoom="mapZoom" />
      <c-side-navigation-title>Dataset</c-side-navigation-title>
      <DatasetSelect />
      <c-side-navigation-title>Downloads</c-side-navigation-title>
      <DownloadTab />
    </c-side-navigation>
    <MapItem v-model:center="mapCenter" v-model:zoom="mapZoom" />
  </div>
</template>

<style scoped>
c-side-navigation {
  padding-right: 25px;
}

.wrapper {
  display: flex;
  gap: 24px;
  position: fixed;
  left: 0;
  width: 100%;
  height: calc(100vh - var(--site-header-height));
  /* Note: The bg color is here mainly because c-side-navigation padding doesn't work as expected */
  background-color: var(--c-primary-600);
}
</style>
