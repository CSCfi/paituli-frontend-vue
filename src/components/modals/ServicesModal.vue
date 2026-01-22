<script setup lang="ts">
import { mdiOpenInNew } from '@mdi/js';
import { URLS } from '@/shared/constants'
import { copyToClipboard } from '@/shared/util'
import { useDatasets } from '@/composables/datasets';
import { ref } from 'vue';

import CodeBlock from '@/components/CodeBlock.vue';
import { useI18n } from 'vue-i18n';

const { currentDataset, hasRasterData, hasVectorData } = useDatasets()
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

</script>

<template>
  <c-modal v-model="showModal"
           v-control
           v-if="currentDataset"
           dismissable
           disable-backdrop-blur
           width="800px">
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

          <!--p> TODO: check link from v3
                  Names, paths and geometry as
                  <c-link :href="URLS.HTTP_LINKS_BASE+ currentDataset.funet" target="_blank">
                    Shapefile<c-icon :path="mdiOpenInNew" color="var(--c-primary-100)" size="18" />
                  </c-link>
                </p-->

          <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
          <c-tab-items slot="items">
            <c-tab-item value="FileTransferTab">

              <div v-if="currentDataset.funet">

                <strong>HTTP</strong>
                <p>
                  <CodeBlock
                    :content="URLS.HTTP_LINKS_BASE + currentDataset.funet"
                  />
                  <c-link :href="URLS.HTTP_LINKS_BASE + currentDataset.funet" target="_blank">
                    {{ t("file_transfer.link") }}<c-icon :path="mdiOpenInNew" color="var(--c-primary-500)" size="18"/>
                  </c-link>
                  {{ t("file_transfer.info") }}
                </p>

                <p><strong>FTP</strong></p>
                <CodeBlock
                  :content="URLS.FTP_LINKS_BASE + currentDataset.funet"
                />
                <p><strong>RSYNC</strong></p>
                <CodeBlock
                  :content="URLS.RSYNC_LINKS_BASE + currentDataset.funet"
                />

                <c-link href="/files" target="_blank">
                  {{ t("help") }}?<c-icon :path="mdiOpenInNew" color="var(--c-primary-500)" size="18" />
                </c-link>
              </div>
            </c-tab-item>

            <c-tab-item value="STACTab">
              <div v-if="currentDataset.stac_id">
                <p>
                  {{ t("stac.info") }}
                </p>
                <p>
                  {{ t("stac.catalogued") }}
                  <c-link :href="URLS.STAC_BROWSER_BASE + '/' + currentDataset.stac_id" target="_blank">
                    {{ t("stac.link") }}<c-icon :path="mdiOpenInNew" color="var(--c-primary-500)" size="18" />
                  </c-link>
                </p>
                <c-table>
                  <table>
                    <tbody>
                      <tr>
                        <td>{{ t("endpoint") }}</td>
                        <td>{{ URLS.STAC_PAITULI_BASE }}</td>
                        <td>
                          <c-button ghost
                                    size="small"
                                    @click="copyToClipboard(URLS.STAC_PAITULI_BASE)">
                            {{ t("copy") }}
                          </c-button>
                        </td>
                      </tr>
                      <tr>
                        <td>{{ t("stac.collection") }}</td>
                        <td>{{ currentDataset.stac_id }}</td>
                        <td>
                          <c-button ghost
                                    size="small"
                                    @click="copyToClipboard(currentDataset.stac_id)">
                            {{ t("copy") }}
                          </c-button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </c-table>
              </div>
              <div v-else>
                <p>
                  {{ t("stac.not_catalogued") }}
                </p>
              </div>
              <c-link href="/stac" target="_blank">
                {{ t("help") }}?<c-icon :path="mdiOpenInNew" color="var(--c-primary-500)" size="18" />
              </c-link>
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
                      <tr>
                        <td>WMS</td>
                        <td>{{ URLS.WMS_PAITULI_BASE }}</td>
                        <td>
                          <c-button ghost
                                    size="small"
                                    @click="copyToClipboard(URLS.WMS_PAITULI_BASE)">
                            {{ t("copy") }}
                          </c-button>
                        </td>
                      </tr>
                      <tr>
                        <td>WMTS</td>
                        <td>{{ URLS.WMTS_PAITULI_BASE_GWC }}</td>

                        <td>
                          <c-button ghost
                                    size="small"
                                    @click="copyToClipboard(URLS.WMTS_PAITULI_BASE_GWC)">
                            {{ t("copy") }}
                          </c-button>
                        </td>
                      </tr>
                      <tr :class="{ 'grayed': !hasVectorData(currentDataset) }">
                        <td>WFS</td>
                        <td v-if="hasVectorData(currentDataset)">{{ URLS.WFS_PAITULI_BASE }}</td>
                        <td v-else>{{ t("apis.not_available") }}</td>

                        <td>
                          <c-button ghost
                                    size="small"
                                    @click="copyToClipboard(URLS.WFS_PAITULI_BASE)">
                            {{ t("copy") }}
                          </c-button>
                        </td>
                      </tr>
                      <tr :class="{ 'grayed': !hasRasterData(currentDataset) }">
                        <td>WCS</td>
                        <td v-if="hasRasterData(currentDataset)">{{ URLS.WCS_PAITULI_BASE }}</td>
                        <td v-else>{{ t("apis.not_available") }}</td>

                        <td>
                          <c-button ghost
                                    size="small"
                                    @click="copyToClipboard(URLS.WCS_PAITULI_BASE)">
                            {{ t("copy") }}
                          </c-button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </c-table>

                <p>{{ t("apis.instruction") }}</p>

                <c-table>
                  <table>
                    <tbody>
                      <tr>
                        <td>Layer</td>
                        <td>{{ currentDataset.data_url }}</td>
                        <td>
                          <c-button ghost
                                    size="small"
                                    @click="copyToClipboard(currentDataset.data_url)">
                            {{ t("copy") }}
                          </c-button>
                        </td>
                      </tr>
                      <tr :class="{ 'grayed': !currentDataset.data_max_scale }">
                        <td>max visible scale</td>
                        <td v-if="currentDataset.data_max_scale">{{ currentDataset.data_max_scale }}</td>
                        <td v-else>{{ t("apis.not_available") }}</td>
                      </tr>
                    </tbody>
                  </table>
                </c-table>

              </div>

              <p>
                <c-link href="/webservices" target="_blank">
                  {{ t("help") }}?<c-icon :path="mdiOpenInNew" color="var(--c-primary-500)" size="18" />
                </c-link>
              </p>
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
                      <tr>
                        <td>Maps</td>
                        <td>{{ URLS.OGC_MAPS_PAITULI_BASE }}</td>
                        <td>
                          <c-button ghost size="small" @click="copyToClipboard(URLS.OGC_MAPS_PAITULI_BASE)">
                            {{ t("copy") }}
                          </c-button>
                        </td>
                      </tr>
                      <tr>
                        <td>Tiles</td>
                        <td>{{ URLS.OGC_TILES_PAITULI_BASE }}</td>
                        <td>
                          <c-button ghost size="small" @click="copyToClipboard(URLS.OGC_TILES_PAITULI_BASE)">
                            {{ t("copy") }}
                          </c-button>
                        </td>
                      </tr>
                      <tr :class="{ 'grayed': !hasVectorData(currentDataset) }">
                        <td v-if="hasVectorData(currentDataset)">
                          <c-link :href='URLS.OGC_FEATURES_PAITULI_BASE + "/collections/" + currentDataset.data_url' target="_blank">
                            Features<c-icon :path="mdiOpenInNew" color="var(--c-primary-500)" size="18" />
                          </c-link>
                        </td>
                        <td v-else>Features</td>
                        <td v-if="hasVectorData(currentDataset)">{{ URLS.OGC_FEATURES_PAITULI_BASE }}</td>
                        <td v-else>{{ t("apis.not_available") }}</td>
                        <td>
                          <c-button ghost size="small" @click="copyToClipboard(URLS.OGC_FEATURES_PAITULI_BASE)">
                            {{ t("copy") }}
                          </c-button>
                        </td>
                      </tr>
                      <tr :class="{ 'grayed': !hasRasterData(currentDataset) }">
                        <td>Coverages</td>
                        <td v-if="hasRasterData(currentDataset)">{{ URLS.OGC_COVERAGES_PAITULI_BASE }}</td>
                        <td v-else>{{ t("apis.not_available") }}</td>
                        <td>
                          <c-button ghost size="small" @click="copyToClipboard(URLS.OGC_COVERAGES_PAITULI_BASE)">
                            {{ t("copy") }}
                          </c-button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </c-table>

                <p>{{ t("apis.instruction") }}</p>

                <c-table>
                  <table>
                    <tbody>
                      <tr>
                        <td>Layer</td>
                        <td>{{ currentDataset.data_url }}</td>
                        <td>
                          <c-button ghost
                                    size="small"
                                    @click="copyToClipboard(currentDataset.data_url)">
                            {{ t("copy") }}
                          </c-button>
                        </td>
                      </tr>
                      <tr :class="{ 'grayed': !currentDataset.data_max_scale }">
                        <td>max visible scale</td>
                        <td v-if="currentDataset.data_max_scale">{{ currentDataset.data_max_scale }}</td>
                        <td v-else>{{ t("apis.not_available") }}</td>
                      </tr>
                    </tbody>
                  </table>
                </c-table>
              </div>

              <p>
                <c-link href="/webservices" target="_blank">
                  {{ t("help") }}?<c-icon :path="mdiOpenInNew" color="var(--c-primary-500)" size="18" />
                </c-link>
              </p>
            </c-tab-item>

          </c-tab-items>
        </c-tabs>

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
    "title": "Dataset web services",
    "tabs": {
      "file_transfer": "File transfer",
      "stac": "STAC",
      "stable_ogc": "Stable OGC APIs",
      "new_ogc": "New OGC APIs",
    },
    "api": "API",
    "endpoint": "Endpoint",
    "file_transfer": {
      "link": "HTTP file index",
      "info": "can be also opened in your browser to view or download dataset contents",
    },
    "stac": {
      "collection": "Collection",
      "info": "The SpatioTemporal Asset Catalog (STAC) specification provides a common structure for describing and cataloging spatiotemporal assets.",
      "catalogued": "This dataset has been catalogued in Paituli STAC, and it's availabie for viewing in",
      "link": "STAC browsers",
      "not_catalogued": "This dataset has not been catalogued in Paituli STAC.",
    },
    "apis": {
      "instruction": "When using the listed APIs, copy the endpoint(s) and the identifier below into your application of choice. Note that some APIs are only available for specific dataset formats.",
      "not_available": "Not available",
      "not_provided": "This dataset is not provided by Paituli Geoserver APIs",
    },
    "copy": "Copy",
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
    "endpoint": "Pääte",
    "file_transfer": {
      "link": "HTTP-tiedostoindeksin",
      "info": "voi avata myös selaimessa, jonka kautta voi tarkastella tai ladata aineiston sisältöä.",
    },
    "stac": {
      "collection": "Kokoelma",
      "info": "SpatioTemporal Asset Catalog (STAC) -spesifikaatio tarjoaa yhtenäisen rakenteen spatiotemporaalisten aineistojen kuvaamiseen ja katalogisointiin.",
      "catalogued": "Tämä aineisto on katalogoitu Paituli STAC:ssa, ja se on nähtävissä",
      "link": "STAC-selaimissa",
      "not_catalogued": "Tätä aineistoa ei ole katalogoitu Paituli STAC:ssa.",
    },
    "apis": {
      "instruction": "Käyttäessäsi listattuja rajapintoja, kopioi alla olevat päätteet ja tunniste sovellukseesi. Huomaa, että osa rajapinnoista on käytettävissä vain tietyille aineistomuodoille.",
      "not_available": "Ei saatavilla",
      "not_provided": "Paitulin Geoserver rajapinnat eivät tarjoa tätä aineistoa",
    },
    "copy": "Kopioi",
    "help": "Apua",
    "close": "Sulje",
  },
}
</i18n>

<style scoped>
c-tabs {
  --c-tab-background-color-hover: var(--c-primary-100);
  --c-tab-text-color: var(--c-primary-600);
  --c-tabs-indicator-color: var(--c-primary-900);
}
c-tab-item {
  color: var(--c-primary-900);
}
c-link {
  --c-link-color: var(--c-primary-500)
}
table.c-table .grayed td
{
  color: var(--c-tertiary-300);
}
table.c-table .grayed td c-button
{
  display: none;
}
a {
  color: var(--c-info-400);
}

</style>
