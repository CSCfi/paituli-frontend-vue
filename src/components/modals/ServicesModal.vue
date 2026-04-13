<script setup lang="ts">
import { URLS } from '@/shared/constants'
import { computed, ref } from 'vue';

import { useI18n } from 'vue-i18n';
import { currentDataset, hasRasterData, hasVectorData } from '@/modules/datasets';
import ServicesModalRow from './ServicesModalRow.vue';
import AppLink from '../AppLink.vue';

const { t } = useI18n()

type ModalTab = 'FileTransferTab' | 'STACTab' | 'StableOGCTab' | 'NewOGCTab';
const modalTab = ref<ModalTab>('FileTransferTab');
const showModal = ref(false)

function open(tab: ModalTab)
{
  showModal.value = true;
  modalTab.value = tab;
}
defineExpose({ open })

const helpUrl = computed(() => {
  switch (modalTab.value) {
  case 'FileTransferTab': return '/files'
  case 'STACTab': return '/stac'
  case 'StableOGCTab': return '/webservices'
  case 'NewOGCTab': return '/webservices'
  default: return '/'
  }
})

const scaleText = computed(() => {
  let text = t('apis.not_limited')
  const scale = currentDataset.value?.data_max_scale
  if (scale) text = `1 : ${scale}`
  return text
})

</script>

