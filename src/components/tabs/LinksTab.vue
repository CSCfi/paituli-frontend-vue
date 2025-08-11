<script setup lang="ts">
import { URLS } from '@/shared/constants'
import { useDatasets } from '@/composables/datasets'
import { mdiOpenInNew } from '@mdi/js';

const { currentDataset } = useDatasets()
</script>

<template>
  <div v-if="currentDataset?.meta">
    <p>
      You can view more metadata on
      <c-link :href="URLS.ETSIN_METADATA_BASE + currentDataset.meta" target="_blank">
        Etsin<c-icon :path="mdiOpenInNew" color="var(--c-primary-100)" size="18" />
      </c-link>
    </p>
  </div>
  <div v-if="currentDataset?.funet">
    <p>
      You can view or download dataset contents using
      <c-link :href="URLS.HTTP_LINKS_BASE+ currentDataset.funet" target="_blank">
        HTTP<c-icon :path="mdiOpenInNew" color="var(--c-primary-100)" size="18" />
      </c-link>
      , FTP or rsync.
      <c-link href="/files" target="_blank">
        Help?<c-icon :path="mdiOpenInNew" color="var(--c-primary-100)" size="18" />
      </c-link>
    </p>
    <VCodeBlock
      :code="URLS.FTP_LINKS_BASE + currentDataset.funet"
      highlightjs
    />
    <VCodeBlock
      :code="'rsync://rsync.nic.funet.fi/ftp/index/geodata/' + currentDataset.funet"
      highlightjs
    />
    <p>
      Names, paths and geometry as
      <c-link :href="URLS.HTTP_LINKS_BASE+ currentDataset.funet" target="_blank">
        Shapefile<c-icon :path="mdiOpenInNew" color="var(--c-primary-100)" size="18" />
      </c-link>
    </p>
  </div>


</template>

<style scoped>
c-link {
  --c-link-color: white;
}
a {
  color: var(--c-info-400);
}
p {
  margin: 0;
  margin-bottom: 10px;
}
</style>