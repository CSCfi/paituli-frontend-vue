<script setup lang="ts">
import { mdiOpenInNew } from '@mdi/js';
import { URLS } from '@/shared/constants'
import { copyToClipboard } from '@/shared/util'
import { useDatasets } from '@/composables/datasets';
import { ref } from 'vue';

import CodeBlock from '@/components/tabs/CodeBlock.vue';

const { currentDataset, hasRasterData, hasVectorData } = useDatasets()

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
        Dataset web services
      </c-card-title>
      <c-card-content>
        <strong>{{ currentDataset.name }} - {{ currentDataset.org }}</strong>

        <c-tabs v-model="modalTab" v-control>
          <c-tab value="FileTransferTab">File transfer</c-tab>
          <c-tab value="STACTab">STAC</c-tab>
          <c-tab value="StableOGCTab">Stable OGC APIs</c-tab>
          <c-tab value="NewOGCTab">New OGC APIs</c-tab>

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
                  You can view or download dataset contents using its
                  <c-link :href="URLS.HTTP_LINKS_BASE + currentDataset.funet" target="_blank">
                    HTTP file index<c-icon :path="mdiOpenInNew" color="var(--c-primary-500)" size="18"/>
                  </c-link>
                </p>

                <p><strong>FTP</strong></p>
                <CodeBlock
                  :content="URLS.FTP_LINKS_BASE + currentDataset.funet"
                />
                <p><strong>RSYNC</strong></p>
                <CodeBlock
                  :content="'rsync://rsync.nic.funet.fi/ftp/index/geodata/' + currentDataset.funet"
                />

                <c-link href="/files" target="_blank">
                  Help?<c-icon :path="mdiOpenInNew" color="var(--c-primary-500)" size="18" />
                </c-link>
              </div>
            </c-tab-item>

            <c-tab-item value="STACTab">
              <div v-if="currentDataset.stac_id">
                <p>
                  The SpatioTemporal Asset Catalog (STAC) specification provides a common structure for describing and cataloging spatiotemporal assets.
                </p>
                <p>
                  This dataset has been catalogued in Paituli STAC, and it's availabie for viewing in
                  <c-link :href="URLS.STAC_BROWSER_BASE + '/' + currentDataset.stac_id" target="_blank">
                    STAC browsers<c-icon :path="mdiOpenInNew" color="var(--c-primary-500)" size="18" />
                  </c-link>
                </p>
                <c-table>
                  <table>
                    <tbody>
                      <tr>
                        <td>Endpoint</td>
                        <td>{{ URLS.STAC_PAITULI_BASE }}</td>
                        <td>
                          <c-button ghost
                                    size="small"
                                    @click="copyToClipboard(URLS.STAC_PAITULI_BASE)">
                            Copy
                          </c-button>
                        </td>
                      </tr>
                      <tr>
                        <td>Collection</td>
                        <td>{{ currentDataset.stac_id }}</td>
                        <td>
                          <c-button ghost
                                    size="small"
                                    @click="copyToClipboard(currentDataset.stac_id)">
                            Copy
                          </c-button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </c-table>
              </div>
              <div v-else>
                <p>
                  This dataset has not been catalogued in Paituli STAC.
                </p>
              </div>
              <c-link href="/stac" target="_blank">
                Help?<c-icon :path="mdiOpenInNew" color="var(--c-primary-500)" size="18" />
              </c-link>
            </c-tab-item>

            <c-tab-item value="StableOGCTab">
              <p v-if="!currentDataset.data_url">
                This dataset is not provided by Paituli Geoserver APIs
              </p>
              <div v-else>
                <c-table>
                  <table>
                    <thead>
                      <tr>
                        <th>API</th>
                        <th>Endpoint</th>
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
                            Copy
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
                            Copy
                          </c-button>
                        </td>
                      </tr>
                      <tr :class="{ 'grayed': !hasVectorData(currentDataset) }">
                        <td>WFS</td>
                        <td v-if="hasVectorData(currentDataset)">{{ URLS.WFS_PAITULI_BASE }}</td>
                        <td v-else>N/A</td>

                        <td>
                          <c-button ghost
                                    size="small"
                                    @click="copyToClipboard(URLS.WFS_PAITULI_BASE)">
                            Copy
                          </c-button>
                        </td>
                      </tr>
                      <tr :class="{ 'grayed': !hasRasterData(currentDataset) }">
                        <td>WCS</td>
                        <td v-if="hasRasterData(currentDataset)">{{ URLS.WCS_PAITULI_BASE }}</td>
                        <td v-else>N/A</td>

                        <td>
                          <c-button ghost
                                    size="small"
                                    @click="copyToClipboard(URLS.WCS_PAITULI_BASE)">
                            Copy
                          </c-button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </c-table>

                <p>
                  When using the listed APIs, copy the endpoint(s) and the identifier below into your application of choice.
                  Note that some APIs are only available for specific dataset formats.
                </p>

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
                            Copy
                          </c-button>
                        </td>
                      </tr>
                      <tr :class="{ 'grayed': !currentDataset.data_max_scale }">
                        <td>max visible scale</td>
                        <td v-if="currentDataset.data_max_scale">{{ currentDataset.data_max_scale }}</td>
                        <td v-else>N/A</td>
                      </tr>
                    </tbody>
                  </table>
                </c-table>

              </div>

              <p>
                <c-link href="/webservices" target="_blank">
                  Help?<c-icon :path="mdiOpenInNew" color="var(--c-primary-500)" size="18" />
                </c-link>
              </p>
            </c-tab-item>

            <c-tab-item value="NewOGCTab">
              <p v-if="!currentDataset.data_url">
                This dataset is not provided by Paituli Geoserver APIs
              </p>
              <div v-else>
                <c-table>
                  <table>
                    <thead>
                      <tr>
                        <th>API</th>
                        <th>Endpoint</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Maps</td>
                        <td>{{ URLS.OGC_MAPS_PAITULI_BASE }}</td>
                        <td>
                          <c-button ghost size="small" @click="copyToClipboard(URLS.OGC_MAPS_PAITULI_BASE)">
                            Copy
                          </c-button>
                        </td>
                      </tr>
                      <tr>
                        <td>Tiles</td>
                        <td>{{ URLS.OGC_TILES_PAITULI_BASE }}</td>
                        <td>
                          <c-button ghost size="small" @click="copyToClipboard(URLS.OGC_TILES_PAITULI_BASE)">
                            Copy
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
                        <td v-else>N/A</td>
                        <td>
                          <c-button ghost size="small" @click="copyToClipboard(URLS.OGC_FEATURES_PAITULI_BASE)">
                            Copy
                          </c-button>
                        </td>
                      </tr>
                      <tr :class="{ 'grayed': !hasRasterData(currentDataset) }">
                        <td>Coverages</td>
                        <td v-if="hasRasterData(currentDataset)">{{ URLS.OGC_COVERAGES_PAITULI_BASE }}</td>
                        <td v-else>N/A</td>
                        <td>
                          <c-button ghost size="small" @click="copyToClipboard(URLS.OGC_COVERAGES_PAITULI_BASE)">
                            Copy
                          </c-button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </c-table>

                <p>
                  When using the listed APIs, copy the endpoint(s) and the identifier below into your application of choice.
                  Note that some APIs are only available for specific dataset formats.
                </p>

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
                            Copy
                          </c-button>
                        </td>
                      </tr>
                      <tr :class="{ 'grayed': !currentDataset.data_max_scale }">
                        <td>max visible scale</td>
                        <td v-if="currentDataset.data_max_scale">{{ currentDataset.data_max_scale }}</td>
                        <td v-else>N/A</td>
                      </tr>
                    </tbody>
                  </table>
                </c-table>
              </div>

              <p>
                <c-link href="/webservices" target="_blank">
                  Help?<c-icon :path="mdiOpenInNew" color="var(--c-primary-500)" size="18" />
                </c-link>
              </p>
            </c-tab-item>

          </c-tab-items>
        </c-tabs>

      </c-card-content>

      <c-card-actions justify="end">
        <c-button @click="showModal = false">
          Close
        </c-button>
      </c-card-actions>
    </c-card>
  </c-modal>
</template>

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