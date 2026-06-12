<script setup lang="ts">
import MapItem from '@/components/download/map/MapItem.vue'

import DatasetSelect from '@/components/download/DatasetSelect.vue'
import DatasetButtons from '@/components/download/DatasetButtons.vue'
import DownloadSelect from '@/components/download/DownloadSelect.vue'

import { useRoute } from 'vue-router'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { currentDataset, datasets } from '@/modules/datasets'
import { menuMode } from '@/modules/controls'
import { CAlertType } from '@cscfi/csc-ui'
import { mdiBackburger, mdiForwardburger } from '@mdi/js'
import { useCompactness } from '@/composables/compactness'
import { vTooltip } from '@/directives/tooltip'

const { t } = useI18n()

const route = useRoute()
const dataset_id = computed(() => route.query.data_id as string | undefined)

const sidebarRef = ref<HTMLElement>()
const { width, height } = useCompactness(sidebarRef)

// Sidebar can be collapsed, mainly to give the map more room on mobile.
const sidebarOpen = ref(true)

// Below this width an open sidebar fills the screen,
// so the close button moves inside the nav instead
const inlineToggle = computed(() => width.value < 450 && sidebarOpen.value)

// The sidebar tabs its content when vertical room runs low.
const tabbed = computed(() => height.value < 770)

const toggleLabel = computed(() =>
  sidebarOpen.value ? t('sidebar.hide') : t('sidebar.show'))

</script>

<template>
  <div class="wrapper">
    <nav class="sidebar" ref="sidebarRef" v-show="sidebarOpen">
      <!-- When too narrow for the external tab, the close button lives here,
           pinned to the corner so it costs no vertical space -->
      <button
        v-if="inlineToggle"
        class="sidebar-close-inline"
        :class="{ 'in-flow': tabbed }"
        @click="sidebarOpen = false"
      >
        <c-icon :path="mdiBackburger" />
        {{ t('sidebar.showMap') }}
      </button>
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
          <DatasetButtons :showDownload="false" />
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
              <DatasetButtons :showDownload="true" />
            </div>
          </c-tab-item>
          <c-tab-item value="download">
            <DownloadSelect />
          </c-tab-item>
        </c-tab-items>
      </c-tabs>
    </nav>
    <!-- Drawer-style tab; Opens and closes the sidebar -->
    <button
      v-if="!inlineToggle"
      class="sidebar-tab"
      :class="{ closed: !sidebarOpen }"
      :aria-label="toggleLabel"
      v-tooltip="toggleLabel"
      @click="sidebarOpen = !sidebarOpen"
    >
      <c-icon :key="sidebarOpen" :path="sidebarOpen ? mdiBackburger : mdiForwardburger" />
    </button>
    <!-- MapItem contains the whole map view and its controls -->
    <MapItem/>
  </div>
</template>

<i18n>
{
  "en": {
    "suggestion": "Please select a Producer to start browsing available datasets.",
    "sidebar": {
      "show": "Show sidebar",
      "hide": "Hide sidebar",
      "showMap": "Show map",
    },
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
    "sidebar": {
      "show": "Näytä sivupalkki",
      "hide": "Piilota sivupalkki",
      "showMap": "Näytä kartta",
    },
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
  --sidebar-width: min(425px, 100vw);

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
  overflow-y: auto;
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
  position: relative;

  width: var(--sidebar-width);
  flex-shrink: 0;

  background-color: var(--c-primary-600);
  padding: 1.25em 1.75em 1.25em 1.75em;

  /* All buttons on the sidebar and inside its components */
  :deep(c-button) {

      --c-button-ghost-background-color: var(--c-info-200);
      --c-button-ghost-background-color-hover: var(--c-info-300);
      --c-button-ghost-text-color: var(--c-primary-700);

      --c-button-background-color: var(--c-info-600);
      --c-button-background-color-hover: var(--c-info-400);
      --c-button-disabled-background-color: var(--c-primary-500);
      --c-button-disabled-text-color: var(--c-tertiary-300);
  }
}

c-alert {
  display: flex;
  margin-top: 1em;
}

/* For opening and closing the sidebar */
.sidebar-tab {
  position: absolute;
  top: 50%;
  left: var(--sidebar-width);
  transform: translateY(-50%);
  z-index: 2;

  display: flex;
  align-items: center;
  width: 32px;
  height: 64px;
  border: none;
  cursor: pointer;

  color: var(--c-white);
  background-color: var(--c-primary-600);
  border-radius: 0 8px 8px 0;
  box-shadow: 4px 0 6px -2px rgba(0, 0, 0, 0.3);

  transition: left 0.2s ease, background-color 0.15s ease;
}

.sidebar-tab.closed {
  left: 0;
}

.sidebar-tab:hover {
  background-color: var(--c-primary-500);
}

/* In narrow viewports the sidebar close button is pinned
   to the top-right corner of the sidebar. */
.sidebar-close-inline {
  position: absolute;
  top: 0.5em;
  right: 0.5em;
  z-index: 1;

  display: inline-flex;
  gap: 0.25em;
  padding: 0.5em;

  border: none;
  background: none;
  cursor: pointer;
  color: var(--c-white);
  font: inherit;
}

/* In the tabbed (short) layout the menu starts at the very top, so flow the
   button into the column normally */
.sidebar-close-inline.in-flow {
  position: static;
  align-self: flex-end;
}

.sidebar-close-inline:hover {
  background-color: var(--c-primary-500);
}

</style>
