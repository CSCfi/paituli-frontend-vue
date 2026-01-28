<script setup lang="ts">
import { ref, watch } from 'vue'
import { useDatasets } from '@/composables/datasets'

import InfoTab from '@/components/tabs/InfoTab.vue'
import InfoModal from './modals/InfoModal.vue'
import ServicesTab from '@/components/tabs/ServicesTab.vue'
import type { Dataset, MetadataParse } from '@/shared/types'
import { URLS } from '@/shared/constants'
import SettingsTab from './tabs/SettingsTab.vue'
import { mdiOpenInNew } from '@mdi/js';
import { useToasts } from '@/composables/toasts'
import { CToastType } from '@cscfi/csc-ui'
import { useI18n } from 'vue-i18n'
import { useLocale } from '@/composables/locale';

const { currentDataset } = useDatasets()
const { addToast } = useToasts()
const { t } = useI18n()
const { currentLocale } = useLocale()

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
      message: t('toasts.metafail')
    })
    console.error(`Failed to parse Etsin metadata: ${(err as Error).message}`)
  }
})

// For extracting a human-readable description from metadata
function parseMetadata(metadata: any): MetadataParse | null {
  if (!metadata || !metadata.research_dataset) {
    return null
  }

  const resources = metadata.research_dataset.remote_resources || []
  const links: { title: string, url: string }[] = resources
    .filter((item: any) =>
      item.title &&
      item.download_url?.identifier &&
      !item.download_url.identifier.toLowerCase().includes('paituli.csc.fi/download')
    )
    .map((item: any) => ({
      title: item.title,
      url: item.download_url.identifier,
    }))

  const descObj = metadata.research_dataset.description || {}
  const desc = currentLocale.value == 'fi' ? descObj.fi : descObj.en

  const parseMarkdownishText = (text: string): string => {
    // Markdown-style [title](url)
    text = text.replace(/\[([^\]]+)\]\((http.*?)\)/g, '<a href="$2" target="_blank">$1</a>')
    // <http://example.com>
    text = text.replace(/<http(.*?)>/g, '<a href="http$1" target="_blank">http$1</a>')
    // Line breaks
    return text.replace(/(\r\n|\n|\r)/gm, '<br>')
    // Would we need further sanitization?
  }

  return {
    description: parseMarkdownishText(desc ?? ''),
    links: links
  }
}


</script>

<template>
  <div v-if="!currentDataset" class="suggestion">
    <p>{{ t("suggestion") }}</p>
  </div>
  <div v-else class="extra">
    <c-tabs v-model="tab" v-control>
      <c-tab value="infotab">{{ t("tabs.info.label") }}</c-tab>
      <c-tab value="servicestab">{{ t("tabs.services.label") }}</c-tab>
      <c-tab value="settingstab">{{ t("tabs.settings.label") }}</c-tab>

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
            {{ t("tabs.info.more") }}
          </c-button>
          <div v-if="currentDataset?.meta">
            <p>
              {{ t("tabs.info.metadata") }}
              <c-link :href="URLS.ETSIN_METADATA_BASE + currentDataset.meta" target="_blank">
                {{ t("tabs.info.etsin") }}<c-icon :path="mdiOpenInNew" size="18" />
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

<i18n>
{
  "en": {
    "suggestion": "Please select a Producer to start browsing available datasets.",
    "tabs": {
      "info": {
        "label": "Info",
        "more": "Read more",
        "metadata": "Full metadata available at",
        "etsin": "Fairdata Etsin",
      },
      "services": {
        "label": "Services",
      },
      "settings": {
        "label": "Settings",
      },
    },
    "toasts": {
      "metafail": "Failed to load dataset metadata. If the problem persists, please try again later.",
    },
  },
  "fi": {
    "suggestion": "Valitse yksi tuottajista selatakseksi saatavilla olevia aineistoja.",
    "tabs": {
      "info": {
        "label": "Tietoa",
        "more": "Lue lisää",
        "metadata": "Täydet metatiedot saatavilla",
        "etsin": "Fairdata Etsimessä",
      },
      "services": {
        "label": "Palvelut",
      },
      "settings": {
        "label": "Asetukset",
      },
    },
    "toasts": {
      "metafail": "Aineiston metatietojen lataaminen epäonnistui. Jos ongelma toistuu, yritä uudelleen myöhemmin.",
    },
  },
}
</i18n>

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
