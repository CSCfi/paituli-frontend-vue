<script setup lang="ts">
import { mdiOpenInNew } from '@mdi/js';
import { URLS } from '@/shared/constants'
import { useDatasets } from '@/composables/datasets'
const { currentDataset } = useDatasets()

const props = defineProps<{ desc: string | undefined }>()
</script>


<template>
  <div v-if="currentDataset?.meta">
    <p>
      You can view more metadata on
      <c-link :href="URLS.ETSIN_METADATA_BASE + currentDataset.meta" target="_blank">
        Fairdata Etsin<c-icon :path="mdiOpenInNew" size="18" />
      </c-link>
    </p>
  </div>
  <div v-if="props.desc"
       class="metadata-description"
       v-html="props.desc"></div>
  <div v-else>Metadata is not available.</div>
</template>

<style scoped>
.metadata-description {
  margin-bottom: 10px;
}
</style>
