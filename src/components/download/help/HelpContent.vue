<script setup lang="ts">

</script>

<template>
  <!-- An intermediate container for rich help box content -->
  <div class="help-content">
    <slot />
  </div>
</template>

<style scoped>

.help-content {
  /* Separate htlp contents are displayed by the v-help directive */
  display: none !important;
}
</style>
