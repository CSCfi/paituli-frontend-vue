<template>
  <h1>Share your spatial data with Paituli</h1>
  <p>
    Students and personnel of Finnish universities have possibility to share their own spatial data
    with Paituli. It could be data that has been gathered for a scientific study or a course
    project. This data could be about Finland or any other region in the world.
  </p>
  <p>
    After publishing anybody can download your data. Datasets suitable for
    <a href="http://docs.geoserver.org/latest/en/user/" target="_blank">GeoServer</a> can also be
    previewed on download page and they will be available also as standard
    <a href="webservices.html">OGC web sercices</a>.
  </p>
  <p>
    Annually CSC generates a report about Paituli usage, including number of downloads for each
    dataset. This report will be sent to all data providers. Each dataset in Paituli has a permanent
    identifier in URN format.
  </p>
  <p>CSC publishes data free of charge and will not get any rights for the data.</p>
  <h3>Steps for sharing your data</h3>
  <ol>
    <li>
      <strong>Make sure the data can be published</strong>. You should either own the data or be
      granted the right to publish the data by the data owner. No contractual or intellectual
      property rights should prohibit opening the data. The data should be licensed with a license
      allowing reuse. Paituli recommends
      <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank">
        Creative Commons BY 4.0 license</a
      >.
    </li>
    <li>
      <strong>Describe the data</strong>. The data description should include:
      <ul>
        <li>Heading in Finnish and English</li>
        <li>Short description in Finnish and English (ca 5-10 rows)</li>
        <li>Longer description can be added as .pdf-file. (Optional)</li>
        <li>Dataset producer: organization, optinally researcher by name and ORCID.</li>
        <li>Date, when data was gathered</li>
        <li>Scale / pixel size</li>
        <li>Coordinate system</li>
        <li>License, for example CC-BY-4.0</li>
        <li>Project, where the dataset was produced: name and web-page. (Optional)</li>
        <li>DOI, URN or other PID if the dataset has it already (Optional)</li>
      </ul>
    </li>
    <li>
      <strong>Package your data</strong>, technical recommendations
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
        <li>
          These are only recommendations, if you feel some other option would suit your data better,
          please consult with CSC.
        </li>
      </ul>
    </li>
    <li>
      If you want to use a specific <strong>map style</strong> for visualizing your data in WMS and
      WMTS services, make a style description file in
      <a href="http://docs.geoserver.org/latest/en/user/styling/sld-cookbook/" target="_blank"
        >SLD</a
      >
      format and add it to the data package. If you are not familiar with SLD, also styles suitable
      for ArcGIS or QGIS may be submitted. (Optional)
    </li>
    <li>
      <strong
        >Send the data and its description to
        <a href="mailto:giscoord@csc.fi" rel="nofollow">giscoord@csc.fi</a></strong
      >. Smaller datasets may be sent as attachments, for bigger files
      <a href="https://filesender.funet.fi/" target="_blank">FUNET FileSender</a> is better.
      FileSender can accept files up to 300 Gb. If your data is bigger or you have data in Allas or
      Puhti services or if you have problems with uploading, please contact CSC.
    </li>
    <li>CSC will publish your data to Paituli in a week or two.</li>
  </ol>

  <p>
    Alternative to publishing data in Paituli, is
    <a href="https://www.fairdata.fi/" target="_blank">Fairdata service</a>. If you are wondering,
    which service to use in your case, take a look at
    <a
      href="https://www.nic.funet.fi/index/geodata/cscfairdata-IDAvsPaituli-241123.pdf"
      target="_blank"
      >PaITulin and Fairdata comparision table</a
    >.
  </p>

  <p>If you have any questions, please contact CSC, giscoord@csc.fi</p>
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
