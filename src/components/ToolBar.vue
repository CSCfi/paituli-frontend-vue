<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import {
  mdiCheckboxMultipleMarkedOutline,
  mdiCursorDefaultOutline,
  mdiCursorMove,
  mdiFileUploadOutline,
  mdiMagnifyPlus,
  mdiOpenInNew,
  mdiShapePolygonPlus,
  mdiTarget,
  mdiTrashCanOutline
} from '@mdi/js';

import OlMap from 'ol/Map.js'
import DragPan from 'ol/interaction/DragPan'
import { useI18n } from 'vue-i18n';

import { dataLayerMaxResolution, dataSource, tileLoadCallback } from '@/modules/layers';
import { autoSelectSheets, selectedOlFeatures, } from '@/modules/selection';
import { fileSelectedCallback, selectMode, toolbarMode } from '@/modules/controls';
import { vTooltip } from '@/directives/tooltip';
import { vHelp } from '@/directives/help';
import { currentLocale } from '@/modules/locale';
import HelpContent from './HelpContent.vue';
import { CAlertType } from '@cscfi/csc-ui';
import { currentDataset } from '@/modules/datasets';

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
  // Set callback for data tile rendering updates
  tileLoadCallback.value = () => {
    props.map.render()
  }
})

watch(dataSource, () => {
  // Reset selection to 'move' in case inspect becomes unavailable
  toolbarMode.value = 'move'
})

