<script setup lang="ts">
import { useControls } from '@/composables/controls';
import { useSources } from '@/composables/sources';
import OlMap from 'ol/Map.js'
import { computed, onMounted, ref, watch } from 'vue';

import { mdiAlert, mdiCrosshairs, mdiCursorMove, mdiSelect } from '@mdi/js';


const { dataLayerMaxResolution, dataLayerSource } = useSources()

const props = defineProps<{ map: OlMap }>()

const viewResolution = ref<number>(0)
const dataHidden = computed(() => viewResolution.value > dataLayerMaxResolution.value )

const { controlMode, selectMode, selectedOlFeatures } = useControls()

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

</script>

<template>
  <c-tabs v-model="controlMode"
          v-control
          borderless
          disable-animation>
    <c-tab-buttons mandatory>
      <c-button value="move">Move <c-icon :path="mdiCursorMove"/></c-button>
      <c-button value="select">Select <c-icon :path="mdiSelect"/></c-button>
      <c-button value="inspect" :disabled="!dataLayerSource">Inspect <c-icon :path="mdiCrosshairs"/></c-button>
    </c-tab-buttons>
    <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
    <c-tab-items slot="items">
      <c-tab-item value="move">
        Click and drag to move the map view. Hold Shift while doing so to zoom into a region.
        You can zoom in and out by scrolling and using the zoom buttons.
      </c-tab-item>
      <c-tab-item value="select">
        <c-tab-buttons v-model="selectMode"
                       v-control
                       mandatory
                       size="small">
          <c-button value="single">Single</c-button>
          <c-button value="multi">Multi</c-button>
          <c-button value="draw">Draw</c-button>
          <c-button @click="clearHandler()" value="clear">Clear</c-button>
        </c-tab-buttons>
        <p v-if="selectMode == 'single'">
          Select single map sheets by clicking. Clicking selected sheets de-selects them.
        </p>
        <p v-if="selectMode == 'multi'">
          Click and drag a rectangular selection to select multiple map sheets.
        </p>
        <p v-if="selectMode == 'draw'">
          Click to start drawing a polygon to select multiple map sheets.
        </p>
        <p v-if="selectMode == 'clear'">
          Remove all map sheets from selection. Click the button again to confirm.
        </p>
      </c-tab-item>
      <c-tab-item value="inspect">
        <div v-if="dataHidden">
          <c-icon :path="mdiAlert"/> To use the inspect tool, zoom in until you see the data layer preview.
        </div>
        <div v-else>
          Click the data layer's features to display its information.
        </div>
      </c-tab-item>
    </c-tab-items>
  </c-tabs>

</template>

<style scoped>
c-tabs {
  --c-tab-buttons-background-color-active: var(--c-primary-400);
}
c-tab-item {
  color: white;
}

</style>
