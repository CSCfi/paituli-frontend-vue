<script setup lang="ts">
import { computed, ref } from 'vue';

import OlMap from 'ol/Map.js'
import { transform, transformExtent } from 'ol/proj'
import { useI18n } from 'vue-i18n';

import { mdiMagnify, mdiSelectSearch } from '@mdi/js'

import type { NominatimResponse } from '@/shared/types';
import { URLS } from '@/shared/constants';
import { useToasts } from '@/composables/toasts';
import { CToastType } from '@cscfi/csc-ui';
import { selectedOlFeatures, selectFeature, selectSheetsByExtent } from '@/modules/selection';
import { clearBoundingBox, indexSource } from '@/modules/layers';
import { vHelp } from '@/directives/help';
import HelpContent from '@/components/download/help/HelpContent.vue';
import { toolbarMode } from '@/modules/controls';
import { createEmpty, extend } from 'ol/extent';

const { addToast } = useToasts()
const { t } = useI18n()

// Parent map component which we manipulate based on search
// and mode to take less horizontal space if needed
const props = defineProps<{ map: OlMap, compact: boolean }>()

// selectMode determines whether we should select map sheets
// instead of doing a traditional location search
const selectMode = computed(() => toolbarMode.value == 'select')
const modeName = computed(() => selectMode.value ? 'select' : 'search')
const searchStr = ref('')

// Queries Nominatim API for location data
async function fetchLocationData(query: string): Promise<NominatimResponse[]> {
  const response = await fetch(
    URLS.NOMINATIM_API.replace('!query!', encodeURIComponent(query)))
  if (!response.ok) throw Error(`HTTP code ${response.status}`)
  return response.json()
}

// Searches either a location to zoom to, or
// a location which to use for map sheet selection
async function search() {
  if (searchStr.value.length === 0) return

  // Fetch location info
  let result: NominatimResponse | undefined
  try {
    const results = await fetchLocationData(searchStr.value)
    // We stop to warn about bad locations only in geographic search mode
    if (!selectMode.value && results.length == 0) {
      addToast({
        type: CToastType.Warning,
        message: t('nothing_found'),
      })
      return
    }
    result = results[0] // Just select the first result
  } catch (error) {
    addToast({
      type: CToastType.Error,
      message: t('api_error'),
    })
    console.error('Nominatim search error: ' + error)
    return
  }
  finally {
    // If in map sheet select mode, we select those based on results.
    if (selectMode.value) {
      selectFeatureSearch(searchStr.value, result?.boundingbox);
    }
    // Otherwise the map is zoomed to found location.
    else {
      const projected = transform([result!.lon, result!.lat], 'EPSG:4326', 'EPSG:3857')
      props.map.getView().animate({
        center: [projected[0], projected[1]],
        zoom: searchStr.value.includes(',') ? 16 : 13,
        duration: 1000,
      })
    }
  }
}

// Map sheet selection by search string or extent
function selectFeatureSearch(query: string, bbox?: Array<number>) {
  if (!indexSource.value || !query) return;

  // Clear previous selection and highlights
  selectedOlFeatures.clear();
  clearBoundingBox()

  // First try sheets by label
  const matches = indexSource.value.getFeatures().filter((f) => {
    const name = (f.get('label') || f.get('name') || '').toLowerCase();
    return name.includes(query.toLowerCase());
  })
  if (matches.length > 0) {
    // We found some sheets, zoom to combined extent
    const extent = createEmpty()
    matches.forEach((feature) => {
      selectFeature(feature)
      extend(extent, feature.getGeometry()!.getExtent())
    })
    requestAnimationFrame(() => {
      props.map.getView().fit(extent, {
        padding: [150, 40, 40, 40],
        duration: 1500,
      })
    })
    return
  }
  // No sheet hits, try bounding box if provided
  if (bbox) {
    const extent = transformExtent([bbox[2], bbox[0], bbox[3], bbox[1]], 'EPSG:4326', 'EPSG:3857')
    if (!selectSheetsByExtent(extent, props.map.getView())) {
      addToast({
        type: CToastType.Warning,
        message: t('no_overlap')
      })
    }
    return
  }
  // Nothing found, inform user
  addToast({
    type: CToastType.Error,
    message: t('no_matches')
  })
}

