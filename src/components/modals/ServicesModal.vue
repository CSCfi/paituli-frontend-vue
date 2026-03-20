<script setup lang="ts">
import { mdiOpenInNew } from '@mdi/js';
import { URLS } from '@/shared/constants'
import { computed, ref } from 'vue';

import { useI18n } from 'vue-i18n';
import { currentDataset, hasRasterData, hasVectorData } from '@/modules/datasets';
import ServicesModalRow from './ServicesModalRow.vue';

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
              <c-table v-if="currentDataset.funet">
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
                      :trim-http="false"
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
              <div v-else>
                <p>{{ t('file_transfer.unavailable') }}</p>
              </div>
            </c-tab-item>

            <c-tab-item value="STACTab">
              <div v-if="currentDataset.stac_id">
                <p>{{ t("stac.info") }}</p>
                <p>
                  {{ t("stac.catalogued") }}
                  <c-link :href="URLS.STAC_BROWSER_BASE + '/' + currentDataset.stac_id" target="_blank">
                    {{ t("stac.link") }}<c-icon :path="mdiOpenInNew" size="18" />
                  </c-link>
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
                        label="Layer"
                        :text="currentDataset.data_url" />
                      <ServicesModalRow
                        label="Max visible scale"
                        :unavailable="!currentDataset.data_max_scale"
                        :show-copy="false"
                        :text="currentDataset.data_max_scale ?? ''" />
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
                        label="Layer"
                        :text="currentDataset.data_url" />
                      <ServicesModalRow
                        label="Max visible scale"
                        :unavailable="!currentDataset.data_max_scale"
                        :show-copy="false"
                        :text="currentDataset.data_max_scale ?? ''" />
                    </tbody>
                  </table>
                </c-table>
              </div>

            </c-tab-item>

          </c-tab-items>
        </c-tabs>

      </c-card-content>

      <c-card-actions justify="space-between">
        <c-button id="help" :href="helpUrl" target="_blank">
          {{ t("help") }}?<c-icon :path="mdiOpenInNew" size="18" />
        </c-button>
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
    "title": "Dataset web services",
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
      "http": {
        "link": "HTTP file index",
        "info": "{0} can be also opened in your browser to view or download dataset contents",
      },
      "unavailable": "Alternative file transfer services are unavailable for this dataset.",
    },
    "stac": {
      "collection": "Collection",
      "info": "The SpatioTemporal Asset Catalog (STAC) enables easy search of dataset files (assets) based on their location and time.",
      "catalogued": "This dataset has been catalogued in Paituli STAC and is available for viewing in",
      "link": "STAC browser",
      "not_catalogued": "This dataset has not been catalogued in Paituli STAC.",
    },
    "apis": {
      "instruction": "To use an API, copy an endpoint above and the layer name below into your application of choice. Note that the supported APIs vary between datasets, mainly depending on the data type and format.",
      "not_provided": "This dataset is not provided by Paituli Geoserver APIs",
    },
    "help": "Help",
    "close": "Close",
  },
  "fi": {
    "title": "Aineiston verkkopalvelut",
    "tabs": {
      "file_transfer": "Tiedostonsiirto",
      "stac": "STAC",
      "stable_ogc": "Vakaat OGC APIt",
      "new_ogc": "Uudet OGC APIt",
    },
    "api": "Rajapinta",
    "protocol": "Protokolla",
    "endpoint": "Pääte",
    "file_transfer": {
      "http": {
        "link": "HTTP-tiedostoindeksin",
        "info": "{0} voi avata myös selaimessa, jonka kautta voi tarkastella tai ladata aineiston sisältöä.",
      },
      "unavailable": "Vaihtoehtoiset tiedonsiirtopalvelut eivät ole saatavilla tälle aineistolle.",
    },
    "stac": {
      "collection": "Kokoelma",
      "info": "SpatioTemporal Asset Catalog (STAC) mahdollistaa aineiston tiedostojen (assetien) helpon haun niiden sijainnin ja ajan perusteella.",
      "catalogued": "Tämä aineisto on katalogoitu Paituli STAC:ssa ja se on nähtävissä",
      "link": "STAC-selaimessa",
      "not_catalogued": "Tätä aineistoa ei ole katalogoitu Paituli STAC:ssa.",
    },
    "apis": {
      "instruction": "Rajapinnan käyttämiseksi kopioi yllä oleva pääte sekä alta tason nimi (Layer) valitsemaasi sovellukseen. Huomaa, että tuettujen rajapintojen valikoima vaihtelee aineistoittain, pääasiassa aineiston tyypin ja tiedostomuodon mukaan.",
      "not_provided": "Paitulin Geoserver rajapinnat eivät tarjoa tätä aineistoa",
    },
    "help": "Apua",
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
