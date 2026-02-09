<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import {
  mdiAlert,
  mdiCheckboxMultipleMarkedOutline,
  mdiCursorDefaultOutline,
  mdiCursorMove,
  mdiFileUploadOutline,
  mdiShapePolygonPlus,
  mdiTarget,
  mdiTrashCanOutline
} from '@mdi/js';

import OlMap from 'ol/Map.js'
import DragPan from 'ol/interaction/DragPan'
import { useI18n } from 'vue-i18n';

import { dataLayerMaxResolution, dataSource } from '@/modules/layers';
import { selectedOlFeatures, } from '@/modules/selection';
import { fileSelectedCallback, selectMode, toolbarMode } from '@/modules/controls';

const { t } = useI18n()

const props = defineProps<{ map: OlMap }>()

const viewResolution = ref<number>(0)
const dataHidden = computed(() => viewResolution.value > dataLayerMaxResolution.value)

onMounted(() => {
  // Grab initial resolution value and subscribe to future changes
  const view = props.map.getView()
  viewResolution.value = view.getResolution() ?? 0
  view.on('change:resolution', () => {
    viewResolution.value = view.getResolution() ?? 0
  })
})

watch(dataSource, () => {
  // Reset selection to 'move' in case inspect becomes unavailable
  toolbarMode.value = 'move'
})

watch(toolbarMode, (mode) => {
  // When tool mode changes, we only allow drag-pan in 'move'
  dragPan?.setActive(mode == 'move')

  // Change our cursor depending on the mode
  const domElement = props.map.getTargetElement()
  domElement.style.cursor = {
    'move': 'move',
    'select': '',
    'inspect': 'crosshair',
  }[mode] ?? ''
})

watch(selectMode, (newMode, oldMode) => {
  // Whenever select tool mode changes, we check if user selected clear mode.
  // We use the tab simply as a button, so we'll revert to the previous mode
  // after clearing the selected features
  if (newMode == 'clear') {
    selectedOlFeatures.clear()
    selectMode.value = oldMode
  }
})

// Seeminly this interaction is not accessible as a vue3-ol component,
// but we can dig it up from amongst all current interactions
const dragPan = props.map.getInteractions().getArray()
  .find(i => i instanceof DragPan) as DragPan | undefined


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
  <c-tabs v-model="toolbarMode"
          v-control
          borderless
          disable-animation>
    <c-tab-buttons mandatory>
      <c-button value="move">
        {{ t("move.label") }}<c-icon :path="mdiCursorMove"/>
      </c-button>
      <c-button value="select">
        {{ t("select.label") }}<c-icon :path="mdiCheckboxMultipleMarkedOutline"/>
      </c-button>
      <c-button value="inspect" :disabled="!dataSource">
        {{ t("inspect.label") }}<c-icon :path="mdiTarget"/>
      </c-button>
    </c-tab-buttons>
    <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
    <c-tab-items slot="items">
      <c-tab-item value="move">
        {{ t("move.help") }}
      </c-tab-item>
      <c-tab-item id="select" value="select">
        <c-tab-buttons v-model="selectMode"
                       v-control
                       mandatory
                       size="small">
          <c-button value="basic">
            {{ t("select.basic.label") }}<c-icon :path="mdiCursorDefaultOutline"/>
          </c-button>
          <c-button value="poly">
            {{ t("select.poly.label") }}<c-icon :path="mdiShapePolygonPlus"/>
          </c-button>
          <c-button value="json">
            {{ t("select.json.label") }}<c-icon :path="mdiFileUploadOutline"/>
          </c-button>
          <c-button value="clear" id="trash">
            <c-icon :path="mdiTrashCanOutline" />
          </c-button>
        </c-tab-buttons>
        <div v-if="selectMode == 'basic'">
          <p>{{ t("select.basic.help") }}</p>
        </div>
        <div v-if="selectMode == 'poly'">
          <p>{{ t("select.poly.help") }}</p>
        </div>
        <div v-if="selectMode == 'json'">
          <p>{{ t("select.json.help") }}</p>
          <input
            ref="fileInput"
            type="file"
            accept=".json,.geojson"
            style="display: none"
            @change="onFileSelected"
          />
          <c-button @click="openFileDialog">
            {{ t("select.json.open") }}
          </c-button>
        </div>
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
      "basic": {
        "label": "Basic",
        "help": "Select single map sheets by clicking or drag a rectangular selection to select multiple map sheets. Clicking selected sheets de-selects them.",
      },
      "poly": {
        "label": "Polygon",
        "help": "Click to start drawing a shape to select multiple map sheets.",
      },
      "json": {
        "label": "GeoJSON",
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
      "basic": {
        "label": "Tavallinen",
        "help": "Valitse yksittäisiä karttalehtiä napsauttamalla tai raahaa suorakulmainen valinta valitaksesi useita karttalehtiä. Valittuja lehtiä napsauttamalla poistat ne valinnasta.",
      },
      "poly": {
        "label": "Polygoni",
        "help": "Napsauta aloittaaksesi monikulmion piirtämisen useiden karttalehtien valitsemiseksi.",
      },
      "json": {
        "label": "GeoJSON",
        "help": "Lataa GeoJSON-tiedosto valitaksesi leikkaavat karttalehdet. Käytä alla olevaa painiketta tai pudota JSON-tiedostoja karttanäkymään.",
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
  min-width: 430px;
}

c-tab-item {
  color: white;

  input + c-button {
    --c-button-background-color: var(--c-info-500);
  }
}

c-button {
  --_c-button-font-size: 17px;
}

c-button#trash {
  color: var(--c-error-500);
  max-width: 30px;
  min-width: 0;
  --_c-button-min-width: 0;
}


</style>
