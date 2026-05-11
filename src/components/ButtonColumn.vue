<script setup lang="ts">
import { mdiClose, mdiCopyright, mdiLayersTripleOutline, mdiMinusBox, mdiPlusBox } from '@mdi/js'
import { useI18n } from 'vue-i18n';

import OlMap from 'ol/Map.js'
import { APP_SETTINGS } from '@/shared/constants';
import { computed, ref } from 'vue';
import LayersMenu from './LayersMenu.vue';
import { currentDataset } from '@/modules/datasets';

const { t } = useI18n()

const props = defineProps<{ map: OlMap }>()
const mapView = computed(() => props.map.getView())

const showAttribs = ref(false)
const menuVisible = ref(false)
const menuEl = ref<HTMLElement | null>(null)
const buttonEl = ref<HTMLElement | null>(null)

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

// Close menu when clicking outside of it
function closeHandler(e: PointerEvent) {
  const path = e.composedPath()
  if (!menuEl.value || !buttonEl.value) return
  if (path.includes(menuEl.value) || path.includes(buttonEl.value)) return
  menuVisible.value = false
}
document.addEventListener('pointerdown', closeHandler)

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
    <div class="attributions">
      <button
        type="button"
        @click="showAttribs = true"
        v-tooltip="t('attributions.tooltip')">
        <c-icon :path="mdiCopyright" size="27px" />
      </button>
      <c-modal v-model="showAttribs"
               v-control
               dismissable
               disable-backdrop-blur>
        <c-card>
          <c-card-title>
            {{ t('attributions.title') }}
          </c-card-title>
          <c-card-content>
            <strong>{{ t('attributions.header') }}</strong>
            <div>
              © <a target="_blank" href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>
              contributors, © Natural Earth Data, © GEBCO Bathymetric Compilation Group 2019,
              © <a target="_blank" href="https://terrestris.de/en/products/free-osm-wms/">Terrestris</a>
            </div>
          </c-card-content>
          <c-card-actions>
            <c-button @click="showAttribs = false">{{ t('close') }}</c-button>
          </c-card-actions>
        </c-card>
      </c-modal>
    </div>
    <div v-if="currentDataset" class="layers">
      <button
        type="button"
        ref="buttonEl"
        @click="menuVisible = !menuVisible"
        :class="{ close: menuVisible }"
        :key="`${menuVisible}`"
        v-tooltip="t(menuVisible ? 'close' : 'layers')">
        <c-icon v-if="menuVisible" :path="mdiClose" size="27px" />
        <c-icon v-else :path="mdiLayersTripleOutline" size="27px" />
      </button>
      <div v-if="menuVisible" ref="menuEl" class="layer-menu">
        <LayersMenu />
      </div>
    </div>
  </div>

</template>

<i18n>
{
  "en": {
    "zoom-in": "Zoom in",
    "zoom-out": "Zoom out",
    "zoom-reset": "Zoom to Finland",
    "attributions": {
      "tooltip": "Attributions",
      "title": "Attributions",
      "header": "Background map",
    },
    "layers": "Select visible layers",
    "close": "Close",
  },
  "fi": {
    "zoom-in": "Zoomaa sisään",
    "zoom-out": "Zoomaa ulos",
    "zoom-reset": "Näytä koko Suomi",
    "attributions": {
      "tooltip": "Tekijänoikeudet",
      "title": "Tekijänoikeudet",
      "header": "Taustakartta",
    },
    "layers": "Valitse näkyvät karttatasot",
    "close": "Sulje",
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

.layers {

  .layer-menu {
    position: absolute;
    width: 15em;
    right: 0;
    padding: 1em;
    z-index: -1;

    border-radius: 1em;
    border-top-right-radius: .3rem;
    color: var(--c-primary-100);
    background-color: var(--c-primary-700);
  }

  button.close {
    background-color: var(--c-primary-800);

    c-icon {
      color: var(--c-primary-100)
    }
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

.layers,
.attributions {
  c-icon {
    color: var(--c-primary-600);
    padding: .15em;
  }
}

c-button {
    --c-button-background-color: var(--c-info-600);
    --c-button-background-color-hover: var(--c-info-400);
}

</style>
