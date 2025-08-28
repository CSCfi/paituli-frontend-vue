<script setup lang="ts">
import { useControls } from '@/composables/controls'
import { useSources } from '@/composables/sources'

const { indexLayerSource, dataLayerSource } = useSources();
const controls = useControls();
</script>

<template>
  <c-switch v-model="controls.backgroundVisible.value" v-control>
    Show background map
  </c-switch>
  <c-switch v-model="controls.muncipalitiesVisible.value" v-control>
    Show muncipalities layer
  </c-switch>
  <c-switch v-model="controls.catchmentVisible.value" v-control>
    Show catchment areas layer
  </c-switch>
  <c-switch v-model="controls.indexVisible.value" :disabled="!indexLayerSource" v-control>
    Show index layer
  </c-switch>
  <c-switch v-model="controls.dataVisible.value" :disabled="!dataLayerSource" v-control>
    Show data layer
  </c-switch>
</template>

<style scoped>
c-switch {
  --c-switch-border-color: var(--c-primary-400);
  --c-switch-handle-color: var(--c-primary-200);
  --c-switch-slider-color: var(--c-primary-700);
  --c-switch-border-color-active: var(--c-primary-100);
  --c-switch-handle-color-active: var(--c-primary-100);
  --c-switch-slider-color-active: var(--c-secondary-500);
  --c-switch-slider-color-disabled: var(--c-primary-700);
  --c-switch-border-color-disabled: var(--c-primary-600);
  padding-top: 15px;
  width: 100%;
}
</style>