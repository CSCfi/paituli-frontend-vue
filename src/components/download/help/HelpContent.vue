<script setup lang="ts">

// The label tells what the contents are about, shown in the help box header
defineProps<{ label: string }>()

</script>

<template>
  <!-- An intermediate container for rich help box content -->
  <div class="help-content" :data-label="label">
    <slot />
  </div>
</template>

<style scoped>

.help-content {
  /* Separate htlp contents are displayed by the v-help directive */
  display: none !important;
}
</style>
