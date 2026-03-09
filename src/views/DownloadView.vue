<script setup lang="ts">
import MapItem from '@/components/MapItem.vue'

import DatasetSelect from '@/components/DatasetSelect.vue'
import DatasetButtons from '@/components/DatasetButtons.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { currentDataset, datasets } from '@/modules/datasets'
import DownloadSelect from '@/components/DownloadSelect.vue'
import { menuMode } from '@/modules/controls'

const { t } = useI18n()

const route = useRoute()
const dataset_id = computed(() => route.query.data_id as string | undefined)

const label = computed(() => {
  if (currentDataset.value?.name) return ` — ${currentDataset.value.name}`
  else return ''
})

</script>

<template>
  <div class="wrapper">
    <nav class="side">
      <c-tabs v-model="menuMode" v-control>
        <c-tab
          value="datasets">
          {{ t("tabs.datasets") }}</c-tab>
        <c-tab
          value="download"
          :disabled="!currentDataset">
          {{ t("tabs.download") }}
        </c-tab>
        <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
        <c-tab-items slot="items">

          <c-tab-item value="datasets">
            <div class="loading" v-if="!datasets.length">
              <h4>Loading datasets...</h4>
              <c-spinner size="50"/>
            </div>
            <div v-else>
              <DatasetSelect :loadId="dataset_id"/>
              <div v-if="!currentDataset" class="suggestion">
                <p>{{ t("suggestion") }}</p>
              </div>
              <div v-else>
                <c-side-navigation-title>{{ t("dataset") + label}}</c-side-navigation-title>
                <DatasetButtons />
              </div>
            </div>
          </c-tab-item>

          <c-tab-item value="download">
            <DownloadSelect />
          </c-tab-item>

        </c-tab-items>
      </c-tabs>
    </nav>
    <MapItem/>
  </div>
</template>

<style global>

</style>

<i18n>
{
  "en": {
    "suggestion": "Please select a Producer to start browsing available datasets.",
    "select": "Select dataset",
    "dataset": "Dataset",
    "downloads": "Downloads",
    "tabs": {
      "datasets": "Select dataset",
      "download": "Dataset download",
    },
  },
  "fi": {
    "suggestion": "Valitse yksi tuottajista selatakseksi saatavilla olevia aineistoja.",
    "select": "Valitse aineisto",
    "dataset": "Aineisto",
    "downloads": "Lataukset",
    "tabs": {
      "datasets": "Valitse aineisto",
      "download": "Aineiston lataus",
    },
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

c-tabs {
  --c-tabs-indicator-color: var(--c-white);

  --c-tab-text-color: white;
  --c-tab-background-color-hover: var(--c-primary-500);
}

.loading {
  color: var(--c-white);
  --c-spinner-color: var(--c-white);

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

nav.side {
  width: 550px;
  padding-right: 25px;

  overflow-x: hidden;
  overflow-y: scroll;

  background-color: var(--c-primary-600);
  padding: 1.25em 1.75em 1.25em 1.75em;

  /* All buttons on the sidebar and its components */
  :deep(c-button) {
      --c-button-background-color: var(--c-info-500);
      --c-button-background-color-hover: var(--c-info-400);
      --c-button-disabled-background-color: var(--c-primary-500);
      --c-button-disabled-text-color: var(--c-tertiary-400);

      --c-button-outlined-background-color: var(--c-primary-600);
      --c-button-outlined-background-color-hover: var(--c-primary-500);
      --c-button-outlined-border-color: var(--c-primary-400);
  }
}

.suggestion {
  color: yellow;
}

</style>
