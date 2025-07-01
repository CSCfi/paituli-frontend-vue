<template>
  <h1>Paituli OGC web services</h1>

  <p>
    Several Paituli datasets are available as OGC web services: WMS, WFS, WCS and WMTS. Also new OGC
    API standards are supported. All datasets available via web services are listed at the end of
    this page. OGC web services enable retrieving data from servers directly to a web application,
    desktop GIS or data analysis script, without downloading first data as files to own computer. In
    such a way, it is possible to use always up-to-date data easily. Web services are used in
    desktop software similar to local data, the user connects to the service using a special menu.
    For connection the user needs to know the service end-point. After connecting to the service,
    the user gets a list of available data layers.
  </p>

  <p>Paituli provides these OGC web services:</p>

  <h4>Stable OGC standards</h4>
  <table>
    <tbody>
      <tr>
        <th><strong>Type</strong></th>
        <th><strong>Request result</strong></th>
        <th><strong>End-point</strong></th>
      </tr>
      <tr>
        <td><b>WMS</b>, Web Map Service</td>
        <td>Map image for viewing</td>
        <td>https://paituli.csc.fi/geoserver/paituli/wms?</td>
      </tr>
      <tr>
        <td><b>WMTS</b>, Web Map Tile Service</td>
        <td>Map image tile for viewing</td>
        <td>https://paituli.csc.fi/geoserver/paituli/gwc/service/wmts?</td>
      </tr>
      <tr>
        <td><b>WFS</b>, Web Feature Service</td>
        <td>Vector data</td>
        <td>https://paituli.csc.fi/geoserver/paituli/wfs?</td>
      </tr>
      <tr>
        <td><b>WCS</b>, Web Coverage Service</td>
        <td>Raster data</td>
        <td>https://paituli.csc.fi/geoserver/paituli/wcs?</td>
      </tr>
    </tbody>
  </table>

  <h4>New OGC API standards</h4>

  <p>
    The new <a href="https://ogcapi.ogc.org/">OGC API standards</a> are still under development.
    Paituli supports them as much as GeoServer has implemented them. Also client side
    implementations are developing, for example QGIS and ArcGIS Pro currently support only OGC API
    Features. Note that the end-points changed 25.8.2023.
  </p>

  <table>
    <tbody>
      <tr>
        <th><strong>Type</strong></th>
        <th><strong>Request result</strong></th>
        <th><strong>End-point</strong></th>
      </tr>
      <tr>
        <td><b>Maps</b>, similar to WMS</td>
        <td>Map image for viewing</td>
        <td>https://paituli.csc.fi/geoserver/ogc/maps/v1</td>
      </tr>
      <tr>
        <td><b>Tiles</b>, similar to WMTS</td>
        <td>Map image tile for viewing</td>
        <td>https://paituli.csc.fi/geoserver/ogc/tiles/v1</td>
      </tr>
      <tr>
        <td><b>Features</b>, similar to WFS</td>
        <td>Vector data</td>
        <td>https://paituli.csc.fi/geoserver/ogc/features/v1</td>
      </tr>
      <tr>
        <td><b>Coverages</b>, similar to WCS</td>
        <td>Raster data</td>
        <td>https://paituli.csc.fi/geoserver/ogc/coverages/v1</td>
      </tr>
    </tbody>
  </table>
  <p>
    In WMTS services maps are available only in pre-defined scales and sizes. In WMS services scale
    and map size can be set without restrictions. WMTS services are faster, because often the map
    tiles are already cached at the server. For requesting only part of data different filters may
    be used, for example BBOX that defines the area of interest.
  </p>
  <p>
    WMTS-service's gridsets: ERTS-TM35-FIN (EPSG:3067,
    <a
      href="http://docs.jhs-suositukset.fi/jhs-suositukset/JHS180_liite1/JHS180_liite1.html#H7"
      target="_blank"
      >JHS180</a
    >) and Spherical Mercator (EPSG:3857).
  </p>

  <p>
    The license terms are the same for data downloaded via web services as via download service. The
    license terms and descriptions can be found from
    <a href="metadata.html">Metadata</a> page. If Paituli web services are used in a web
    application, also Paituli has to be mentioned.
  </p>

  <h4>Guidelines for using OGC web services:</h4>
  <ul>
    <li>
      <a href="https://docs.qgis.org/3.16/en/docs/training_manual/online_resources/wms.html"
        >QGIS training manual: Web mapping services</a
      >
    </li>
    <li>
      <a href="https://pro.arcgis.com/en/pro-app/latest/help/data/services/ogc-services.htm"
        >ArcGIS Pro user manual: About using OGC service layers</a
      >
    </li>
    <li>
      <a href="https://pro.arcgis.com/en/pro-app/latest/help/data/services/add-ogc-api-services.htm"
        >ArcGIS Pro user manual: Add OGC API services</a
      >
    </li>
    <li>
      <a href="http://docs.geoserver.org/latest/en/user/services/index.html"
        >GeoServer user guide</a
      >
    </li>
  </ul>

  <h4>Datasets available as OGC web services</h4>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
