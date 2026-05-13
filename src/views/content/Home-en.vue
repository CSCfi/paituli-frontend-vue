<script setup lang="ts">
import AppLink from '@/components/AppLink.vue';
import { APP_SETTINGS } from '@/shared/constants';
import { CAlertType } from '@cscfi/csc-ui';
import { useI18n } from 'vue-i18n';

const { t } = useI18n({ useScope: 'global' })
</script>

<template>
  <h1>About</h1>
  <p>
    Paituli is a Finnish spatial data service. Paituli is mainly targeted for academic users, but it is open to anyone. The service provides datasets that are important for research and education. Compared to other spatial data services Paituli includes also historical versions of datasets. For many datasets the first version is from 2005, when Paituli started. All provided datasets have open license, mostly CC-BY-4.0 license.
  </p>
  <p>
    Finnish academic users are welcomed to <AppLink to="/opendata">share data</AppLink> in Paituli.
  </p>
  <p>
    <AppLink :new-tab="false" to="http://www.nic.funet.fi/index/geodata/Paituli_2026.pptx"> Paituli's PowerPoint presentation</AppLink> (2026).
  </p>

  <h2>Datasets</h2>
  <p>
    Paituli includes datasets from following data providers:
    <ul>
      <li><AppLink to="https://dvv.fi">Finnish Digital and Population Data Services Agency</AppLink></li>
      <li><AppLink to="https://www.ruokavirasto.fi/">Finnish Food Agency</AppLink></li>
      <li><AppLink to="http://www.ilmatieteenlaitos.fi">Finnish Meteorological Institute (FMI)</AppLink></li>
      <li><AppLink to="http://www.digiroad.fi">Finnish Transport Infrastructure Agency, Digiroad</AppLink></li>
      <li><AppLink to="http://www.kotus.fi">Institute for the Languages of Finland (KOTUS)</AppLink></li>
      <li><AppLink to="https://science.nasa.gov/mission/landsat/">NASA/USGS, Landsat</AppLink></li>
      <li><AppLink to="http://www.maanmittauslaitos.fi">National Land Survey (MML)</AppLink></li>
      <li><AppLink to="https://www.luke.fi/">Natural resource institute Finland (LUKE)</AppLink></li>
      <li><AppLink to="http://www.tilastokeskus.fi/index_en.html">Statistics Finland</AppLink></li>
      <li><AppLink to="https://www.slu.se/en/">Swedish university of agricultural sciences</AppLink></li>
      <li><AppLink to="https://www.helsinki.fi/en">University of Helsinki</AppLink></li>
    </ul>
  </p>
  <c-alert :type="CAlertType.Info">
    <span>
      Detailed list and metadata of all Paituli datasets can be found from <AppLink to="https://etsin.fairdata.fi/datasets?facet_keyword=Paituli">Fairdata Etsin</AppLink>.
      <br>In Etsin, use the free text search or the filters on the left to specify your interest.
    </span>
  </c-alert>

  <h2>Data access</h2>
  <p>Paituli provides many options for accessing the data:
    <ul>
      <li>
        <AppLink to="/download">{{ t('pages.download') }}</AppLink> page enables:
        <ul>
          <li><b>Map preview</b> of many datasets, including feature info.</li>
          <li>Downloaded files of all or selected mapsheets as a <b>zip-file</b>, max {{ APP_SETTINGS.MAX_ZIP_SIZE / 1000 }} GB.</li>
          <li>Downloaded file list of all or selected mapsheets.</li>
        </ul>
      </li>
      <li>
        Bigger amounts of data can be download over <AppLink to="/files">HTTPS, FTP and rsync</AppLink>.
      </li>
      <li>
        Many datasets are also available as <AppLink to="/webservices">OGC APIs:</AppLink> WMS / Maps, WCS / Coverages, WMTS / Tiles and WFS / Features.
      </li>
      <li>
        All Paituli raster datasets are available via <AppLink to="/stac">STAC</AppLink>. Paituli STAC includes more datasets than Paituli download service, for example Geoportti Geocube and several remote sensing Finnish datasets.
      </li>
      <li>
        <AppLink to="https://research.csc.fi/gis_data_in_csc_computing_env">CSC Puhti supercomputer has open GIS data</AppLink>, which includes a copy of almost all Paituli data, for fast and easy access for Puhti users.
      </li>
    </ul>
  </p>

  <h2>News</h2>
  <c-list>
    <c-list-item>
      <c-list-item-title>
        15.4.2026
      </c-list-item-title>
      Helsinki university/LUOMUS SPECTRE-datasets have been updated.
    </c-list-item>
    <c-list-item>
      <c-list-item-title>
        13.3.2026
      </c-list-item-title>
      FMI's following 10 km datasets have been updated, so that now data is available for years 1961-2025: daily average, mean and maximum temperature, precipitation, snow, radiation, sea level pressure, relative humidity, and monthly average temperature and precipitation.
    </c-list-item>
    <c-list-item>
      <c-list-item-title>
        4.3.2026
      </c-list-item-title>
      <span>
        <AppLink to="https://github.com/csc-training/geocomputing/tree/master/python/STAC" target="_blanc">STAC Python examples</AppLink> are updated to use odc-stac-library.
      </span>
    </c-list-item>
    <c-list-item>
      <c-list-item-title>
        23.2.2026
      </c-list-item-title>
      Arable land from Norhtern Finland (1947-1979) from Swedish university of agricultural sciences added. It was created using machine learning methods from historical topographic maps.
    </c-list-item>
    <c-list-item>
      <c-list-item-title>
        18.12.2025
      </c-list-item-title>
      Statistics Finland: key figures for municipalities 2023 and 2024 added.
    </c-list-item>
    <c-list-item>
      <c-list-item-title>
        25.7.2025
      </c-list-item-title>
      Statistics Finland: population grid data 2024, population by municipalities 2024, road accidents 2023 and Paavo 2025 added.
    </c-list-item>
    <c-list-item>
      <c-list-item-title>
        2.6.2025
      </c-list-item-title>
      Digital Agency: Addresses of buildings 2025 added.
    </c-list-item>
    <c-list-item>
      <c-list-item-title>
        30.5.2025
      </c-list-item-title>
      National Land Survey 2025 data update: topographic database, administrative boundaries, cadastral index map, print-color and background-color basic maps, topographic and general maps in several scales as raster and vector.
    </c-list-item>
    <c-list-item>
      <c-list-item-title>
        24.5.2025
      </c-list-item-title>
      Natural Resource institute's (LUKE) estimates of variables in map form from multi-source national forest inventory (MS-NFI) added: 2006 - 2021.
    </c-list-item>
    <c-list-item>
      <c-list-item-title>
        15.4.2024
      </c-list-item-title>
      Over 30 000 historic georeferenced maps from National Land Survey archive from years 1863-2020 added. Parish maps, economic maps, topographic maps and basic maps in scales 1:20 000 to 1:500 000.
    </c-list-item>
    <c-list-item>
      <c-list-item-title>
        21.3.2019
      </c-list-item-title>
      National Land Board's lidar data, 2m DEM and orthophotos are updated every Sunday.
    </c-list-item>
  </c-list>

  <h2>About Paituli</h2>

  <p>
    The use of Paituli service is free of charge. Paituli is maintained by <AppLink to="https://www.csc.fi">CSC - IT center for science</AppLink> and financed by <AppLink to="https://minedu.fi/etusivu">Ministry of Education and Culture</AppLink> and
    Finnish Academy via <AppLink to="https://www.geoportti.fi">Geoportti</AppLink> FIRI-project. Paituli is provided with best effort service level and availability.
  </p>
  <p>
    Paituli is developed at CSC using open source software, inc:
    <AppLink to="http://geoserver.org/">Geoserver</AppLink>,
    <AppLink to="https://openlayers.org/">OpenLayers</AppLink>,
    <AppLink to="https://vuejs.org/">Vue</AppLink>,
    <AppLink to="https://postgis.net/">PostGIS</AppLink>
    and
    <AppLink to="https://quarkus.io/" >Quarkus</AppLink>.
    Paituli source code is available in Github:
    <AppLink to="https://github.com/CSCfi/paituli-frontend-vue/">front-end</AppLink> and <AppLink to="https://github.com/CSCfi/avaa-paituli-backend">back-end</AppLink>.
  </p>
  <p>
    Usage statistics are available in <AppLink to="https://www.nic.funet.fi/index/geodata/yearly_reports/">Paituli yearly reports</AppLink>.
  </p>

</template>

<style scoped>

c-list {
  --c-list-gap: 0;
}

</style>
