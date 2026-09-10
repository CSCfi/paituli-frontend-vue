<!--
Small ghost button that copies the given text to the clipboard.
Use for endpoint addresses, paths and other values the user is expected to
paste into another tool. Pass `label` to name the value being copied,
e.g. "Copy PID".
-->
<script setup lang="ts">
import { copyToClipboard } from '@/shared/util';
import { mdiClipboardMultipleOutline } from '@mdi/js'
import { useI18n } from 'vue-i18n';

const { text, label } = defineProps<{ text: string, label?: string }>()

const { t } = useI18n()
</script>

<template>
  <c-button ghost size="small" @click="copyToClipboard(text)">
    {{ label ?? t('copy') }}
    <c-icon :path="mdiClipboardMultipleOutline" size="18" />
  </c-button>
</template>

<i18n>
{
  "en": {
    "copy": "Copy",
  },
  "fi": {
    "copy": "Kopioi",
  },
}
</i18n>

<style scoped>
/* The button always trails a value, so it carries its own spacing */
c-button {
  margin-top: 0.2em;
  margin-bottom: 0.2em;
  margin-left: 0.5em;
}
c-icon {
  --c-icon-color: var(--c-primary-600);
}
</style>
