<script setup lang="ts">
import { mdiOpenInNew } from '@mdi/js';
import { currentDataset } from '@/modules/datasets';
import { URLS } from '@/shared/constants';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n()

const props = defineProps<{
  desc: string, links: { title: string, url: string }[]
}>()

const showModal = ref(false)
const open = () => {
  showModal.value = true
}

defineExpose({ open })
</script>

<template>

  <c-modal v-model="showModal"
           v-control
           dismissable
           disable-backdrop-blur>
    <c-card>
      <c-card-title>
        {{ t("title") }}
      </c-card-title>

      <c-card-content>
        <strong>{{ currentDataset?.name }} - {{ currentDataset?.org }}</strong>
        <div v-html="props.desc"></div>
        <div v-if="links.length">
          <strong>{{ t("files") }}:</strong>
          <ul class="metadata-links">
            <li v-for="link in props.links" :key="link.url">
              <c-link :href="link.url" target="_blank">{{ link.title }}</c-link>
            </li>
          </ul>
        </div>

        <div v-if="currentDataset?.meta">
          {{ t("metadata") }}
          <c-link :href="URLS.ETSIN_METADATA_BASE + currentDataset.meta" target="_blank">
            {{ t("etsin") }}<c-icon :path="mdiOpenInNew" size="18" />
          </c-link>
        </div>
      </c-card-content>

      <c-card-actions justify="end">
        <c-button @click="showModal = false">
          {{ t("close") }}
        </c-button>
      </c-card-actions>
    </c-card>
  </c-modal>
</template>

<i18n>
{
  "en": {
    "title": "Dataset description",
    "files": "Files describing this dataset",
    "metadata": "Full metadata available at",
    "etsin": "Fairdata Etsin",
    "close": "Close",
  },
  "fi": {
    "title": "Tietoa aineistosta",
    "files": "Tiedostot, jotka kuvaavat tätä aineistoa",
    "metadata": "Täydet metatiedot saatavilla",
    "etsin": "Fairdata Etsimessä",
    "close": "Sulje",
  },
}
</i18n>
