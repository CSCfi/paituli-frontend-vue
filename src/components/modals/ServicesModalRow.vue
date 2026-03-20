<script setup lang="ts">
import { copyToClipboard } from '@/shared/util';
import { mdiClipboardMultipleOutline, mdiOpenInNew } from '@mdi/js'
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n()

interface Props {
  label: string
  text: string | number
  showCopy?: boolean
  showOpen?: boolean
  unavailable?: boolean
  trimHttp?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  showCopy: true,
  showOpen: false,
  unavailable: false,
  trimHttp: true,
})

// Removes the protocol from an url (everything before //), if present
function trimUrl(text: string) {
  return text.replace(/^https?:/, '')
}

const trimmedText = computed(() => {
  const text = props.text?.toString()
  return props.trimHttp ? trimUrl(text) : text
})

</script>

<template>
  <tr :class="{ 'unavailable': unavailable }">
    <td>{{ label }}</td>
    <td v-if="unavailable">{{ t("not_available") }}</td>
    <td v-else>{{ trimmedText }}</td>
    <td>
      <div class="buttons">
        <c-button
          v-if="showOpen && !unavailable"
          ghost
          size="small"
          :href="props.text">
          <!-- href should be naturally untrimmed -->
          {{ t('open') }}
          <c-icon :path="mdiOpenInNew" size="18" />
        </c-button>
        <c-button
          v-if="showCopy && !unavailable"
          ghost
          size="small"
          @click="copyToClipboard(trimmedText)">
          {{ t('copy') }}
          <c-icon :path="mdiClipboardMultipleOutline" size="18" />
        </c-button>
      </div>
    </td>
  </tr>
</template>

<i18n>
{
  "en": {
    "copy": "Copy",
    "open": "Open",
    "not_available": "Not available",
  },
  "fi": {
    "copy": "Kopioi",
    "open": "Avaa",
    "not_available": "Ei saatavilla",
  },
}
</i18n>

<style scoped>
.c-button--ghost {
  c-icon {
    --c-icon-color: var(--c-primary-600);
  }
}
.buttons {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 0.5rem;
}
table.c-table .unavailable td
{
  color: var(--c-tertiary-300);
}
</style>
