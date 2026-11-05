<script setup lang="ts">
import { mdiEarthBox, mdiLayersTripleOutline, mdiMinusBox, mdiPlusBox } from '@mdi/js'
import { useI18n } from 'vue-i18n';

import type Map from 'ol/Map.js'
import { APP_SETTINGS } from '@/shared/constants';
import { computed } from 'vue';
import MenuButton from './MenuButton.vue';
import BackgroundMenu from './BackgroundMenu.vue';
import LayersMenu from './LayersMenu.vue';
import { currentDataset } from '@/modules/datasets';
import { i18n } from '@/modules/locale';

const { t } = useI18n()

const props = defineProps<{ map: Map }>()
const mapView = computed(() => props.map.getView())

function zoom(amount: number) {
  mapView.value.animate({
    zoom: mapView.value.getZoom()! + amount,
    duration: 200,
  })
}

function resetZoom() {
  mapView.value.fit(APP_SETTINGS.MAP_DEFAULT_EXTENT, {
    padding: APP_SETTINGS.MAP_DEFAULT_PADDING,
    duration: 1000,
  })
}

// Reset zoom now to ensure nice initial zoom
resetZoom();

</script>

<template>
  <div class="column">
    <div class="zoom">
      <button
        type="button"
        @click="zoom(APP_SETTINGS.MAP_ZOOM_STEP)"
        v-tooltip="t('zoom-in')">
        <c-icon :path="mdiPlusBox" size="27px" />
      </button>
      <button
        type="button"
        @click="zoom(-APP_SETTINGS.MAP_ZOOM_STEP)"
        v-tooltip="t('zoom-out')">
        <c-icon :path="mdiMinusBox" size="27px" />
      </button>
    </div>
    <div class="map-reset">
      <button
        type="button"
        @click="resetZoom()"
        v-tooltip="t('zoom-reset')">
        <img :src="'finland.png'" :alt="i18n.global.t('alt.finland')" />
      </button>
    </div>
    <MenuButton :icon="mdiEarthBox" :tooltip="t('background')">
      <BackgroundMenu />
    </MenuButton>
    <MenuButton v-if="currentDataset" :icon="mdiLayersTripleOutline" :tooltip="t('layers')">
      <LayersMenu />
    </MenuButton>
  </div>

</template>

<i18n>
{
  "en": {
    "zoom-in": "Zoom in",
    "zoom-out": "Zoom out",
    "zoom-reset": "Zoom to Finland",
    "background": "Select background map",
    "layers": "Select visible layers",
  },
  "fi": {
    "zoom-in": "Zoomaa sisään",
    "zoom-out": "Zoomaa ulos",
    "zoom-reset": "Näytä koko Suomi",
    "background": "Valitse taustakartta",
    "layers": "Valitse näkyvät karttatasot",
  },
}
</i18n>

<style scoped>

button {
  all: unset;
  cursor: pointer;
  display: inline-flex;
}

.column {
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  width: 27px;
  gap: .6em;

  > * {
    border-radius: .3rem;
    background-color: var(--c-white);
    display: flex;
    flex-direction: column;

    c-icon {
      z-index: 0;
      position: relative;
      color: var(--c-primary-600);
    }
  }
}

.zoom c-icon::before {
  content: '';
  position: absolute;
  margin: .25em;
  top: 0; left: 0; right: 0; bottom: 0;
  z-index: -1;
}

.map-reset {
  width: 100%;
  padding: .2em;
  background-color: var(--c-white);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

</style>
