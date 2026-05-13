<script setup lang="ts">
import AppLink from '@/components/AppLink.vue';
import { URLS } from '@/shared/constants'
import { CAlertType } from '@cscfi/csc-ui';
import { useI18n } from 'vue-i18n';

const { t } = useI18n({ useScope: 'global' })
</script>

<template>
  <h1>Paituli OGC APIs</h1>
  <p>
    Many Paituli datasets are available via OGC APIs. OGC web services enable retrieving data from servers directly to a web application, desktop GIS or data analysis scripts, without downloading first data as files. In such a way, it is possible to use always up-to-date data easily. Web services are used in desktop software similar to local data, the user connects to the service using a special menu. For connection the user needs to know the service end-point. After connecting to the service, the user gets a list of available data layers.
  </p>

  <h2>Available datasets</h2>
  <p>
    Paituli has over 600 data layers available via OGC APIs. The layer names can be found from <AppLink to="/download">{{ t('pages.download') }}</AppLink> page: Select a dataset and then click APIs. Note that not all Paituli datasets are supported over OGC APIs.
  </p>
  <c-alert :type="CAlertType.Info">
    <span>
      <AppLink to="https://paituli.csc.fi/geoserver/web/wicket/bookmarkable/org.geoserver.web.demo.MapPreviewPage">Full list of all OGC API data layers</AppLink>
    </span>
  </c-alert>

  <h2>Supported OGC APIs</h2>
  <h3>Stable OGC standards</h3>
  <c-table>
    <table>
      <thead>
        <tr>
          <th>Type</th>
          <th>Request result</th>
          <th>Endpoint</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><b>WMS</b>, Web Map Service</td>
          <td>Map image for viewing</td>
          <td>{{ URLS.WMS_PAITULI_BASE }}</td>
        </tr>
        <tr>
          <td><b>WMTS</b>, Web Map Tile Service</td>
          <td>Map image tile for viewing</td>
          <td>{{ URLS.WMTS_PAITULI_BASE_GWC }}</td>
        </tr>
        <tr>
          <td><b>WFS</b>, Web Feature Service</td>
          <td>Vector data</td>
          <td>{{ URLS.WFS_PAITULI_BASE }}</td>
        </tr>
        <tr>
          <td><b>WCS</b>, Web Coverage Service</td>
          <td>Raster data</td>
          <td>{{ URLS.WCS_PAITULI_BASE }}</td>
        </tr>
      </tbody>
    </table>
  </c-table>

  <h3>New OGC API standards</h3>
  <p>
    The new <AppLink to="https://ogcapi.ogc.org/">OGC API standards</AppLink> are still under development. Paituli supports them as much as GeoServer has implemented them.
  </p>

  <c-table>
    <table>
      <thead>
        <tr>
          <th>Type</th>
          <th>Request result</th>
          <th>Endpoint</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><b>Maps</b>, similar to WMS</td>
          <td>Map image for viewing</td>
          <td>{{ URLS.OGC_MAPS_PAITULI_BASE }}</td>
        </tr>
        <tr>
          <td><b>Tiles</b>, similar to WMTS</td>
          <td>Map image tile for viewing</td>
          <td>{{ URLS.OGC_TILES_PAITULI_BASE }}</td>
        </tr>
        <tr>
          <td><b>Features</b>, similar to WFS</td>
          <td>Vector data</td>
          <td>{{ URLS.OGC_FEATURES_PAITULI_BASE }}</td>
        </tr>
        <tr>
          <td><b>Coverages</b>, similar to WCS</td>
          <td>Raster data</td>
          <td>{{ URLS.OGC_COVERAGES_PAITULI_BASE }}</td>
        </tr>
      </tbody>
    </table>
  </c-table>

  <h3>Usage notes</h3>
  <p>
    In WMTS services maps are available only in pre-defined scales and sizes. In WMS services scale and map size can be set without restrictions. WMTS services are faster, because often the map tiles are already cached at the server. For requesting only part of data different filters may be used, for example BBOX that defines the area of interest.
  </p>
  <p>
    WMTS-service's gridsets: ERTS-TM35-FIN (EPSG:3067, <AppLink to="http://docs.jhs-suositukset.fi/jhs-suositukset/JHS180_liite1/JHS180_liite1.html#H7">JHS180</AppLink>) and Spherical Mercator (EPSG:3857).
  </p>
  <p>
    The license terms are the same for data downloaded via web services as via download service. The license terms and descriptions can be found from <AppLink to="/download">{{ t('pages.download') }}</AppLink> page.
  </p>
  <p>
    If Paituli OGC APIs are used in a third-party web application, both data producer, dataset name (inc year) and Paituli must be mentioned.
  </p>

  <h3>Guidelines for using OGC web services:</h3>
  <ul>
    <li>
      <AppLink to="https://docs.qgis.org/latest/en/docs/user_manual/working_with_ogc/ogc_client_support.html#">QGIS manual: Working with OGC / ISO protocols</AppLink>
    </li>
    <li>
      <AppLink to="https://pro.arcgis.com/en/pro-app/latest/help/data/services/ogc-services.htm">ArcGIS Pro user manual: About using OGC service layers</AppLink>
    </li>
    <li>
      <AppLink to="https://pro.arcgis.com/en/pro-app/latest/help/data/services/add-ogc-api-services.htm">ArcGIS Pro user manual: Add OGC API services</AppLink>
    </li>
    <li>
      <AppLink to="http://docs.geoserver.org/latest/en/user/services/index.html">GeoServer user guide</AppLink>
    </li>
  </ul>

</template>
