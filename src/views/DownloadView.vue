<script setup lang="ts">
import MapItem from '@/components/MapItem.vue'

import DatasetSelect from '@/components/DatasetSelect.vue'
import DownloadTab from '@/components/DownloadTab.vue'

</script>

<template>
  <div class="wrapper">
    <c-side-navigation>
      <c-side-navigation-title>Dataset</c-side-navigation-title>
      <DatasetSelect />
      <c-side-navigation-title>Downloads</c-side-navigation-title>
      <DownloadTab />
    </c-side-navigation>
    <MapItem/>
  </div>
</template>

<style scoped>
c-side-navigation {
  padding-right: 25px;
  width: 500px;
}
.wrapper {
  display: flex;
  gap: 24px;
  position: absolute;
  top: var(--site-header-height);
  left: 0;
  width: 100%;
  height: calc(100vh - var(--site-header-height));
  /* Note: The bg color is here mainly because c-side-navigation padding doesn't work as expected */
  background-color: var(--c-primary-600);
}
</style>
