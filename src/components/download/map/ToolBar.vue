<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import {
  mdiCheckboxMultipleMarkedOutline,
  mdiCloseBoxMultipleOutline,
  mdiCursorDefaultOutline,
  mdiCursorMove,
  mdiFileUploadOutline,
  mdiShapePolygonPlus,
  mdiTarget,
} from '@mdi/js';

import type Map from 'ol/Map.js'
import { useI18n } from 'vue-i18n';

import { clearBoundingBox, dataHidden, dataLayerMaxResolution, dataSource, tileLoadCallback } from '@/modules/layers';
import { autoSelectSheets, selectedOlFeatures, } from '@/modules/selection';
import { fileSelectedCallback, mapViewResolution, menuMode, selectMode, toolbarMode } from '@/modules/controls';
import { vTooltip } from '@/directives/tooltip';
import { vHelp } from '@/directives/help';
import HelpContent from '@/components/download/help/HelpContent.vue';
import { CAlertType } from '@cscfi/csc-ui';
import { currentDataset } from '@/modules/datasets';
import { sleep } from '@/shared/util';
import { useCompactness } from '@/composables/compactness';

const { t } = useI18n()
const props = defineProps<{ map: Map }>()

// useCompactness allows us to adapt to the space this component takes
const rootRef = ref<HTMLElement>()
const { width, between } = useCompactness(rootRef)

// Compactness breakpoints in px
enum Width {
  Compact = 500,
  VeryCompact = 400,
  SuperCompact = 300,
}

// Icons show everywhere except the medium compactness (very-compact) band
const showIcons = computed(() => !between(Width.SuperCompact, Width.VeryCompact))

const inspectCursor = computed(() => dataHidden.value ? 'not-allowed' : 'crosshair')

onMounted(() => {
  // Grab initial resolution value and subscribe to future changes
  const view = props.map.getView()
  mapViewResolution.value = view.getResolution() ?? 0
  view.on('change:resolution', () => {
    mapViewResolution.value = view.getResolution() ?? 0
  })
  // Set callback for data tile rendering updates
  tileLoadCallback.value = () => {
    props.map.render()
  }
})

const selectDisabled = ref(false)
const inspectDisabled = ref(false)

watch(currentDataset, async () => {
  // Reset selection to 'move' in case inspect becomes unavailable
  toolbarMode.value = 'move'

  // To go around c-tab-buttons bg color bug we wait for
  // a while before determining which of the buttons are enabled
  await sleep(10)
  selectDisabled.value = autoSelectSheets.value
  inspectDisabled.value = !dataSource.value
})

watch(inspectCursor, (cursor) => {
  // Update inspect mode cursor state
  if (toolbarMode.value == 'inspect') {
    props.map.getTargetElement().style.cursor = cursor
  }
})

watch(toolbarMode, (mode) => {
  // Update cursor
  const domElement = props.map.getTargetElement()
  domElement.style.cursor = {
    'move': 'move',
    'select': '',
    'inspect': inspectCursor.value,
  }[mode] ?? ''

  // If entering select mode, we take user to download tab,
  // if the UI is in tab mode
  if (mode == 'select') {
    menuMode.value = 'download'
  }
})

watch(selectMode, (newMode, oldMode) => {
  // Whenever select tool mode changes, we check if user selected clear mode.
  // We use the tab simply as a button, so we'll revert to the previous mode
  // after clearing the selected features
  if (newMode == 'clear') {
    selectedOlFeatures.clear()
    selectMode.value = oldMode
  }
  // We always clear map (search) highlights when mode changes
  clearBoundingBox()
})

// GeoJSON file handling
const fileInput = ref<HTMLInputElement | null>(null)
const onFileSelected = (event: Event) => {
  const files = (event.target as HTMLInputElement)?.files
  if (!files) return
  for (const file of files) fileSelectedCallback.value?.(file)
}

// For the inspect mode button to take us to where data preview loads.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const zoomToData = () => {
  const view = props.map.getView()
  view.animate({
    duration: 1000,
    // Since this is the exact resolution beyond which OL starts rendering
    // the layer and WMTS queries start, we nudge the limit forward just
    // a bit to avoid landing exactly on the threshold (floating point errors)
    resolution: dataLayerMaxResolution.value * 0.99,
  })
}

const popAlert = ref(false)
function doPopAlert() {
  popAlert.value = true
  setTimeout(() => popAlert.value = false, 200)
}

defineExpose({ doPopAlert })

</script>

