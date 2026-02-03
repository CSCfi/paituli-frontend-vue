<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useLocale } from '@/composables/locale'

const route = useRoute()
const { loadLocalizedContent } = useLocale()

// This view template is a generic approach on loading localized (translated)
// view content. It uses the 'name' router parameter with the current locale
// to determine which view content file to display. For more detail, see:
// * router/index.ts
// * composables/locale.ts: loadLocalizedContent() and `pages`

const Content = computed(() => {
  if (!route.name) {
    throw new Error('Route is missing the name parameter')
  }
  return loadLocalizedContent(route.name as string).value
})
</script>

<template>
  <component :is="Content" />
</template>