</script>

<template>
  <div :class="{selectMode: selectMode}">
    <c-text-field v-model="searchStr"
                  @keypress.enter="search"
                  :key="selectMode"
                  v-tooltip="t(`${modeName}.tooltip`)"
                  v-help="`#${modeName}-help`"
                  :label="t(`${modeName}.label`)"
                  placeholder="Helsinki"
                  trim-whitespace
                  hide-details
                  id="searchbar">
      <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
      <c-icon slot="pre"
              v-if="!compact"
              :path="selectMode ? mdiSelectSearch : mdiMagnify"
              size="18" />
      <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
      <c-button slot="post"
                size="small"
                @click="search()"
                ghost>
        <span v-if="!compact">
          {{ t(`${modeName}.button`) }}
        </span>
        <span v-else>
          <c-icon :path="selectMode ? mdiSelectSearch : mdiMagnify" size="18px" />
        </span>
      </c-button>
    </c-text-field>

    <help-content id="select-help">{{ t('select.help') }}</help-content>
    <help-content id="search-help">{{ t('search.help') }}</help-content>
  </div>

</template>

<i18n>
{
  "en": {
    "select": {
      "button": "Select",
      "label": "Map sheet search",
      "tooltip": "Select map sheets by place name or map sheet label",
      "help": "Search for a place name to select overlapping map sheets. Alternatively, select map sheets by their label.",
    },
    "search": {
      "button": "Search",
      "label": "Place name search",
      "tooltip": "Search for a place name and zoom into it",
      "help": "Search for a place name and zoom into it. For example: muncipalities, postal codes, landmarks and points of interest.",
    },
    "no_matches": "The search could not find any place name or map sheet label. Please double-check your spelling.",
    "no_overlap": "The found place name does not overlap with any map sheets.",
    "nothing_found": "The search could not find any place name. Please double-check your spelling.",
    "api_error": "The search API encountered an error. Please try again later.",
  },
  "fi": {
    "select": {
      "button": "Valitse",
      "label": "Karttalehtihaku",
      "tooltip": "Valitse karttalehtiä paikannimellä tai karttalehden nimellä",
      "help": "Hae paikannimeä valitaksesi päällekäiset karttalehdet. Vaihtoehtoisesti voit valita karttalehtiä niiden nimen perusteella."
    },
    "search": {
      "button": "Hae",
      "label": "Paikannimihaku",
      "tooltip": "Hae paikannimeä ja zoomaa siihen",
      "help": "Hae paikannimeä ja zoomaa siihen. Esimerkiksi: kunnat, postinumerot, maamerkit ja kiinnostavat kohteet.",
    },
    "no_matches": "Haku ei löytänyt yhtäkään paikannimeä tai karttalehden nimeä. Tarkista oikeinkirjoitus.",
    "no_overlap": "Löytynyt paikannimi ei ole päällekäin yhdenkään karttalehden kanssa.",
    "nothing_found": "Haku ei löytänyt yhtäkään paikannimeä. Tarkista oikeinkirjoitus.",
    "api_error": "Hakurajapinnassa tapahtui virhe. Yritä myöhemmin uudelleen.",
  },
}
</i18n>

<style scoped>

div {
  height: fit-content;
  width: 340px;
  background-color: white;
  padding: .3em;
  border-radius: .3em;
}

c-tab-buttons {
  --c-tab-buttons-background-color-active: var(--c-primary-400);
  /* Aligns the tabs with the toolbar select mode tabs */
  margin-top: 22px;
}

.selectMode {
  --c-button-ghost-background-color: var(--c-primary-600);
  --c-button-ghost-text-color: white;
}

c-button {
  --_c-button-min-width: 0;
  c-icon {
    padding-top: 4px;
  }
}

</style>