<template>
  <c-tabs v-model="toolbarMode"
          ref="rootRef"
          v-control
          :key="width < Width.Compact"
          v-show="currentDataset"
          disable-animation>
    <c-tab-buttons
      mandatory>
      <c-button
        value="move"
        v-help="t('move.help')"
        v-tooltip="t('move.tooltip')">
        <span v-show="width >= Width.SuperCompact">
          {{ t("move.label") }}
        </span>
        <span v-show="showIcons">
          <c-icon :path="mdiCursorMove"/>
        </span>
      </c-button>
      <c-button
        value="select"
        :disabled="selectDisabled"
        v-help="`#${selectMode}-help`"
        v-tooltip="!autoSelectSheets ? t('select.tooltip') : t('select.disabled')">
        <span v-show="width >= Width.SuperCompact">
          {{ t("select.label" + (width < Width.Compact ? "_compact" : "")) }}
        </span>
        <span v-show="showIcons">
          <c-icon :path="mdiCheckboxMultipleMarkedOutline"/>
        </span>
      </c-button>
      <c-button
        value="inspect"
        v-help="t('inspect.help')"
        :disabled="inspectDisabled"
        v-tooltip="dataSource ? t('inspect.tooltip') : t('inspect.disabled')">
        <span v-show="width >= Width.SuperCompact">
          {{ t("inspect.label") }}
        </span>
        <span v-show="showIcons">
          <c-icon :path="mdiTarget"/>
        </span>
      </c-button>
    </c-tab-buttons>
    <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
    <c-tab-items slot="items">
      <c-tab-item value="move"/>
      <c-tab-item value="select">
        <c-tab-buttons v-model="selectMode"
                       v-control
                       mandatory
                       size="small">
          <c-button
            value="basic"
            v-help
            v-tooltip="t('select.basic.tooltip')">
            <span v-show="width >= Width.SuperCompact">
              {{ t("select.basic.label" + (width < Width.Compact ? "_compact":"")) }}
            </span>
            <span v-show="showIcons">
              <c-icon :path="mdiCursorDefaultOutline"/>
            </span>
            <help-content id="basic-help">{{ t('select.basic.help') }}</help-content>
          </c-button>
          <c-button
            value="poly"
            v-help
            v-tooltip="t('select.poly.tooltip')">
            <span v-show="width >= Width.SuperCompact">
              {{ t("select.poly.label") }}
            </span>
            <span v-show="showIcons">
              <c-icon :path="mdiShapePolygonPlus"/>
            </span>
            <help-content id="poly-help">{{ t('select.poly.help') }}</help-content>
          </c-button>
          <c-button
            value="json"
            v-help
            v-tooltip="t('select.json.tooltip')">
            <span v-show="width >= Width.SuperCompact">
              {{ t("select.json.label") }}
            </span>
            <span v-show="showIcons">
              <c-icon :path="mdiFileUploadOutline"/>
            </span>
            <help-content id="json-help">
              {{ t('select.json.help') }}
            </help-content>
          </c-button>
          <c-button value="clear" id="trash" v-tooltip="t('select.clear.tooltip')">
            <c-icon :path="mdiCloseBoxMultipleOutline" />
          </c-button>
        </c-tab-buttons>
        <div id="json-button" v-if="selectMode == 'json'">
          <c-button @click="fileInput?.click()">
            {{ t("select.json.open" + (width < Width.SuperCompact ? "_compact":"")) }}
            <input
              ref="fileInput"
              type="file"
              accept=".json,.geojson"
              style="display: none"
              @change="onFileSelected"
            />
          </c-button>
        </div>
      </c-tab-item>
      <c-tab-item value="inspect">
        <div id="inspect-warning" v-if="dataHidden">
          <c-alert :type="CAlertType.Info">
            <span :class="{ pop: popAlert }">
              {{ t("inspect.zoom.message") }}
            </span>
          </c-alert>
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
      "tooltip": "Pan the map view",
      "help": "Click and drag to move the map view. Zoom in and out by scrolling or using the zoom buttons. Alternatively, double-click to zoom in and double-click while holding Shift to zoom out. To zoom into an area, hold Shift while dragging.",
    },
    "select": {
      "label": "Select map sheets",
      "label_compact": "Select",
      "tooltip": "Select map sheets for download",
      "disabled": "Selection tools are available for datasets with more than one map sheet",
      "basic": {
        "label": "Basic",
        "label_compact": "Basic",
        "tooltip": "Select map sheets by clicking or by dragging a rectangle",
        "help": "Select map sheets by clicking or drag a rectangular selection. Clicking a selected map sheet deselects it.",
      },
      "poly": {
        "label": "Polygon",
        "tooltip": "Draw a polygon to select map sheets",
        "help": "Click to start drawing a polygon to select map sheets. To close the polygon either click at the starting point or double-click.",
      },
      "json": {
        "label": "GeoJSON",
        "tooltip": "Select map sheets using GeoJSON file",
        "help": "Load GeoJSON to select overlapping map sheets. Use the Upload button or drag and drop GeoJSON file onto the map view. 'https://geojson.io' is an interactive editor for creating and adjusting GeoJSON data.",
        "open": "Upload a GeoJSON file",
        "open_compact": "Upload GeoJSON",
      },
      "clear": {
        "tooltip": "Deselect all map sheets",
      },
    },
    "inspect": {
      "label": "Inspect",
      "tooltip": "Click the map to display feature info",
      "disabled": "The selected dataset does not have feature info",
      "help": "Click the map to display feature info. This displays attribute values for vector data and pixel values for raster data.",
      "zoom": {
        "title": "Zoom in to see data",
        "message": "To use the inspect tool, zoom in until you see the data layer.",
        "button": "Click here to zoom in to necessary level",
      },
    },
  },
  "fi": {
    "move": {
      "label": "Liiku",
      "tooltip": "Liikuta karttanäkymää",
      "help": "Napsauta ja vedä karttanäkymää liikuttaaksesi sitä. Zoomaa sisään ja ulos vierittämällä tai käyttämällä zoomauspainikkeita. Voit myös zoomata sisään kaksoisnapsautuksella ja ulos kun Shift on painettuna. Pidä Shift painettuna raahauksen aikana zoomataksesi alueelle.",
    },
    "select": {
      "label": "Valitse karttalehtiä",
      "label_compact": "Valitse",
      "tooltip": "Valitse karttalehtiä lataukseen",
      "disabled": "Valintatyökalut ovat käytössä aineistoille, joilla on useampi kuin yksi karttalehti",
      "basic": {
        "label": "Perusvalinta",
        "label_compact": "Perus",
        "tooltip": "Valitse karttalehtiä napsauttamalla tai raahaa suorakulmainen valinta",
        "help": "Valitse karttalehtiä napsauttamalla tai raahaa suorakulmainen valinta. Napstauttamalla valittua karttalehteä poistat sen valinnasta.",
      },
      "poly": {
        "label": "Polygoni",
        "tooltip": "Valitse karttalehtiä monikulmiovalinnalla",
        "help": "Napsauta aloittaaksesi monikulmion piirtämisen karttalehtien valitsemiseksi. Sulje monikulmio joko napsauttamalla aloituspistettä tai kaksoisnapsauttamalla.",
      },
      "json": {
        "label": "GeoJSON",
        "tooltip": "Valitse karttalehtiä GeoJSON-tiedoston avulla",
        "help": "Valitse karttalehtiä GeoJSON-tiedoston avulla. Käytä Valitse-painiketta tai pudota GeoJSON-tiedostoja karttanäkymään. 'https://geojson.io' on interaktiivinen käyttöliittymä GeoJSON datan luomiseen ja muokkaamiseen.",
        "open": "Valitse GeoJSON-tiedosto",
        "open_compact": "Valitse GeoJSON",
      },
      "clear": {
        "tooltip": "Poista kaikki karttalehdet valinnasta",
      },
    },
    "inspect": {
      "label": "Tarkastele",
      "tooltip": "Napsauta karttaa näyttääksesi kohdetietoja",
      "disabled": "Valitulla aineistolla ei ole kohdetietoja",
      "help": "Napsauta karttaa näyttääksesi kohdetietoja. Tämä näyttää vektoriaineiston ominaisuustiedot ja rasteriaineiston pikseliarvot",
      "zoom": {
        "title": "Zoomaa sisään nähdäksesi datan",
        "message": "Käyttääksesi tarkastelutyökalua, zoomaa sisään kunnes näet datan esikatselun.",
        "button": "Napsauta tästä zoomataksesi sopivalle tasolle",
      },
    },
  },
}
</i18n>

<style scoped>


c-tabs {
  --c-tab-buttons-background-color-active: var(--c-primary-600);
  --c-tab-buttons-border-color: var(--c-primary-800);
  width: 480px;
  height: 100%;
  z-index: 1;
}

c-tab-item {
  color: white;

  #json-button {
    --c-button-background-color: var(--c-info-600);
    --c-button-background-color-hover: var(--c-info-400);
    margin-top: 1em;
    text-align: right;
  }

}

c-button {
  --_c-button-font-size: 17px;
}

c-button#trash {
  color: var(--c-error-500);
  max-width: 40px;
  min-width: 0;
  --_c-button-min-width: 0;
}

c-link {
  --c-link-color: var(--c-accent-400);
}

c-link#zoom {
  --c-link-color: var(--c-info-600);
}

.c-button--disabled {
  /* a hack for disabled button tooltips */
  pointer-events: auto;
  transition: background-color 9999999s;
  color: var(--c-tertiary-300);
}

#inspect-warning {
  background-color: white;
  border-radius: 10px;
}

@keyframes pop {
  0%   { transform: scale(1); }
  50%  { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.pop {
  animation: pop 180ms ease-out;
}

</style>