watch(toolbarMode, (mode) => {
  // When tool mode changes, we only allow drag-pan in 'move'
  dragPan?.setActive(mode == 'move')

  // Update cursor
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

// GeoJSON file handling
const fileInput = ref<HTMLInputElement | null>(null)
const onFileSelected = (event: Event) => {
  const files = (event.target as HTMLInputElement)?.files
  if (!files) return
  for (const file of files) fileSelectedCallback.value?.(file)
}

// For the inspect mode button to take us to where data preview loads.
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

</script>

<template>
  <c-tabs v-model="toolbarMode"
          v-control
          :style="{ display: !currentDataset ? 'none': ''}"
          disable-animation>
    <c-tab-buttons mandatory>
      <c-button
        value="move"
        v-help="t('move.help')"
        v-tooltip="t('move.tooltip')">
        {{ t("move.label") }}<c-icon :path="mdiCursorMove"/>
      </c-button>
      <c-button
        value="select"
        :disabled="autoSelectSheets"
        v-help="`#${selectMode}-help`"
        v-tooltip="!autoSelectSheets ? t('select.tooltip') : t('select.disabled')">
        {{ t("select.label") }}<c-icon :path="mdiCheckboxMultipleMarkedOutline"/>
      </c-button>
      <c-button
        value="inspect"
        v-help="t('inspect.help')"
        :disabled="currentDataset && !dataSource"
        v-tooltip="dataSource ? t('inspect.tooltip') : t('inspect.disabled')">
        {{ t("inspect.label") }}<c-icon :path="mdiTarget"/>
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
            {{ t("select.basic.label") }}<c-icon :path="mdiCursorDefaultOutline"/>
            <help-content id="basic-help">{{ t('select.basic.help') }}</help-content>
          </c-button>
          <c-button
            value="poly"
            v-help
            v-tooltip="t('select.poly.tooltip')">
            {{ t("select.poly.label") }}<c-icon :path="mdiShapePolygonPlus"/>
            <help-content id="poly-help">{{ t('select.poly.help') }}</help-content>
          </c-button>
          <c-button
            value="json"
            v-help
            v-tooltip="t('select.json.tooltip')">
            {{ t("select.json.label") }}<c-icon :path="mdiFileUploadOutline"/>
            <help-content id="json-help">
              <i18n-t keypath="select.json.help">
                <c-link
                  :href="`https://${currentLocale}.wikipedia.org/wiki/GeoJSON`"
                  target="_blank">
                  GeoJSON<c-icon :path="mdiOpenInNew" size="18" />
                </c-link>
                <c-link href="https://geojson.io/" target="_blank">
                  geojson.io<c-icon :path="mdiOpenInNew" size="18" />
                </c-link>
              </i18n-t>
            </help-content>
          </c-button>
          <c-button value="clear" id="trash" v-tooltip="t('select.clear.tooltip')">
            <c-icon :path="mdiTrashCanOutline" />
          </c-button>
        </c-tab-buttons>
        <div id="json" v-if="selectMode == 'json'">
          <c-button @click="fileInput?.click()">
            {{ t("select.json.open") }}
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
            <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
            <div slot="title">{{ t("inspect.zoom.title") }}</div>
            {{ t("inspect.zoom.message") }}
            <c-link id="zoom" href="#" @click.prevent='zoomToData'>
              <c-icon :path="mdiMagnifyPlus"/>
              {{ t("inspect.zoom.button") }}
            </c-link>
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
      "help": "Click and drag to move the map view. Hold Shift while doing so to zoom into a region. You can zoom in and out by scrolling and using the zoom buttons.",
    },
    "select": {
      "label": "Select",
      "tooltip": "Select mapsheets for download",
      "disabled": "Selection tools are available for datasets with more than one map sheet",
      "basic": {
        "label": "Basic",
        "tooltip": "Select mapsheets by clicking or drawing a rectangle",
        "help": "Select single map sheets by clicking or drag a rectangular selection to select multiple map sheets. Clicking selected sheets de-selects them.",
      },
      "poly": {
        "label": "Polygon",
        "tooltip": "Select mapsheets using a polygon selection",
        "help": "Click to start drawing a shape to select multiple map sheets.",
      },
      "json": {
        "label": "GeoJSON",
        "tooltip": "Select mapsheets using a file",
        "help": "Load {0} to select intersecting map sheets. Use the button below or drag and drop JSON files onto the map view. {1} hosts an interactive editor for creating and adjusting GeoJSON data.",
        "open": "Open file dialog",
      },
      "clear": {
        "label": "Clear",
        "tooltip": "Clear all mapsheets from selection",
        "help": "Remove all map sheets from selection. Click the button again to confirm.",
      },
    },
    "inspect": {
      "label": "Inspect",
      "tooltip": "Inspect feature information",
      "disabled": "Selected dataset does not have inspectable feature information",
      "help": "Click highlighted map features to display feature information.",
      "zoom": {
        "title": "Data not visible",
        "message": "To use the inspect tool, zoom in until you see the data layer preview.",
        "button": "Click here to zoom in to necessary level",
      },
    },
  },
  "fi": {
    "move": {
      "label": "Liiku",
      "tooltip": "Liikuta karttanäkymää",
      "help": "Napsauta ja vedä karttanäkymää liikuttaaksesi sitä. Pidä Shift painettuna, zoomataksesi alueelle. Voit zoomata sisään ja ulos vierittämällä tai käyttämällä zoomauspainikkeita.",
    },
    "select": {
      "label": "Valitse",
      "tooltip": "Valitse karttalehtiä lataukseen",
      "disabled": "Valintatyökalut ovat käytössä aineistoille, joilla on useampi kuin yksi karttalehti",
      "basic": {
        "label": "Tavallinen",
        "tooltip": "Valitse karttalehtiä napsauttamalla tai suorakulmiolla",
        "help": "Valitse yksittäisiä karttalehtiä napsauttamalla tai raahaa suorakulmainen valinta valitaksesi useita karttalehtiä. Valittuja lehtiä napsauttamalla poistat ne valinnasta.",
      },
      "poly": {
        "label": "Polygoni",
        "tooltip": "Valitse karttalehtiä monikulmiovalinnalla",
        "help": "Napsauta aloittaaksesi monikulmion piirtämisen useiden karttalehtien valitsemiseksi.",
      },
      "json": {
        "label": "GeoJSON",
        "tooltip": "Valitse karttalehtiä tiedoston avulla",
        "help": "Lataa {0} -tiedosto valitaksesi leikkaavat karttalehdet. Käytä alla olevaa painiketta tai pudota JSON-tiedostoja karttanäkymään. {1} tarjoaa interaktiivisen käyttöliittymän GeoJSON datan luomiseen ja muokkaamiseen.",
        "open": "Avaa tiedostonvalinta",
      },
      "clear": {
        "label": "Poista",
        "tooltip": "Poista kaikki karttalehdet valinnasta",
        "help": "Poista kaikki karttalehdet valinnasta. Vahvista painamalla uudelleen.",
      },
    },
    "inspect": {
      "label": "Tarkastele",
      "tooltip": "Tarkastele aineiston kohdetietoja",
      "disabled": "Valitulla aineistolla ei ole tarkasteltavia kohdetietoja",
      "help": "Napsauta korostettuja karttakohteita näyttääksesi kohteen tiedot.",
      "zoom": {
        "title": "Data ei näkyvissä",
        "message": "Käyttääksesi tarkastelutyökalua, zoomaa kunnes näet datan esikatselun.",
        "button": "Napsauta tästä zoomataksesi sopivalle tasolle",
      },
    },
  },
}
</i18n>

<style scoped>


c-tabs {
  --c-tab-buttons-background-color-active: var(--c-primary-500);
  width: 450px;
  z-index: 1;
}

c-tab-item {
  color: white;

  #json {
    --c-button-background-color: var(--c-secondary-500);
    margin-top: 1em;
    text-align: center;
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
  --c-link-color: var(--c-info-500);
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

</style>
