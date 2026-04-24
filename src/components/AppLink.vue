<!--
Use this component for all app links instead of
<router-link> or <c-link>, for consistency. Using the new-tab prop
automatically decorates the link and ensures routing is respected
-->
<script setup lang="ts">
import { computed } from 'vue'
import { mdiOpenInNew } from '@mdi/js'
import { useRouter } from 'vue-router';

const router = useRouter()

const props = defineProps<{
  to: string
  newTab?: boolean
  cButton?: boolean | Record<string, unknown>
}>()

const buttonMode = computed(() => props.cButton as boolean)
const target = computed(() => props.newTab ? '_blank' : undefined)

const isExternal = computed(() =>
  /^https?:\/\//.test(props.to) ||
  props.to.startsWith('mailto:') ||
  props.to.startsWith('tel:')
)

// Determines props for c-button mode
const buttonProps = computed(() => {
  const p = props.cButton
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
    :href="router.resolve(props.to).href"
    :target="target">
    <slot />
    <c-icon v-if="newTab" :path="mdiOpenInNew" size="18" />
  </c-button>

  <!-- link mode -->
  <c-link
    v-else-if="isExternal"
    :href="router.resolve(props.to).href"
    :target="target">
    <slot />
    <c-icon v-if="newTab" :path="mdiOpenInNew" size="18" />
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
      <c-icon v-if="newTab" :path="mdiOpenInNew" size="18" />
    </c-link>
  </router-link>
</template>
