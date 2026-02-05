<script setup lang="ts">
import { getLocalizedPage } from '@/modules/locale'
import { computed, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// This view template is a generic approach on lazy-loading translated
// view content. It uses the 'name' router parameter with the current locale
// to determine which view content file to display. For more detail, see:
// * router.ts
// * modules/locale.ts: getLocalizedPage() and `pages`

const Content = computed(() => {
  if (!route.name) {
    throw new Error('Route is missing the name parameter')
  }
  const loader = getLocalizedPage(route.name as string)
  return defineAsyncComponent(async () => await loader())
})
</script>

<template>
  <component :is="Content" />
</template>
