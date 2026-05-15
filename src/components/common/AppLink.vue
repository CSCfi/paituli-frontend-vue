<!--
Use this component for all links instead of <router-link> or <c-link>, for consistency.
The component tries to automatically determine if the link leads to an external site and
in such case decorates the link and ensures it opens in a new tab, all while respecting vue routing.
You can enforce this behavior on or off using the the new-tab prop.
-->
<script setup lang="ts">
import { computed } from 'vue'
import { mdiOpenInNew } from '@mdi/js'
import { useRouter } from 'vue-router';

const router = useRouter()

const {
  to,
  newTab = undefined,
  useRouting,
  cButton,
} = defineProps<{
  to: string
  newTab?: boolean
  useRouting?: boolean
  cButton?: boolean | Record<string, unknown>
}>()

const buttonMode = computed(() => cButton as boolean)
const target = computed(() => (newTab ?? isExternal.value) ? '_blank' : undefined)

const isExternal = computed(() =>
  /^https?:\/\//.test(to) ||
  to.startsWith('mailto:') ||
  to.startsWith('tel:')
)

// We use routing for target href unless it's deemed external,
// or if we explicitly want to use the router
const resolvedHref = computed(() => {
  if (isExternal.value && !useRouting) return to
  return router.resolve(to).href
})

// Determines props for c-button mode
const buttonProps = computed(() => {
  const p = cButton
  // If provided prop is falsy or strictly true, use default props
  if (!p || buttonMode.value == false || p === true) return {}
  return p // Otherwise we have a record which defines the props
})

// Custom click handler for router-links to ensure we
// let browser handle new tab / modified clicks
function onClick(navigate: (e?: MouseEvent) => void, e: MouseEvent) {
  if (
    target.value === '_blank' ||
    e.ctrlKey ||
    e.metaKey ||
    e.shiftKey ||
    e.button !== 0
  ) return
  e.preventDefault()
  navigate()
}

</script>

<template>
  <!-- c-button mode -->
  <c-button
    v-if="buttonMode"
    v-bind="buttonProps"
    :href="resolvedHref"
    :target="target">
    <slot />
    <c-icon v-if="target"
            :path="mdiOpenInNew"
            size="16" />

  </c-button>

  <!-- link mode -->
  <c-link
    v-else-if="isExternal"
    :href="resolvedHref"
    :target="target">
    <slot />
    <c-icon v-if="target"
            class="tab-icon"
            :path="mdiOpenInNew"
            size="14" />
  </c-link>

  <!-- In-app (SPA) navigation -->
  <router-link
    v-else
    :to="to"
    custom
    v-slot="{ href, navigate }">
    <c-link
      :href="href"
      :target="target"
      @click="onClick(navigate, $event)">
      <slot />
      <c-icon v-if="target"
              class="tab-icon"
              :path="mdiOpenInNew"
              size="14" />

    </c-link>
  </router-link>
</template>
