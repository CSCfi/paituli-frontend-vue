<script setup lang="ts">

import { mdiFormatListBulletedType, mdiHandHeartOutline, mdiPackageVariantClosed, mdiMap, mdiEmailFastOutline, mdiCalendarClock } from '@mdi/js';

</script>

<template>
  <h1>Share your spatial data in Paituli</h1>
  <p>
    Finnish universities and research institutes have possibility to
    publish their own spatial data in Paituli. It could be data that has been
    gathered for a scientific project. This data could be about
    Finland or global. Each dataset in Paituli has a permanent identifier in URN format.
  </p>
  <p>
    After publishing, anybody can download your data. Datasets suitable for
    <a href="http://docs.geoserver.org/latest/en/user/" target="_blank">GeoServer</a> can also be
    previewed on download page and they will be available also as
    <RouterLink to="/webservices">OGC APIs</RouterLink>. Raster datasets are added to
    <RouterLink to="/stac">STAC</RouterLink>.
  </p>
  <p>
    Annually CSC generates a report about Paituli usage, including number of downloads for each
    dataset. This report will be sent to all data providers.
  </p>
  <p>CSC publishes data free of charge and will not get any rights for the data.</p>
  <h2>Steps for sharing your data</h2>
  <c-list>
    <c-list-item>
      <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
      <c-icon slot="pre" color="var(--c-primary-600)" :path="mdiHandHeartOutline" />
      <c-list-item-title>
        <strong>1. Make sure the data can be published</strong>
      </c-list-item-title>
      <span>
        You should either own the data or be
        granted the right to publish the data by the data owner. No contractual or intellectual
        property rights should prohibit opening the data. The data should be licensed with a license
        allowing reuse. Paituli recommends <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank"> Creative Commons BY 4.0 license</a >.
      </span>
    </c-list-item>
    <c-list-item>
      <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
      <c-icon slot="pre" color="var(--c-primary-600)" :path="mdiFormatListBulletedType" />
      <c-list-item-title>
        <strong>2. Describe the data</strong>.
        The data description should include:
      </c-list-item-title>
      <ul>
        <li>Heading in Finnish and English</li>
        <li>Short description in Finnish and English (ca 5-10 rows)</li>
        <li>Longer description can be added as .pdf-file. (Optional)</li>
        <li>Dataset producer: organization, optionally researcher by name and ORCID.</li>
        <li>Date, when data was gathered</li>
        <li>Scale / pixel size</li>
        <li>Coordinate system</li>
        <li>License, for example CC-BY-4.0</li>
        <li>Project, where the dataset was produced: name and web-page. (Optional)</li>
        <li>DOI, URN or other PID if the dataset has it already (Optional)</li>
      </ul>
    </c-list-item>
    <c-list-item>
      <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
      <c-icon slot="pre" color="var(--c-primary-600)" :path="mdiPackageVariantClosed" />
      <c-list-item-title>
        <strong>3. Package your data</strong>
      </c-list-item-title>
      These are only recommendations, if you feel some other option would suit your data better,
      please consult with CSC.
      <ul>
        <li>
          Format: <a href="https://www.cogeo.org/#implementations">Cloud-optimized Geotiff</a> for
          raster, GeoPackage or Shape for vector data, LAZ for laser scanning data, netcdf or Zarr
          for multi-dimensional data.
        </li>
        <li>
          Coordinate system: ETRS-TM35FIN (EPSG:3067) for data about Finland, WGS-84 (EPGS:4326) for
          global data.
        </li>
        <li>
          Divide data to map sheets if needed, if you have map sheet index as a separate file,
          include that to data package
        </li>
      </ul>
    </c-list-item>
    <c-list-item>
      <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
      <c-icon slot="pre" color="var(--c-primary-600)" :path="mdiMap" />
      <c-list-item-title>
        <strong>4. Data visualization</strong> (optional)
      </c-list-item-title>
      <span>
        If you want to use a specific <strong>map style</strong> for visualizing your data in WMS and
        WMTS services, make a style description file in
        <a href="http://docs.geoserver.org/latest/en/user/styling/sld-cookbook/" target="_blank" >SLD</a>
        format and add it to the data package. If you are not familiar with SLD, also styles suitable
        for ArcGIS or QGIS may be submitted.
      </span>
    </c-list-item>
    <c-list-item>
      <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
      <c-icon slot="pre" color="var(--c-primary-600)" :path="mdiEmailFastOutline" />
      <c-list-item-title>
        <strong>5. Send the data</strong> and its description to giscoord@csc.fi
      </c-list-item-title>
      <span>
        Smaller datasets may be sent as attachments, for bigger files
        <a href="https://filesender.funet.fi/" target="_blank">FUNET FileSender</a> is better.
        FileSender can accept files up to 300 Gb. If your data is bigger and you have data in Allas or
        CSC supercomputers or if you have problems with uploading, please contact CSC.
      </span>
    </c-list-item>
    <c-list-item>
      <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
      <c-icon slot="pre" color="var(--c-primary-600)" :path="mdiCalendarClock" />
      <c-list-item-title>
        <strong>6. CSC will publish your data to Paituli</strong>
      </c-list-item-title>
      This will usually take a week or two.
    </c-list-item>
  </c-list>

  <p>
    Alternative to publishing data in Paituli, is
    <a href="https://www.fairdata.fi/" target="_blank">Fairdata service</a>. If you are wondering,
    which service to use in your case, take a look at
    <a
      href="https://www.nic.funet.fi/index/geodata/cscfairdata-IDAvsPaituli-241123.pdf"
      target="_blank"
    >PaITulin and Fairdata comparison table</a
    >.
  </p>

  <p>If you have any questions, please contact CSC, giscoord@csc.fi</p>
</template>

<style>

c-list-item label {
  margin-left: 5px;
}
</style>
