<template>
  <h1>Paituli STAC</h1>

  <p>
    <a href="https://stacspec.org/en/" target="_blank">STAC</a> - Spatio Temporal Asset Catalog - is a specification to describe geospatial datasets with temporal dimension. It drastically simplifies <strong>searching and downloading</strong> datasets. STAC is most often used for remote sensing imagery and other raster data. STAC is especially suitable for time-series applications. If you are unfamiliar with STAC in general, see the STAC concepts section at the end of this page.
  </p>

  <h2>Data collections</h2>

  <p>
    Paituli STAC currently includes ~175 Finnish raster datasets:

    <ul>
      <li><strong>~125 datasets from Paituli</strong>. All Paituli datasets have 2 assets - one with public URL-link to data and one Puhti specific path. Puhti specific paths can and should be used ONLY when working on CSC supercomputer Puhti.
      </li>
      <li>ESA, <a href="http://urn.fi/urn:nbn:fi:fd-e1007ae5-1529-3e5c-8bf2-b218c77e25a5" target="_blank">Sentinel-2 products</a>, processed to Level-2A (Surface Reflectance), a selection of mostly cloud-free products from Finland. Downloaded to CSC Allas by Maria Yli-Heikkilä (LUKE), Arttu Kivimäki (NLS/FGI) and Matias Heino (Aalto).
      </li>
      <li><a href="https://vm0160.kaj.pouta.csc.fi/geocubes/datasets/" target="_blank">~40 Geoportti geocube datasets</a>, all recalculated to common grid at several different resolutions.
      </li>
      <li><a href="https://pta.data.lit.fmi.fi/stac/root.json" target="_blank">12 datasets from FMI Tuulituhohaukka STAC catalog</a>, including Sentinel-1, Sentinel-2 and Landsat mosaics and indices.
      </li>
    </ul>

  </p>

  <p> The full list of Collections is available in <a href="https://radiantearth.github.io/stac-browser/#/external/paituli.csc.fi/geoserver/ogc/stac/v1?.language=en" target="_blank">STAC browser for Paituli STAC</a>.
  </p>

  <h2>Using STAC</h2>

  <p>
    For searching and downloading data from STAC different tools can be used:

    <ul>
      <li><a href="https://radiantearth.github.io/stac-browser/#/external/paituli.csc.fi/geoserver/ogc/stac/v1?.language=en" target="_blank">STAC browser </a> is best for getting to know the contents of a STAC with web-browser. It does not require any installations. It	supports searching available datasets based on title and description. It also has item search by location and time. STAC browser can be used to find collection ID and asset names for other tools.
      </li>
      <li> Python, R and Julia have libraries for searching STAC and easy downloading of data to specified data-cubes. These are best for more advanced analysis with data from STAC. These tools also support parallel computing, so handling bigger datasets works well. CSC has prepared <strong>example scripts</strong> for <a href="https://www.github.com/csc-training/geocomputing/blob/master/python/STAC" target="_blank">Python</a> and <a href="https://www.github.com/csc-training/geocomputing/blob/master/R/STAC" target="_blank">R</a>.
      </li>
      <li><a href="https://docs.qgis.org/latest/en/docs/user_manual/working_with_ogc/ogc_client_support.html#stac-spatiotemporal-asset-catalogs" target="_blank">QGIS</a> and <a href="https://pro.arcgis.com/en/pro-app/latest/help/data/imagery/introduction-to-stac.htm" target="_blank">ArcGIS Pro</a> have built-in support for finding and downloading data from STAC.
      </li>
      <li><a href="https://docs.csc.fi/support/tutorials/gis/virtual-rasters/#creating-virtual-raster-with-gdal-gdal_translate-and-stac" target="_blank">GDAL</a> enables creating virtual rasters of STAC search results.
      </li>
    </ul>
  </p>

  <p>
    Each STAC catalog has its own STAC end-point, which should be given to the tools, so that they can find the catalog.

  </p>

  <p>
    Paituli STAC API end-point is: <code>https://paituli.csc.fi/geoserver/ogc/stac/v1</code>
  </p>


  <h2>STAC concepts</h2>

  <ul dir="auto">
    <li><strong>Catalog</strong> - general description of the service and links to available Collections. Example: Paituli STAC
    </li>
    <li><strong>Collection</strong> - collection specific general metadata and links to available Items. In one collection are similar items. Example: ESA/SYKE, Sentinel-2 monthly index mosaics</li>
    <li><strong>Item</strong> - the core atomic unit, describing data for specific time and location. Each Item has one or several Assets. Example: ESA/SYKE, Sentinel-2 monthly index mosaics of area X at timepoint Y
    </li>
    <li><strong>Asset</strong> - Files and links related to an Item, can be data files or links to metadata etc. Example: NDVI index file of ESA/SYKE, Sentinel-2 monthly index mosaics of area X at timepoint Y. The dataset includes several indices, each index is an Asset, because each index is in a separate file.
    </li>
  </ul>

  <img :src="'STAC.png'" style="width: 100%" />

  <p>
    Globally, many STAC catalogs exist. STAC index website provides <a href="https://stacindex.org/catalogs" target="_blank">a list of public STACs</a>.
  </p>
  <p>
    While OGC APIs support requesting data, STAC search results include only links to data files, not data itself. If working with big amounts of data, this enables faster throughput.
  </p>

  <p>
    When using a STAC, the main search criteria are collection name, location and time. Items may have also additional information, for example cloud coverage for optical remote sensing images, that also can be included to search criteria.
  </p>

  <p>
    The best storage option for actual data linked from STAC is a cloud optimized format: <a href="https://www.cogeo.org/"> Cloud-Optimized GeoTiff (COG)</a> for raster. Cloud optimized formats enable downloading only a subset of larger files, covering only the defined area or only generalized overview of the data. Also other formats can be used, but depending on file inner organization subsetting might work less optimally.
  </p>
  <p>
    More info from <a href="https://gis-workshops.a3s.fi/2025-03-11-stac-workshop.pdf">"STAC - how to find and use spatiotemporal data easily?" </a> (2025) workshop slides.
  </p>

</template>
