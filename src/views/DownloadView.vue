<script setup lang="ts">
import MapItem from '@/components/MapItem.vue'

import DatasetSelect from '@/components/DatasetSelect.vue'
import DatasetTabs from '@/components/DatasetTabs.vue'
import DownloadTab from '@/components/DownloadSelect.vue'

</script>

<template>
  <div class="wrapper">
    <c-side-navigation>
      <c-side-navigation-title>Select data</c-side-navigation-title>
      <DatasetSelect />
      <DatasetTabs />
      <c-side-navigation-title>Downloads</c-side-navigation-title>
      <DownloadTab />
    </c-side-navigation>
    <MapItem/>
  </div>
</template>

<style global>
c-side-navigation {
  width: 550px;

  div {
    margin-bottom: 10px;
  }
  c-button {
    --c-button-background-color: var(--c-info-500);
    --c-button-background-color-hover: var(--c-info-400);
    --c-button-disabled-background-color: var(--c-primary-500);
    --c-button-disabled-text-color: var(--c-tertiary-400);

    --c-button-outlined-background-color: var(--c-primary-600);
    --c-button-outlined-background-color-hover: var(--c-primary-500);
    --c-button-outlined-border-color: var(--c-primary-400);
  }
  p {
    margin-top: 10px;
    margin-bottom: 10px;
  }
  c-link {
    --c-link-color: var(--c-white);
    --c-link-hover: var(--c-secondary-400);
    c-icon {
      color: var(--c-white);
    }
  }
}
</style>

<style scoped>
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
