<script setup lang="ts">

const props = defineProps<{ desc: string | undefined }>()
</script>


<template>
  <div v-if="props.desc"
       v-html="props.desc">
  </div>

</template>

