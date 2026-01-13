<script setup lang="ts">
import { useControls } from '@/composables/controls';
import { useSources } from '@/composables/sources';
import OlMap from 'ol/Map.js'
import { computed, onMounted, ref, watch } from 'vue';

import { mdiAlert, mdiCrosshairs, mdiCursorMove, mdiSelect } from '@mdi/js';
import { useI18n } from 'vue-i18n';

const { t } = useI18n()

const { dataLayerMaxResolution, dataLayerSource } = useSources()
const { controlMode, selectMode, selectedOlFeatures, fileSelectedCallback } = useControls()

const props = defineProps<{ map: OlMap }>()

const viewResolution = ref<number>(0)
const dataHidden = computed(() => viewResolution.value > dataLayerMaxResolution.value )
const clearClickAmount = ref<number>(0)

onMounted(() => {
  // Grab initial resolution value and subscribe to future changes
  const view = props.map.getView()
  viewResolution.value = view.getResolution() ?? 0
  view.on('change:resolution', () => {
    viewResolution.value = view.getResolution() ?? 0
  })
})

watch(dataLayerSource, () => {
  // Reset selection to 'move' in case inspect becomes unavailable
  controlMode.value = 'move'
})

watch(controlMode, (mode) => {
  // Change our cursor depending on the mode
  const domElement = props.map.getTargetElement()
  domElement.style.cursor = {
    'move': 'move',
    'select': '',
    'inspect': 'crosshair',
  }[mode] ?? ''
})

watch(selectMode, () => {
  // Whenever select tool mode changes we reset clear handler
  clearClickAmount.value = 0
})

const clearHandler = () => {
  if (++clearClickAmount.value == 2) {
    // We only clear the selection if user confirms
    selectedOlFeatures.clear()
  }
}

const fileInput = ref<HTMLInputElement | null>(null)
const openFileDialog = () => {
  fileInput.value?.click()
}
const onFileSelected = (event: Event) => {
  const files = (event.target as HTMLInputElement)?.files
  if (!files) return
  for (const file of files) fileSelectedCallback.value?.(file)
}

</script>

<template>
  <c-tabs v-model="controlMode"
          v-control
          borderless
          disable-animation>
    <c-tab-buttons mandatory>
      <c-button value="move">{{ t("move.label") }} <c-icon :path="mdiCursorMove"/></c-button>
      <c-button value="select">{{ t("select.label") }} <c-icon :path="mdiSelect"/></c-button>
      <c-button value="inspect" :disabled="!dataLayerSource">{{ t("inspect.label") }} <c-icon :path="mdiCrosshairs"/></c-button>
    </c-tab-buttons>
    <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
    <c-tab-items slot="items">
      <c-tab-item value="move">
        {{ t("move.help") }}
      </c-tab-item>
      <c-tab-item value="select">
        <c-tab-buttons v-model="selectMode"
                       v-control
                       mandatory
                       size="small">
          <c-button value="single">{{ t("select.single.label") }}</c-button>
          <c-button value="multi">{{ t("select.multi.label") }}</c-button>
          <c-button value="draw">{{ t("select.draw.label") }}</c-button>
          <c-button value="json">{{ t("select.json.label") }}</c-button>
          <c-button @click="clearHandler()" value="clear">{{ t("select.clear.label") }}</c-button>
        </c-tab-buttons>
        <p v-if="selectMode == 'single'">
          {{ t("select.single.help") }}
        </p>
        <p v-if="selectMode == 'multi'">
          {{ t("select.multi.help") }}
        </p>
        <p v-if="selectMode == 'draw'">
          {{ t("select.draw.help") }}
        </p>
        <p v-if="selectMode == 'json'">
          {{ t("select.json.help") }}
          <input
            ref="fileInput"
            type="file"
            accept=".json,.geojson"
            style="display: none"
            @change="onFileSelected"
          />
          <c-button @click="openFileDialog">{{ t("select.json.open") }}</c-button>
        </p>
        <p v-if="selectMode == 'clear'">
          {{ t("select.clear.help") }}
        </p>
      </c-tab-item>
      <c-tab-item value="inspect">
        <div v-if="dataHidden">
          <c-icon :path="mdiAlert"/>{{ t("inspect.zoom") }}
        </div>
        <div v-else>
          {{ t("inspect.help") }}
        </div>
      </c-tab-item>
    </c-tab-items>
  </c-tabs>

</template>

<i18n>
{
  "en": {
    "move": {
      "label": "Move",
      "help": "Click and drag to move the map view. Hold Shift while doing so to zoom into a region. You can zoom in and out by scrolling and using the zoom buttons.",
    },
    "select": {
      "label": "Select",
      "single": {
        "label": "Single",
        "help": "Select single map sheets by clicking. Clicking selected sheets de-selects them.",
      },
      "multi": {
        "label": "Multi",
        "help": "Click and drag a rectangular selection to select multiple map sheets.",
      },
      "draw": {
        "label": "Draw",
        "help": "Click to start drawing a polygon to select multiple map sheets.",
      },
      "json": {
        "label": "JSON",
        "help": "Load GeoJSON to select intersecting map sheets. Use the button below or drag and drop json files onto the map view.",
        "open": "Open file dialog",
      },
      "clear": {
        "label": "Clear",
        "help": "Remove all map sheets from selection. Click the button again to confirm.",
      },
    },
    "inspect": {
      "label": "Inspect",
      "help": "Click highlighted map features to display feature information.",
      "zoom": "To use the inspect tool, zoom in until you see the data layer preview.",
    },
  },
  "fi": {
    "move": {
      "label": "Liiku",
      "help": "Napsauta ja vedä karttanäkymää liikuttaaksesi sitä. Pidä Shift painettuna, zoomataksesi alueelle. Voit zoomata sisään ja ulos vierittämällä tai käyttämällä zoomauspainikkeita.",
    },
    "select": {
      "label": "Valitse",
      "single": {
        "label": "Yksi",
        "help": "Valitse yksittäisiä karttalehtiä napsauttamalla. Valittuja lehtiä napsauttamalla poistat ne valinnasta.",
      },
      "multi": {
        "label": "Monta",
        "help": "Napsauta ja vedä suorakulmainen valinta valitaksesi useita karttalehtiä.",
      },
      "draw": {
        "label": "Piirrä",
        "help": "Napsauta aloittaaksesi monikulmion piirtämisen useiden karttalehtien valitsemiseksi.",
      },
      "json": {
        "label": "JSON",
        "help": "Lataa GeoJSON tiedosto valitaksesi leikkaavat karttalehdet. Käytä alla olevaa painiketta tai pudota JSON-tiedostoja karttanäkymään.",
        "open": "Avaa tiedostonvalinta",
      },
      "clear": {
        "label": "Poista",
        "help": "Poista kaikki karttalehdet valinnasta. Vahvista painamalla uudelleen.",
      },
    },
    "inspect": {
      "label": "Tarkastele",
      "help": "Napsauta korostettuja karttakohteita näyttääksesi kohteen tiedot.",
      "zoom": "Käyttääksesi tarkastelutyökalua, zoomaa kunnes näet datan esikatselun.",
    },
  },
}
</i18n>

<style scoped>
c-tabs {
  --c-tab-buttons-background-color-active: var(--c-primary-400);
  min-width: 333px;
}
c-tab-item {
  color: white;

  input + c-button {
    margin-top: 10px;
    --c-button-background-color: var(--c-info-500);
  }
}

</style>
