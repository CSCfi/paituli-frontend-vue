<script setup lang="ts">
import { ref, watch } from 'vue'
import { useDatasets } from '@/composables/datasets'

import InfoTab from '@/components/tabs/InfoTab.vue'
import InfoModal from './modals/InfoModal.vue'
import ServicesTab from '@/components/tabs/ServicesTab.vue'
import type { Dataset } from '@/shared/types'
import { URLS } from '@/shared/constants'
import SettingsTab from './tabs/SettingsTab.vue'
import { type MetadataParse, parseMetadata } from '@/shared/util'
import { mdiOpenInNew } from '@mdi/js';
import { useToasts } from '@/composables/toasts'
import { CToastType } from '@cscfi/csc-ui'

const { currentDataset } = useDatasets()
const { addToast } = useToasts()

// Parsed dataset metadata
const parsedMetadata = ref<MetadataParse | null>(null);

// Modals and tab selection
type MenuTab = 'infotab' | 'servicestab' | 'settingstab'
const tab = ref<MenuTab>('infotab')
const infoModal = ref();

// When selected dataset changes, fetch its metadata and parse it
watch(currentDataset, async (dataset: Dataset | null) => {
  if (!dataset || !dataset.meta) return
  try {
    const response = await fetch(`${URLS.ETSIN_METADATA_JSON_BASE}${dataset.meta}`)
    if (!response.ok) throw new Error(`HTTP code ${response.status}`)
    parsedMetadata.value = parseMetadata(await response.json());
  } catch (err) {
    addToast({
      type: CToastType.Warning,
      message: 'Failed to load dataset metadata. If the problem persists, please try again later.'
    })
    console.error(`Failed to parse Etsin metadata: ${(err as Error).message}`)
  }
})

</script>

<template>
  <div v-if="!currentDataset" class="suggestion">
    <p>Please select a Producer to start browsing available datasets.</p>
  </div>
  <div v-else class="extra">
    <c-tabs v-model="tab" v-control>
      <c-tab value="infotab">Info</c-tab>
      <c-tab value="servicestab">Services</c-tab>
      <c-tab value="settingstab">Settings</c-tab>

      <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
      <c-tab-items slot="items">
        <c-tab-item value="infotab">
          <div class="faded">
            <InfoTab :desc="parsedMetadata?.description" />
          </div>
          <div v-if="parsedMetadata">
            <InfoModal :desc="parsedMetadata.description"
                       :links="parsedMetadata.links"
                       ref="infoModal" />
          </div>
          <c-button outlined class="read-more" @click="infoModal?.open()">
            Read more
          </c-button>
          <div v-if="currentDataset?.meta">
            <p>
              Full metadata is available at
              <c-link :href="URLS.ETSIN_METADATA_BASE + currentDataset.meta" target="_blank">
                Fairdata Etsin<c-icon :path="mdiOpenInNew" size="18" />
              </c-link>
            </p>
          </div>
        </c-tab-item>
        <c-tab-item value="servicestab">
          <ServicesTab />
        </c-tab-item>
        <c-tab-item value="settingstab">
          <SettingsTab />
        </c-tab-item>
      </c-tab-items>
    </c-tabs>
  </div>

</template>

<style scoped>
.extra {
  color: var(--c-white);
}
c-tabs {
  --c-tab-background-color-hover: var(--c-primary-400);
  --c-tab-text-color: white;
  --c-tabs-indicator-color: var(--c-primary-100);
}
c-tab-item {
  height: 270px;
  color: var(--c-primary-200);
}

.faded {
  mask-image: linear-gradient(to bottom, black 50%, transparent 100%);
  -webkit-mask-image: linear-gradient(to bottom, black 50%, transparent 100%);
}
.read-more {
  position: absolute;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
  color: var(--c-primary-200);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s;
}
.faded:hover ~ .read-more,
.read-more:hover {
  opacity: 1;
  pointer-events: auto;
}

.suggestion {
  margin: 5px;
  color: yellow;
}

</style>
