<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps({
  text: { type: String, required: true }
});

const show = ref(false);
</script>

<template>
  <div class="tooltip-wrapper" @mouseenter="show = true" @mouseleave="show = false">
    <slot />
    <div v-if="show" class="tooltip">
      {{ props.text }}
    </div>
  </div>
</template>

<style scoped>
.tooltip-wrapper {
  position: relative;
  display: inline-block;
}

.tooltip {
  position: absolute;
  bottom: 100%;       /* appear above */
  left: 0;            /* align left edge of tooltip with parent */
  margin-bottom: 4px;

  background: #333;
  color: #fff;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  white-space: nowrap;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
  z-index: 10;
}

</style>
