<!--
Use this component for all app links instead of
<router-link> or <c-link>, for consistency. Using the new-tab prop
automatically decorates the link and ensures SPA navigation is respected
-->
<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { mdiOpenInNew } from '@mdi/js'

const router = useRouter()

const props = defineProps<{
  to: string
  newTab?: boolean
  cButton?: boolean | Record<string, unknown>
}>()

const buttonMode = computed(() => props.cButton as boolean)
const target = computed(() => props.newTab ? '_blank' : undefined)
const rel = computed(() => props.newTab ? 'noopener noreferrer' : undefined)

// We manually resolve the href using router if the link
// does not seem to be external, as c-button and c-link
// cannot use <router-link> to do the resolving.
const resolvedHref = computed(() => {
  if (isExternal.value) return props.to
  return router.resolve(props.to).href
})
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

</script>

<template>
  <!-- c-button mode -->
  <c-button
    v-if="buttonMode"
    v-bind="buttonProps"
    :href="resolvedHref"
    :target="target"
    :rel="rel">
    <slot />
    <c-icon v-if="newTab" :path="mdiOpenInNew" size="18" />
  </c-button>

  <!-- External link mode -->
  <c-link
    v-else-if="isExternal"
    :href="resolvedHref"
    :target="target"
    :rel="rel">
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
      @click="navigate"
      :href="href"
      :target="target"
      :rel="rel">
      <slot />
      <c-icon v-if="newTab" :path="mdiOpenInNew" size="18" />
    </c-link>
  </router-link>
</template>
