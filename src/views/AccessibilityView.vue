<script setup lang="ts">
import { useLocale } from '@/composables/locale';
const { loadLocalizedContent } = useLocale();

const Content = loadLocalizedContent('Accessibility')
</script>

<template>
  <component :is="Content" />
</template>
