<script setup lang="ts">
import MapItem from '@/components/MapItem.vue'

import DatasetSelect from '@/components/DatasetSelect.vue'
import DatasetButtons from '@/components/DatasetButtons.vue'
import { useRoute } from 'vue-router'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { currentDataset, datasets } from '@/modules/datasets'
import DownloadSelect from '@/components/DownloadSelect.vue'
import { menuMode } from '@/modules/controls'
import { CAlertType } from '@cscfi/csc-ui'

const { t } = useI18n()

const route = useRoute()
const dataset_id = computed(() => route.query.data_id as string | undefined)

// We observe the sidebar height and enter `tabbed` state if
// the height gets too small.
const sidebarHeight = ref(0)
const tabbed = computed(() => sidebarHeight.value < 800)
const sidebarRef = ref<HTMLElement>()
onMounted(() => {
  const observer = new ResizeObserver(entries => {
    sidebarHeight.value = entries[0].contentRect.height
  })
  observer.observe(sidebarRef.value!)
})


</script>

<template>
  <div class="wrapper">
    <nav class="sidebar" ref="sidebarRef">
      <div v-if="!datasets.length" class="loading">
        <h4>Loading datasets...</h4>
        <c-spinner size="50"/>
      </div>
      <!-- Side menu tries to display everything at once by default -->
      <div v-else-if="!tabbed" class="grow">
        <c-side-navigation-title>{{ t("titles.select") }}</c-side-navigation-title>
        <DatasetSelect :loadId="dataset_id"/>
        <c-alert
          v-if="!currentDataset"
          :type="CAlertType.Info">
          {{ t("suggestion") }}
        </c-alert>
        <div v-else class="grow">
          <c-side-navigation-title>{{ t("titles.dataset") }}</c-side-navigation-title>
          <DatasetButtons :compact="true" />
          <DownloadSelect />
        </div>
      </div>
      <!-- Side menu tabs itself if vertical space gets too low -->
      <c-tabs v-else v-model="menuMode" v-control>
        <c-tab
          value="datasets">
          {{ t("tabs.datasets") }}
        </c-tab>
        <c-tab
          value="download"
          :disabled="!currentDataset">
          {{ t("tabs.download") }}
        </c-tab>
        <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
        <c-tab-items slot="items">
          <c-tab-item value="datasets">
            <DatasetSelect :loadId="dataset_id"/>
            <c-alert
              v-if="!currentDataset"
              :type="CAlertType.Info">
              {{ t("suggestion") }}
            </c-alert>
            <div v-else>
              <c-side-navigation-title>{{ t("titles.dataset") }}</c-side-navigation-title>
              <DatasetButtons :compact="false" />
            </div>
          </c-tab-item>
          <c-tab-item value="download">
            <DownloadSelect />
          </c-tab-item>
        </c-tab-items>
      </c-tabs>
    </nav>
    <!-- MapItem contains the whole map view and its controls -->
    <MapItem/>
  </div>
</template>

<i18n>
{
  "en": {
    "suggestion": "Please select a Producer to start browsing available datasets.",
    "titles": {
      "select": "Select dataset",
      "dataset": "Dataset information and download",
      "downloads": "Downloads",
    },
    "tabs": {
      "datasets": "Select dataset",
      "download": "Dataset download",
    },
  },
  "fi": {
    "suggestion": "Valitse yksi tuottajista selatakseksi saatavilla olevia aineistoja.",
    "titles": {
      "select": "Valitse aineisto",
      "dataset": "Aineiston tiedot ja lataus",
      "downloads": "Lataukset",
    },
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
  overflow: hidden;
}

.grow {
  display: flex;
  flex-direction: column;
  flex: 1;
}

c-tabs {
  --c-tabs-indicator-color: var(--c-white);

  --c-tab-text-color: white;
  --c-tab-background-color-hover: var(--c-primary-500);
  /*
  Some attempt was made to make the download tab
  scroll in a similar manner to the untabbed DownloadSelect,
  but it seems like the shadow root of c-tabs makes it
  impossible, so we make the whole thing scroll
  */
  overflow-x: hidden;
  overflow-y: scroll;
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

nav.sidebar {
  display: flex;
  flex-direction: column;

  width: 425px;
  flex-shrink: 0;

  background-color: var(--c-primary-600);
  padding: 1.25em 1.75em 1.25em 1.75em;

  /* All buttons on the sidebar and inside its components */
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

c-alert {
  display: flex;
  margin-top: 1em;
}

</style>
