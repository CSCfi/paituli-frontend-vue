<script setup lang="ts">
import { URLS } from '@/shared/constants'

</script>

<template>
  <h1>Paituli OGC web services</h1>
  <p>
    Several Paituli datasets are available as OGC web services:
    WMS, WFS, WCS and WMTS. Also new OGC API standards are supported.
    OGC web services enable retrieving data from servers directly to
    a web application, desktop GIS or data analysis script,
    without downloading first data as files to own computer.
    In such a way, it is possible to use always up-to-date data fast and easily.
    For connection the user needs to know the service end-point.
    After connecting to the service, the user gets a list of available data layers.
  </p>
  <p>
    To see layer details and what endpoints are available for a dataset,
    first select a dataset in the
    <RouterLink to="/download">Download Data</RouterLink>
    page, then select Services ➔ OGC APIs.
  </p>
  <h2>Stable OGC standards</h2>
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

  <h2>New OGC API standards</h2>
  <p>
    The new <a href="https://ogcapi.ogc.org/">OGC API standards</a>
    are still under development. Paituli supports them as much as
    GeoServer has implemented them. Also client side implementations
    are developing, for example QGIS and ArcGIS Pro currently support
    only OGC API Features.
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

  <p>
    In WMTS services maps are available only in pre-defined
    scales and sizes. In WMS services scale and map size can be
    set without restrictions. WMTS services are faster,
    because often the map tiles are already cached at the server.
    For requesting only part of data different filters may
    be used, for example BBOX that defines the area of interest.
  </p>
  <p>
    WMTS-service's gridsets: ERTS-TM35-FIN (EPSG:3067,
    <a
      href="http://docs.jhs-suositukset.fi/jhs-suositukset/JHS180_liite1/JHS180_liite1.html#H7"
      target="_blank">
      JHS180
    </a>)
    and Spherical Mercator (EPSG:3857).
  </p>

  <p>
    The license terms are the same for data downloaded via
    web services as via download service.
    To view a dataset's license, select it from the
    <RouterLink to="/download">Download Data</RouterLink>
    page. If Paituli web services are used in a web
    application, also Paituli has to be mentioned.
  </p>

  <h2>Guidelines for using OGC web services</h2>
  <ul>
    <li>
      <a href="https://docs.qgis.org/3.16/en/docs/training_manual/online_resources/wms.html">
        QGIS training manual: Web mapping services</a>
    </li>
    <li>
      <a href="https://pro.arcgis.com/en/pro-app/latest/help/data/services/ogc-services.htm">
        ArcGIS Pro user manual: About using OGC service layers</a>
    </li>
    <li>
      <a href="https://pro.arcgis.com/en/pro-app/latest/help/data/services/add-ogc-api-services.htm">
        ArcGIS Pro user manual: Add OGC API services</a>
    </li>
    <li>
      <a href="http://docs.geoserver.org/latest/en/user/services/index.html">
        GeoServer user guide</a>
    </li>
  </ul>

</template>
