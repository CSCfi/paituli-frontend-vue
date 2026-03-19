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
import { indexSource } from '@/modules/layers';
import { vHelp } from '@/directives/help';
import HelpContent from './HelpContent.vue';
import { toolbarMode } from '@/modules/controls';

const { addToast } = useToasts()
const { t } = useI18n()

// Parent map component which we manipulate based on search
const props = defineProps<{ map: OlMap }>()

const searchStr = ref('')

// Queries Nominatim API for location data
async function fetchLocationData(query: string): Promise<NominatimResponse[]> {
  const response = await fetch(
    URLS.NOMINATIM_API.replace('!query!', encodeURIComponent(query)))
  if (!response.ok) throw Error(`HTTP code ${response.status}`)
  return response.json()
}

// Searches either a location to zoom to, or
// a location which to use for mapsheet selection
async function search() {
  if (searchStr.value.length === 0) return

  // Fetch location info
  let result: NominatimResponse
  try {
    const results = await fetchLocationData(searchStr.value)
    // We should stop to warn about bad locations only in geographic mode
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

  // If set by user, we select mapsheets.
  if (selectMode.value) {
    selectFeatureSearch(searchStr.value, result.boundingbox);
  }
  // Otherwise the map is zoomed to found location.
  else {
    const projected = transform([result.lon, result.lat], 'EPSG:4326', 'EPSG:3857')
    props.map.getView().animate({
      center: [projected[0], projected[1]],
      zoom: searchStr.value.includes(',') ? 16 : 13,
      duration: 1000,
    })
  }
}

// Selection by search string
function selectFeatureSearch(query: string, bbox: Array<number>) {
  if (!indexSource.value || !query) return;
  selectedOlFeatures.clear();
  const features = indexSource.value.getFeatures();

  // First try bounding box
  const extent = transformExtent([bbox[2], bbox[0], bbox[3], bbox[1]], 'EPSG:4326', 'EPSG:3857')
  if (selectSheetsByExtent(extent, props.map.getView())) return

  // If none found, simply select sheets by label
  const matches = features.filter((f) => {
    const name = (f.get('label') || f.get('name') || '').toLowerCase();
    return name.includes(query.toLowerCase());
  })
  if (matches.length > 0) {
    matches.forEach((feature) => selectFeature(feature))
    return
  }

  addToast({
    type: CToastType.Warning,
    message: t('no_matches')
  })
}

// Whether we should select mapsheets instead of location search
const selectMode = computed(() => toolbarMode.value == 'select')
const modeName = computed(() => selectMode.value ? 'select' : 'search')

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
              :path="selectMode ? mdiSelectSearch : mdiMagnify"
              size="18" />
      <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
      <c-button slot="post"
                size="small"
                @click="search()"
                ghost>{{ t(`${modeName}.button`) }}</c-button>
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
      "label": "Mapsheet search",
      "tooltip": "Select mapsheets with result bounding box",
      "help": "The bounding box of your search query will be used to select all intersecting map sheets and will be highlighted on the map. Alternatively, you can use the mapsheet search mode to select sheets by label, including any sheet whose label contains your search query.",

    },
    "search": {
      "button": "Search",
      "label": "Location search",
      "tooltip": "Seach for a location and zoom into it",
      "help": "Search for a geographic location and zoom the map into it.",
    },
    "no_matches": "Search query did not match any location or mapsheet label.",
    "nothing_found": "Location or address not found. Please double check your spelling.",
    "api_error": "The search API encountered an error. Please try again later.",
  },
  "fi": {
    "select": {
      "button": "Valitse",
      "label": "Karttalehtihaku",
      "tooltip": "Valitse karttalehtiä haun tuloksen rajoilla",
      "help": "Hakusi rajaavaa aluetta käytetään kaikkien risteävien karttalehtien valintaan, joka korostetaan kartalla. Vaihtoehtoisesti voit käyttää karttalehtihakua valitaksesi lehtiä tunnuksen perusteella, mukaan lukien kaikki lehdet, joiden tunnuksessa esiintyy hakusi."
    },
    "search": {
      "button": "Hae",
      "label": "Sijaintihaku",
      "tooltip": "Hae sijaintia ja zoomaa tulokseen",
      "help": "Sijaintihaku zoomaa kartan hakua vastaavaan maantieteelliseen paikkaan",
    },
    "no_matches": "Haku ei vastannut yhtäkään lokaatiota tai karttalehden nimeä.",
    "nothing_found": "Sijaintia tai osoitetta ei löytynyt. Tarkista kirjoitusasu.",
    "api_error": "Hakurajapinta kohtasi virheen. Yritä myöhemmin uudelleen.",
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
  --c-button-ghost-background-color: var(--c-secondary-400);
  --c-button-ghost-text-color: white;
}

</style>
