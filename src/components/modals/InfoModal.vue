<script setup lang="ts">
import { useDatasets } from '@/composables/datasets';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { currentDataset } = useDatasets()
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
              <a :href="link.url" target="_blank">{{ link.title }}</a>
            </li>
          </ul>
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
    "close": "Close",
  },
  "fi": {
    "title": "Tietoa aineistosta",
    "files": "Tiedostot, jotka kuvaavat tätä aineistoa",
    "close": "Sulje",
  },
}
</i18n>
