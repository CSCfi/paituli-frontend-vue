<script setup lang="ts">
import { mdiLayersTripleOutline, mdiMinusBox, mdiPlusBox } from '@mdi/js'
import { useI18n } from 'vue-i18n';

import OlMap from 'ol/Map.js'
import { APP_SETTINGS } from '@/shared/constants';
import { computed, ref } from 'vue';
import LayersTab from './tabs/LayersTab.vue';
import { currentDataset } from '@/modules/datasets';

const { t } = useI18n()

const props = defineProps<{ map: OlMap }>()
const mapView = computed(() => props.map.getView())

const menuVisible = ref(false)

function zoom(amount: number) {
  mapView.value.animate({
    zoom: mapView.value.getZoom()! + amount,
    duration: 200,
  })
}

function resetZoom() {
  props.map.getView().animate({
    center: APP_SETTINGS.MAP_DEFAULT_CENTER,
    zoom: APP_SETTINGS.MAP_DEFAULT_ZOOM,
    duration: 1000,
  })
}

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
        <img :src="'finland.png'" />
      </button>
    </div>
    <div v-if="currentDataset" class="layers">
      <button
        type="button"
        @click="menuVisible = !menuVisible"
        v-tooltip="t('layers')">
        <c-icon :path="mdiLayersTripleOutline" size="27px" />
      </button>
      <div v-if="menuVisible" class="layer-menu">
        <layers-tab />
      </div>
    </div>
  </div>

</template>

<i18n>
{
  "en": {
    "zoom-in": "Zoom in",
    "zoom-out": "Zoom out",
    "zoom-reset": "Zoom back to Finland",
    "layers": "Adjust layer visibility",
  },
  "fi": {
    "zoom-in": "Zoomaa sisään",
    "zoom-out": "Zoomaa ulos",
    "zoom-reset": "Zoomaa takaisin Suomeen",
    "layers": "Säädä tasojen näkyvyyttä",
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
      color: var(--c-primary-200);
    }
  }
}

.zoom c-icon::before {
  content: '';
  position: absolute;
  margin: .25em;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: var(--c-primary-600);
  z-index: -1;
}

.layers {
  c-icon {
    color: var(--c-primary-600);
    padding: .15em;
  }

  .layer-menu {
    position: absolute;
    width: 15em;
    right: .15em;
    padding: 1em;
    margin-top: 3em;

    border-radius: 1em;
    border-top-right-radius: 0;
    color: var(--c-primary-100);
    background-color: var(--c-primary-700);

  }

  .layer-menu::before {
    content: "";
    position: absolute;
    top: -8px;
    right: 4px;
    transform: rotate(45deg);

    width: 16px;
    height: 16px;

    background: inherit;
  }
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
