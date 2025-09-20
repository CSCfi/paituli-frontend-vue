<script setup lang="ts">

const props = defineProps<{ desc: string | undefined }>()
</script>


<template>
  <div v-if="props.desc"
       class="metadata-description"
       v-html="props.desc"></div>
  <div v-else>Metadata is not available.</div>
</template>

<style scoped>
.metadata-description {
  margin-bottom: 10px;
  height: 220px;
}
</style>