<template>
  <c-modal v-model="showModal"
           v-control
           v-if="currentDataset"
           dismissable
           disable-backdrop-blur
           width="900px">
    <c-card>
      <c-card-title>
        {{ t("title") }}
      </c-card-title>
      <c-card-content>
        <strong>{{ currentDataset.name }} - {{ currentDataset.org }}</strong>

        <c-tabs v-model="modalTab" v-control>
          <c-tab value="FileTransferTab">{{ t("tabs.file_transfer") }}</c-tab>
          <c-tab value="STACTab">{{ t("tabs.stac") }}</c-tab>
          <c-tab value="StableOGCTab">{{ t("tabs.stable_ogc") }}</c-tab>
          <c-tab value="NewOGCTab">{{ t("tabs.new_ogc") }}</c-tab>

          <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
          <c-tab-items slot="items">
            <c-tab-item value="FileTransferTab">
              <div v-if="currentDataset.funet">
                <c-table>
                  <table>
                    <thead>
                      <tr>
                        <th>{{ t("protocol") }}</th>
                        <th>URL</th>
                      </tr>
                    </thead>
                    <tbody>
                      <ServicesModalRow
                        label="HTTP"
                        :show-open="true"
                        :text="URLS.HTTP_LINKS_BASE + currentDataset.funet"/>
                      <ServicesModalRow
                        label="FTP"
                        :text="URLS.FTP_LINKS_BASE + currentDataset.funet"/>
                      <ServicesModalRow
                        label="rsync"
                        :text="URLS.RSYNC_LINKS_BASE + currentDataset.funet"/>
                    </tbody>
                  </table>
                </c-table>
                <p>
                  <AppLink
                    new-tab
                    to="https://docs.csc.fi/data/datasets/spatial-data-in-csc-computing-env/">
                    {{ t("file_transfer.hpc.title") }}
                  </AppLink>
                </p>
                <c-table>
                  <table>
                    <thead>
                    </thead>
                    <tbody>
                      <ServicesModalRow
                        :label="t('file_transfer.hpc.label')"
                        :text="URLS.PUHTI_GEO_BASE + currentDataset.funet"/>
                    </tbody>
                  </table>
                </c-table>
              </div>
              <div v-else>
                <p>{{ t('file_transfer.unavailable') }}</p>
              </div>
            </c-tab-item>

            <c-tab-item value="STACTab">
              <div v-if="currentDataset.stac_id">
                <p>
                  <AppLink
                    new-tab
                    :to="URLS.STAC_BROWSER_BASE + '/' + currentDataset.stac_id">
                    {{ t("stac.link") }}
                  </AppLink>
                </p>
                <c-table>
                  <table>
                    <tbody>
                      <ServicesModalRow
                        :label="t('endpoint')"
                        :show-open="true"
                        :text="URLS.STAC_PAITULI_BASE" />
                      <ServicesModalRow
                        :label="t('stac.collection')"
                        :text="currentDataset.stac_id" />
                    </tbody>
                  </table>
                </c-table>
              </div>
              <div v-else>
                <p>{{ t("stac.not_catalogued") }}</p>
              </div>
            </c-tab-item>

            <c-tab-item value="StableOGCTab">
              <p v-if="!currentDataset.data_url">
                {{ t("apis.not_provided") }}
              </p>
              <div v-else>
                <c-table>
                  <table>
                    <thead>
                      <tr>
                        <th>{{ t("api") }}</th>
                        <th>{{ t("endpoint") }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <ServicesModalRow
                        label="WMS"
                        :text="URLS.WMS_PAITULI_BASE" />
                      <ServicesModalRow
                        label="WMTS"
                        :text="URLS.WMTS_PAITULI_BASE_GWC" />
                      <ServicesModalRow
                        label="WFS"
                        :unavailable="!hasVectorData(currentDataset)"
                        :text="URLS.WFS_PAITULI_BASE" />
                      <ServicesModalRow
                        label="WCS"
                        :unavailable="!hasRasterData(currentDataset)"
                        :text="URLS.WCS_PAITULI_BASE" />
                    </tbody>
                  </table>
                </c-table>
                <p>{{ t("apis.instruction") }}</p>
                <c-table>
                  <table>
                    <tbody>
                      <ServicesModalRow
                        :label="t('apis.layer')"
                        :text="currentDataset.data_url" />
                      <ServicesModalRow
                        :label="t('apis.scale')"
                        :show-copy="false"
                        :text="scaleText" />
                    </tbody>
                  </table>
                </c-table>
              </div>
            </c-tab-item>

            <c-tab-item value="NewOGCTab">
              <p v-if="!currentDataset.data_url">
                {{ t("apis.not_provided") }}
              </p>
              <div v-else>
                <c-table>
                  <table>
                    <thead>
                      <tr>
                        <th>{{ t("api") }}</th>
                        <th>{{ t("endpoint") }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <ServicesModalRow
                        label="Maps"
                        :text="URLS.OGC_MAPS_PAITULI_BASE" />
                      <ServicesModalRow
                        label="Tiles"
                        :text="URLS.OGC_TILES_PAITULI_BASE" />
                      <ServicesModalRow
                        label="Features"
                        :unavailable="!hasVectorData(currentDataset)"
                        :text="URLS.OGC_FEATURES_PAITULI_BASE" />
                      <ServicesModalRow
                        label="Coverages"
                        :unavailable="!hasRasterData(currentDataset)"
                        :text="URLS.OGC_COVERAGES_PAITULI_BASE" />
                    </tbody>
                  </table>
                </c-table>
                <p>{{ t("apis.instruction") }}</p>
                <c-table>
                  <table>
                    <tbody>
                      <ServicesModalRow
                        :label="t('apis.layer')"
                        :text="currentDataset.data_url" />
                      <ServicesModalRow
                        :label="t('apis.scale')"
                        :show-copy="false"
                        :text="scaleText" />
                    </tbody>
                  </table>
                </c-table>
              </div>

            </c-tab-item>

          </c-tab-items>
        </c-tabs>

      </c-card-content>

      <c-card-actions justify="space-between">
        <AppLink :to="helpUrl"
                 id="help"
                 new-tab
                 c-button>
          {{ t("help") }}
        </AppLink>
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
    "title": "Dataset API",
    "tabs": {
      "file_transfer": "File transfer",
      "stac": "STAC",
      "stable_ogc": "Stable OGC APIs",
      "new_ogc": "New OGC APIs",
    },
    "api": "API",
    "protocol": "Protocol",
    "endpoint": "Endpoint",
    "file_transfer": {
      "hpc": {
        "title": "Puhti supercomputer",
        "label": "Path",
      },
      "unavailable": "Alternative file transfer services are unavailable for this dataset.",
    },
    "stac": {
      "collection": "Collection",
      "link": "Open in STAC Browser",
      "not_catalogued": "This dataset is not in Paituli STAC.",
    },
    "apis": {
      "instruction": "To use an API, copy an endpoint above and the layer name below into your application of choice. Note that the supported APIs vary between datasets, mainly depending on the data type and format.",
      "layer": "Layer",
      "scale": "Smallest visible scale",
      "not_provided": "This dataset is not available via OGC APIs.",
      "not_limited": "Unlimited",
    },
    "help": "Help",
    "close": "Close",
  },
  "fi": {
    "title": "Aineiston rajapinnat",
    "tabs": {
      "file_transfer": "Tiedostonsiirto",
      "stac": "STAC",
      "stable_ogc": "Vakaat OGC API:t",
      "new_ogc": "Uudet OGC API:t",
    },
    "api": "Rajapinta",
    "protocol": "Protokolla",
    "endpoint": "Osoite",
    "file_transfer": {
      "hpc": {
        "title": "Puhti supertietokone",
        "label": "Polku",
      },
      "unavailable": "Vaihtoehtoiset tiedonsiirtopalvelut eivät ole saatavilla tälle aineistolle.",
    },
    "stac": {
      "collection": "Kokoelma",
      "link": "Avaa STAC Browser:ssa",
      "not_catalogued": "Tämä aineisto ei ole Paituli STAC:ssa.",
    },
    "apis": {
      "instruction": "Rajapinnan käyttämiseksi kopioi yllä oleva osoite sekä alta karttatason nimi valitsemaasi sovellukseen. Huomaa, että tuettujen rajapintojen valikoima vaihtelee aineistoittain, pääasiassa aineiston tyypin ja tiedostomuodon mukaan.",
      "layer": "Karttataso",
      "scale": "Pienin näkyvä mittakaava",
      "not_provided": "Tämä aineisto ei ole saatavilla OGC API -rajapintojen yli.",
      "not_limited": "Rajoittamaton",
    },
    "help": "Ohjeet",
    "close": "Sulje",
  },
}
</i18n>

<style scoped>
c-tabs {
  --c-tab-background-color-hover: var(--c-primary-100);
  --c-tab-text-color: var(--c-primary-600);
  --c-tabs-indicator-color: var(--c-primary-700);
}
c-link {
  --c-link-color: var(--c-accent-700);
}
c-button#help {
  --c-button-background-color: var(--c-tertiary-700);
  --c-button-background-color-hover: var(--c-tertiary-500);
  c-icon {
    --c-icon-color: var(--c-white);
  }
}
</style>
