<template>
  <h1>Paituli STAC - Spatio Temporal Asset Catalog</h1>

  <p>
    <a href="https://stacspec.org/en/" target="_blank">STAC</a> is a specification to describe
    geospatial datasets with temporal dimension. It drastically simplifies
    <strong>searching and downloading</strong> datasets. STAC includes only the metadata of datasets
    and links to the actual files. The data files themselves are usually stored in the cloud. STAC
    is most often used for remote sensing imagery and other raster data, but it can be used also for
    vector and point cloud data. STAC is especially suitable for time-series applications.
  </p>

  <p>STAC main concepts:</p>


  <ul dir="auto">
    <li>
      <strong>Catalog</strong> - general description of the service and links to available
      Collections. Example: Paituli STAC
    </li>
    <li>
      <strong>Collection</strong> - collection specific general metadata and links to available
      Items. In one collection are similar items. Example: ESA/SYKE, Sentinel-2 monthly index
      mosaics
    </li>
    <li>
      <strong>Item</strong> - the core atomic unit, describing data for specific time and location.
      Each Item has one or several Assets. Example: ESA/SYKE, Sentinel-2 monthly index mosaics of
      area X at timepoint Y
    </li>
    <li>
      <strong>Asset</strong> - Files and links related to an Item, can be data files or links to
      metadata etc. Example: NDVI index file of ESA/SYKE, Sentinel-2 monthly index mosaics of area X
      at timepoint Y. The dataset includes several indices, each index is an Asset, because each
      index is in a separate file.
    </li>
  </ul>

  <img :src="'STAC.png'" style="width: 100%" />

  <p>
    Globally, a lot of STAC catalogs exist. STAC index website provides
    <a href="https://stacindex.org/catalogs" target="_blank">a list of public STAC catalogs</a> and
    also a good possibility to explore different catalogs.
  </p>

  <p>
    When searching STAC catalogs, the main criteria are location, time and collection name. Items
    may have also additional information, for example cloud coverage for optical remote sensing
    images, that also can be included to search criteria.
  </p>

  <p>
    STAC can be provided as <strong>static</strong> collection of JSON files or as an
    <strong>API</strong>. STAC API support fast searching of big datasets with thousands or millions
    of Items.
  </p>

  <p>
    The best storage option for actual data linked from STAC is a cloud optimized format:
    <a href="https://www.cogeo.org/"> Cloud-Optimized GeoTiff (COG)</a> for raster and
    <a href="https://copc.io/">COPC</a> for point cloud data. Cloud optimized formats enable
    downloading only a subset of larger files, covering only a defined area or only generalized
    overview of the data. Also other formats can be used, but depending on file inner organization
    subsetting might work less optimally.
  </p>

  <p>
    For searching and downloading data from STAC some external <strong>tool</strong> is required.
    <a href="https://radiantearth.github.io/stac-browser/" target="_blank">STAC browser</a> can be
    used for searching data from any STAC with web-browser.
    <a href="https://stacindex.org/ecosystem#/" target="_blank">STAC end-user tools</a> are
    available for
    <a href="https://pystac-client.readthedocs.io/en/latest" target="_blank">Python </a>,
    <a href="https://cran.r-project.org/web/packages/rstac/index.html" target="_blank">R</a>,
    <a href="https://stac-utils.github.io/qgis-stac-plugin/" target="_blank">QGIS</a> and
    <a href="https://github.com/JuliaClimate/STAC.jl" target="_blank">Julia</a>. Additionally
    <a
      href="https://docs.csc.fi/support/tutorials/gis/virtual-rasters/#creating-virtual-raster-with-gdal-gdal_translate-and-stac"
      target="_blank"
    >GDAL</a
    >
    enables creating virtual rasters of STAC search results. Each STAC catalog has its own STAC
    end-point, which should be given to the tools, so that they can find the catalog.
  </p>

  <h3>Example scripts for Python and R</h3>
  <p>
    Python and R have further packages for downloading and analyzing multitemporal raster data.
    These tools also support parallel computing, so handling bigger datasets is easily possible. CSC
    has prepared example scripts for
    <a
      href="https://www.github.com/csc-training/geocomputing/blob/master/python/STAC"
      target="_blank"
    >Python</a
    >
    and
    <a href="https://www.github.com/csc-training/geocomputing/blob/master/R/STAC"
       target="_blank"
    >R</a
    >, that demostrate how to search and use STAC data and what are the main required libraries.
  </p>

  <h2>Paituli STAC contents</h2>

  <p>
    Paituli STAC catalog includes Finnish data, currently about 100 datasets. The full list is
    available in
    <a
      href="https://radiantearth.github.io/stac-browser/#/external/paituli.csc.fi/geoserver/ogc/stac/v1?.language=en"
      target="_blank"
    >STAC browser for Paituli STAC</a
    >, see what data collections are available, search for items and also preview COG files.
    Paituli STAC currently includes data from following sources:
  </p>


  <c-list>
    <c-list-item>
      <c-list-item-title>Stored at CSC, in Espoo and Kajaani datacenter</c-list-item-title>
      <ul>
        <li>
          <a href="metadata.html" target="_blank">Paituli own data</a>, only raster data, a lot of
          different datasets. Files in different formats, inc. GeoTiff, COG, JPG2000 and NetCDF
          format.
        </li>
        <li>
          All Items of Paituli data have 2 assets - one with public URL-link to data in Espoo and
          one Puhti specific path. Puhti specific paths can and should be used ONLY when working on
          CSC supercomputer Puhti.
        </li>
      </ul>
    </c-list-item>
    <c-list-item>
      <c-list-item-title>Stored at CSC, in Kajaani datacenter</c-list-item-title>
      <ul>
        <li>
          ESA, <a href="https://a3s.fi/sentinel-readme/README.txt" target="_blank">Sentinel-2 products</a >,
          processed to Level-2A (Surface Reflectance), a selection of mostly cloud-free products
          from Finland. Downloaded to CSC Allas by Maria Yli-Heikkilä (LUKE), Arttu Kivimäki
          (NLS/FGI) and Matias Heino (Aalto). Files in original JPG2000 format.
        </li>
        <li>
          <a href="https://vm0160.kaj.pouta.csc.fi/geocubes/datasets/"
             target="_blank"
          >Geoportti geocubes</a
          >
          data, a lot of different raster datasets, all recalculated to common grid at several
          different resolutions. All files GeoTiffs, for each dataset also COG available.
        </li>


      </ul>
    </c-list-item>

    <c-list-item>
      <c-list-item-title>
        Stored at FMI, from <a href="https://pta.data.lit.fmi.fi/stac/root.json" target="_blank" >
          FMI Tuulituhohaukka static STAC catalog, all files COGs</a>
      </c-list-item-title>
      <ul>
        <li>ESA/FMI, Sentinel-2 11-days surface reflectance mosaics.</li>
        <li>ESA/FMI, Sentinel-1 daily backscatter mosaics: VV and VH polarisation.</li>
        <li>ESA/FMI, Sentinel-1 11 days backscatter mosaics: VV and VH polarisation.</li>
        <li>ESA/FMI, Sentinel-2 annual surface reflectance mosaics.</li>
        <li>ESA/SYKE, Sentinel-2 monthly index mosaics: NDVI, NDBI, NDMI, NDSI, NDTI.</li>
        <li>ESA, Sentinel-1 backscatter tiles: VV and VH polarisation.</li>
        <li>USGS/SYKE, Landsat (4 and 5) yearly index mosaics: NDVI, NDBI, NDMI, NDSI, NDTI.</li>
        <li>NLS, Digital terrain model products: DTM, aspect, slope.</li>
        <li>Finnish Forest center, Canopy height model.</li>
        <li>LUKE, Multi-source forest inventory products.</li>
        <li>LUKE, Forest wind damage risk map.</li>
        <li>FMI, Daily wind damage risk map.</li>
      </ul>
    </c-list-item>

  </c-list>

  <p>
    Paituli is a STAC API and its end-point is:
    <a href="https://paituli.csc.fi/geoserver/ogc/stac/v1"
       target="_blank"
    >https://paituli.csc.fi/geoserver/ogc/stac/v1</a
    >
    (end-point changed 25.8.2023)
  </p>

  <p>
    <a href="https://gis-workshops.a3s.fi/2023-06-13-stac-workshop.pdf"
    >Slides of "STAC - how to find and use spatiotemporal data easily?" workshop</a
    >, 13.6.2023
  </p>

  <p>
    Paituli STAC has been developed using
    <a href="https://www.aka.fi/en/" target="_blank"> Academy of Finland</a>
    <a href="https://www.geoportti.fi/" target="_blank">Geoportti funding</a>.
  </p>

  <p>
    Paituli STAC is in early phases of operation, so if you have any feedback, please contact CSC,
    servicedesk@csc.fi. If you would be interested that some (your?) data is added to Paituli STAC,
    first make sure it is available via URL-links (in cloud-optimized format) and then contact CSC.
  </p>
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
