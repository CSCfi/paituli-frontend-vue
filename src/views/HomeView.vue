<script setup lang="ts"></script>

<template>
  <h1>About</h1>
  <p>
    Paituli is a spatial data download service. Paituli's primary users are
    students and personnel of Finnish universities and polytechnics, but it is
    open to anyone. The service provides datasets that are important for
    research and education. Compared to other spatial data services Paituli
    includes also historical versions of datasets. For many datasets the first
    version is from 2005, when Paituli started. At the moment datasets from
    following data providers are available:
  </p>
  <ul>
    <li>
      <a href="https://dvv.fi" target="_blank" >Finnish Digital and Population Data Services Agency</a >
    </li>
    <li>
      <a href="https://www.ruokavirasto.fi/" target="_blank" >Finnish Food Agency</a
      >
    </li>
    <li>
      <a href="http://www.ilmatieteenlaitos.fi" target="_blank" >Finnish Meteorological Institute (FMI)</a >
    </li>
    <li>
      <a href="http://www.digiroad.fi" target="_blank" >Finnish transport Infrastructure Agency, Digiroad</a >
    </li>
    <li>
      <a href="http://www.kotus.fi" target="_blank" >Institute for the Languages of Finland (KOTUS)</a >
    </li>
    <li>
      <a href="http://www.latuviitta.org/" target="_blank">Latuviitta</a>
    </li>
    <li>
      <a href="http://www.maanmittauslaitos.fi" target="_blank" >National Land Survey (MML)</a >
    </li>
    <li>
      <a href="https://www.luke.fi/" target="_blank" >Natural resource institute Finland (LUKE)</a >
    </li>
    <li>
      <a href="http://www.tilastokeskus.fi/index_en.html" target="_blank" >Statistics Finland</a >
    </li>
    <li>
      <a href="https://www.luomus.fi/fi" target="_blank" >University of Helsinki, Luomus</a >
    </li>
  </ul>
  <p>
    The detailed list of available datasets can be found on
    <a href="metadata.html">Metadata</a>
    and
    <a href="download.html">Download data</a>
    pages. Datasets have different open licenses, most datasets have CC-BY-4.0
    license. Please remember to read the license terms before downloading the
    datasets.
  </p>
  <p>Paituli provides four different options for downloading the data:</p>
  <ul>
    <li>
      Datasets can be downloaded as zip-files from
      <a href="download.html">Download data page</a>
      . The zip-file size is limited to 3Gb. Download data page provides also
      preview option for a big part of the datasets.
    </li>
    <li>
      Bigger amounts of data can be download over HTTP,
      <a href="files.html">FTP and rsync</a>
      .
    </li>
    <li>
      Many datasets are also available as OGC
      <a href="webservices.html">web services:</a>
      WMS (Maps), WCS, WMTS (Tiles) and WFS (Features).
    </li>
    <li>
      <a
        href="https://research.csc.fi/gis_data_in_csc_computing_env"
        target="_blank"
      >CSC Puhti supercomputer has open GIS data</a
      >
      , which includes a copy of almost all Paituli data, for fast and easy
      access for Puhti users.
    </li>
  </ul>
  <p>
    Metadata of Paituli datasets is stored to
    <a
      href="https://etsin.fairdata.fi/datasets/paituli?keys=&amp;terms=&amp;p=1&amp;sort=best"
      target="_blank"
    >Etsin</a
    >
    . Metadata includes short description of dataset in Finnish and English,
    contact information, license terms and if available links to additional
    documents or web pages. Links to dataset specific pages in Etsin can be
    found on Metadata page or on Download page's Metadata tab.
  </p>
  <p>
    Students and personnel of universities and polytechnics are welcomed to
    <a href="opendata.html">share data</a>
    in Paituli.
  </p>
  <p>
    The use of Paituli service is free of charge. Paituli is maintained by
    <a href="https://www.csc.fi" target="_blank">CSC - IT center for science</a>
    and financed by
    <a href="https://minedu.fi/etusivu"
       target="_blank"
    >Ministy of Education and Culture</a
    >
    and Finnish Academy via
    <a href="https://www.geoportti.fi" target="_blank">Geoportti</a> project.
    Paituli is provided with best effort service level and availability.
  </p>
  <p>
    Paituli is developed at CSC using open source software, inc:
    <a href="http://geoserver.org/" target="_blank">Geoserver</a>,
    <a href="https://openlayers.org/" target="_blank">OpenLayers</a>,
    <a href="https://postgis.net/" target="_blank">PostGIS</a>
    and
    <a href="https://quarkus.io/" target="_blank">Quarkus</a>. Paituli source
    code is available in Github:
    <a href="https://github.com/CSCfi/avaa-paituli-frontend/"
       target="_blank"
    >front-end</a
    >
    and
    <a href="https://github.com/CSCfi/avaa-paituli-backend"
       target="_blank"
    >back-end</a
    >.
  </p>
  <p>
    Paituli 's permanent link:
    <a href="http://www.csc.fi/paituli">www.csc.fi/paituli</a>
  </p>
  <p>
    <a
      href="http://www.nic.funet.fi/index/geodata/Paituli_2020.pptx"
      target="_blank"
    >Paituli's PowerPoint presentation</a
    >
    (2020).
  </p>


  <h1>News</h1>
  <c-list>
    <c-list-item>
      <c-list-item-title>19.12.2024</c-list-item-title>
      Statistics Finland: Key figures for municipalities 2022 added.
    </c-list-item>
    <c-list-item>
      <c-list-item-title>13.9.2024</c-list-item-title>
      FMI's following 10 km datasets have been updated, so that now data is
      available for years 1961-2023: Daily average, mean and maximum
      temperature, precipitation, snow, radiation, sea level pressure,
      relative humidity, and monthly average temperature and precipitation.
    </c-list-item>
    <c-list-item>
      <c-list-item-title>9.8.2024</c-list-item-title>
      National Land Survey: Topographic database 2024 in GeoPackage and
      Shape format added.
    </c-list-item>
    <c-list-item>
      <c-list-item-title>8.8.2024</c-list-item-title>
      Statistics Finland: Population grid data 2023 and population by
      municipalities 2023 added.
    </c-list-item>
    <c-list-item>
      <c-list-item-title>24.5.2024</c-list-item-title>
      Natural Resource institute's (LUKE) estimates of variables in map form
      from multi-source national forest inventory (MS-NFI) added: 2006 -
      2021.
    </c-list-item>
    <c-list-item>
      <c-list-item-title>15.4.2024</c-list-item-title>
      Over 30 000 historic georeferenced maps from National Land Survey
      archive from years 1863-2020 added. Parish maps, economic maps,
      topographic maps and basic maps in scales 1:20 000 to 1:500 000.
    </c-list-item>
    <c-list-item>
      <c-list-item-title>9.2.2024</c-list-item-title>
      Statistics Finland: Road accidents 2022 and Paavo 2024 added.
    </c-list-item>
    <c-list-item>
      <c-list-item-title>8.2.2024</c-list-item-title>
      National Land Survey: Administrative borders 2024 added.
    </c-list-item>
    <c-list-item>
      <c-list-item-title>15.12.2023</c-list-item-title>
      Natural Resource institute's (LUKE) soil database added.
    </c-list-item>
    <c-list-item>
      <c-list-item-title>14.12.2023</c-list-item-title>
      Sentinel 2A data for growing season 2022 and 2023 added to Paituli
      STAC.
    </c-list-item>
    <c-list-item>
      <c-list-item-title>21.11.2023</c-list-item-title>
      National Land Survey's topographical database for years 2005-2018
      added in GeoPackage format, so that whole Finland is in one file.
    </c-list-item>
    <c-list-item>
      <c-list-item-title>18.9.2023</c-list-item-title>
      FMI's monthly mean precipitation and temperature predictions and
      monthly mean precipitation and temperature change predictions
      1975-2085 added.
    </c-list-item>
    <c-list-item>
      <c-list-item-title>25.8.2023</c-list-item-title>
      Paituli GeoServer version update, that caused end-point URL change for
      STAC and OGC APIs. Now also OGC API Coverages is available.
    </c-list-item>
    <c-list-item>
      <c-list-item-title>22.8.2023</c-list-item-title>
      Raster datasets from Paituli and GeoPortti GeoCubes datasets added to
      STAC. In total now 98 datasets available via STAC.
    </c-list-item>
    <c-list-item>
      <c-list-item-title>16.8.2023</c-list-item-title>
      Helsinki University Finnish museum of natural history's (Luomus) new
      SPECTRE dataset added. this dataset includes 24 layers describing
      threats to biodiversity at 1 km resolution for all global terrestrial
      areas. available data covers threats such as habitat loss,
      overexploitation, pollution and climate change.
    </c-list-item>
    <c-list-item>
      <c-list-item-title>20.6.2023</c-list-item-title>
      Natural Resource institute's (LUKE) tree carbon stock and tree carbon
      stock change datasets added. .
    </c-list-item>
    <c-list-item>
      <c-list-item-title>19.4.2023</c-list-item-title>
      Statistics Finland: Educational institutions 2022 added.
    </c-list-item>
    <c-list-item>
      <c-list-item-title>17.4.2023</c-list-item-title>
      National Land Survey: Print-color basic map 2023 have been added.
    </c-list-item>
    <c-list-item>
      <c-list-item-title>14.4.2023</c-list-item-title>
      <span>
        <a href="stac.html">STAC API</a> added for searching and downloading spatiotemporal data.
      </span>
    </c-list-item>
    <c-list-item>
      <c-list-item-title>10.11.2021</c-list-item-title>
      Paituli starts supporting new OGC APIs: Maps, Tiles and Features.
    </c-list-item>
    <c-list-item>
      <c-list-item-title>15.12.2020</c-list-item-title>
      <span>
        Paituli service was upgraded and moved to a new server. From user's
        perspective Paituli continues mostly as before. Some changes took
        place:
        New Paituli includes only open datasets. The last datasets available only for universities
        (<a href="https://etsin.fairdata.fi/datasets/SLICES" target="_blank">SLICES</a> and
        <a href="https://etsin.fairdata.fi/datasets/puustotulkinta" target="_blank">Land use and forest classification 1997</a>)
        are available from Etsin.
        NLS orthoimages are not available as WMS and WMTS because of
        technical reasons.
        <a href="https://www.maanmittauslaitos.fi/karttakuvapalvelu" target="_blank" >NLS</a> and
        <a href="https://kartat.kapsi.fi/" target="_blank">Kapsi</a> provide alternative options for this.
      </span>
    </c-list-item>
    <c-list-item>
      <c-list-item-title>14.8.2020</c-list-item-title>
      <span>
        <a href="https://rapidlasso.com/2012/12/03/lasindex-spatial-indexing-of-lidar-data/" target="_blank">Index files</a>
        added to NLS lidar data. Also headers of NLS lidar .laz-files fixed, in original NLS data there might be mistakes in bbox or point count values.
      </span>
    </c-list-item>
    <c-list-item>
      <c-list-item-title>21.3.2019</c-list-item-title>
      National Land Board's lidar data, 2m DEM and orthophotos are updated every sunday.
    </c-list-item>
    <c-list-item>
      <c-list-item-title>2019</c-list-item-title>
      <span>
        Paituli has included earlier datasets produced by
        <a href="https://www.syke.fi/fi-FI/Avoin_tieto/Paikkatietoaineistot/Ladattavat_paikkatietoaineistot">Finnish Environment Institute SYKE</a>,
        <a href="https://hakku.gtk.fi/fi/locations/search" >Finnish Geological survey GTK</a > and
        <a href="https://www.museovirasto.fi/fi/palvelut-ja-ohjeet/tietojarjestelmat/kulttuuriympariston-tietojarjestelmat/kulttuuriympaeristoen-paikkatietoaineistot" > Finnish Heritage Agency</a >.
        These datasets are available from data producers own services.
      </span>
    </c-list-item>
  </c-list>

</template>

<style scoped>
</style>