<!--
A button of the map's button column, which opens its slot content as a menu.
-->
<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { mdiClose } from '@mdi/js'

defineProps<{ icon: string, tooltip: string }>()

const { t } = useI18n()

const open = ref(false)
const el = ref<HTMLElement | null>(null)

// Close menu when clicking outside of it
function closeHandler(e: PointerEvent) {
  if (el.value && !e.composedPath().includes(el.value)) open.value = false
}
document.addEventListener('pointerdown', closeHandler)
onBeforeUnmount(() => document.removeEventListener('pointerdown', closeHandler))

</script>

<template>
  <div ref="el" :class="{ open }">
    <button
      type="button"
      @click="open = !open"
      :key="`${open}`"
      v-tooltip="open ? t('close') : tooltip">
      <c-icon :path="open ? mdiClose : icon" size="27px" />
    </button>
    <div v-if="open" class="menu">
      <slot />
    </div>
  </div>
</template>

<i18n>
{
  "en": {
    "close": "Close",
  },
  "fi": {
    "close": "Sulje",
  },
}
</i18n>

<style scoped>

button {
  all: unset;
  cursor: pointer;
  display: inline-flex;
}

c-icon {
  color: var(--c-primary-600);
  padding: .15em;
}

/* Draw an open menu over the other buttons */
.open {
  z-index: 1;

  button {
    background-color: var(--c-primary-800);

    c-icon {
      color: var(--c-primary-100)
    }
  }
}

.menu {
  position: absolute;
  width: 15em;
  right: 0;
  padding: 1em;
  z-index: -1;

  border-radius: 1em;
  border-top-right-radius: .3rem;
  color: var(--c-primary-100);
  background-color: var(--c-primary-700);
}

</style>
