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
  <div class="textual">
    <component :is="Content" />
  </div>
</template>

<style>
/*
Plaintext page styling, designed for legibility. You might also want to check main.css.
Do not make this block scoped, so it can reach child components as-is.
*/

.textual {

  ::marker {
    color: var(--c-tertiary-700);
  }

  p {
    margin-bottom: 20px;
  }

  p, c-alert, li {
    line-height: 1.5;
  }

  ul, ol {
    display: flex;
    flex-direction: column;
    gap: .2em;

    ul {
      margin-top: .2em;
    }
  }

  --c-text-body: var(--c-tertiary-800);

  h1, h2, h3, h4, h5, h6,
  p, i,
  ul, ol,
  c-alert span {
    color: var(--c-text-body);
  }

  c-list {
    --c-list-item-text-color: var(--c-text-body);

    c-list-item-title {
      font-weight: bold;
    }
  }

  code {
    font-size: large;
  }

}
</style>
