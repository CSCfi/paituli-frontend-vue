<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import AppLink from '@/components/common/AppLink.vue';
import CopyButton from '@/components/common/CopyButton.vue';

const { t } = useI18n()

interface Props {
  label: string
  text: string | number
  openUrl?: string
  showCopy?: boolean
  showOpen?: boolean
  unavailable?: boolean
  trimHttp?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  showCopy: true,
  showOpen: false,
  unavailable: false,
  trimHttp: false,
})

// Removes the protocol from an url (everything before //), if present
function trimUrl(text: string) {
  return text.replace(/^https?:/, '')
}

// The open button may target a different address than the one shown and
// copied, e.g. an endpoint that needs a format parameter to open in a browser
const openHref = computed(() => props.openUrl ?? props.text.toString())

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
        <app-link
          v-if="showOpen && !unavailable"
          new-tab
          :to="openHref"
          :c-button="{ ghost: true, size: 'small' }">
          <!-- href should be naturally untrimmed -->
          {{ t('open') }}
        </app-link>
        <CopyButton
          v-if="showCopy && !unavailable"
          :text="trimmedText" />
      </div>
    </td>
  </tr>
</template>

<i18n>
{
  "en": {
    "open": "Open",
    "not_available": "Not available",
  },
  "fi": {
    "open": "Avaa",
    "not_available": "Ei saatavilla",
  },
}
</i18n>

<style scoped>
.buttons {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
table.c-table .unavailable td
{
  color: var(--c-tertiary-400);
}
table.c-table td {
  padding: .75em;
}
</style>
