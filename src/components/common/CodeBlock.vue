<script setup lang="ts">
import { computed } from 'vue';

const { content } = defineProps<{ content: string }>()

const normalized = computed(() => {
  return content.trim()
    // Append indentation after explicit "\ + newline"
    .replace(/\\\n/g, '\\<br>&nbsp;&nbsp;&nbsp;&nbsp;')
    .replace(/\n/g, '<br>') // regular newlines
})
</script>

<template>
  <pre>
    <code v-html="normalized"></code>
  </pre>
</template>

<style scoped>
pre {
  background-color: var(--c-info-900);
  color: var(--c-info-100);
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
  font-family: monospace, monospace;
  font-size: 0.9rem;
  line-height: 1.4;
  word-break: break-word;
  white-space: collapse;
}
</style>