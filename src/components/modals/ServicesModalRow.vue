<script setup lang="ts">
import { copyToClipboard } from '@/shared/util';
import { mdiClipboardMultipleOutline, mdiOpenInNew } from '@mdi/js'
import { useI18n } from 'vue-i18n';

const { t } = useI18n()

interface Props {
  label: string
  text?: string | number
  showCopy?: boolean
  showOpen?: boolean
  unavailable?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  showCopy: true,
  showOpen: false,
  unavailable: false,
})

</script>


<template>
  <tr :class="{ 'unavailable': unavailable }">
    <td>{{ label }}</td>
    <td v-if="unavailable">{{ t("not_available") }}</td>
    <td v-else>{{ text }}</td>
    <td>
      <div class="buttons">
        <c-button
          v-if="showOpen && !unavailable"
          ghost
          size="small"
          :href="props.text">
          {{ t('open') }}
          <c-icon :path="mdiOpenInNew" size="18" />
        </c-button>
        <c-button
          v-if="showCopy && !unavailable && props.text"
          ghost
          size="small"
          @click="copyToClipboard(props.text.toString())">
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
