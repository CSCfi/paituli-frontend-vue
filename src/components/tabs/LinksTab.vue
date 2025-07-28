<script setup lang="ts">
import { URLS } from '@/shared/constants'
import { useDatasets } from '@/composables/datasets'

const { currentDataset } = useDatasets()

</script>

<template>
  <div v-if="currentDataset?.meta" class="metadata-info-label">
    View more metadata:
    <a :href="`${URLS.ETSIN_METADATA_BASE}${currentDataset.meta}`" target="_blank">
      {{ URLS.ETSIN_METADATA_BASE + currentDataset.meta }}
    </a>
  </div>

</template>

<style scoped>
.metadata-info-label {
  margin-bottom: 10px;
}
.error {
  color: red;
  font-style: italic;
}
a {
  color: var(--c-info-400);
}
</style>
