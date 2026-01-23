<template>
  <h1>Paituli STAC - Spatio Temporal Asset Catalog</h1>
  <p>
    <a href="https://stacspec.org/en/" target="_blank">STAC</a>
    on spesifikaatio ajallisen ulottuvuuden omaavan paikkatiedon kuvailemiseksi.
    Se yksinkertaistaa huomattavasti aineistojen <strong>hakua ja lataamista</strong>.
    STAC sisältää vain aineistojen metatiedot ja linkit varsinaisiin
    tiedostoihin. Tiedostot itsessään säilytetään yleensä pilvipalvelimella.
    STAC on eniten käytettynä kaukokartoituskuvien ja muun rasteridatan kanssa,
    mutta sitä voidaan käyttää myös vektori- ja pistepilviaineistojen kanssa.
    STAC sopii parhaiten aikasarjoja käsitteleviin käyttötapauksiin.
  </p>

  <p>STAC pääkäsitteet (suomennokset eivät ole vakiintuneita): </p>
  <ul dir="auto">
    <li>
      <strong>Catalog</strong> (suom. Luettelo) -
      yleinen palvelun metatieto ja linkit saatavilla oleviin Kokoelmiin.
      Esimerkki: Paituli STAC
    </li>
    <li>
      <strong>Collection</strong> (suom. Kokoelma) -
      Kokoelmaan liittyvä metatieto ja linkit saatavilla oleviin Tuotteisiin.
      Yksi Kokoelma sisältää samantyyppisiä Tuotteita.
      Esimerkki: ESA/SYKE, Sentinel-2 kuukausittaiset indeksimosaiikit
    </li>
    <li>
      <strong>Item</strong> (suom. Tuote) -
      ydinyksikkö, joka kuvailee dataa tietyltä ajalta ja paikalta.
      Tuote sisältää yhden tai useampia Resursseja.
      Esimerkki: ESA/SYKE, Sentinel-2 kuukausittaiset indeksimosaiikit
      alueelta X ja ajankohdasta Y
    </li>
    <li>
      <strong>Asset</strong> (suom. Resurssi) -
      Tuotteeseen liittyvät tiedostot ja linkit, jotka voivat olla
      datatiedostoja tai linkkejä metatietoon jne.
      Esimerkki: NDVI indeksi ESA/SYKE, Sentinel-2 kuukausittaiset
      indeksimosaiikit alueelta X ja ajankohdasta Y.
      Aineisto sisältää myös muita indekseja, joista jokainen on Resurssi,
      sillä jokainen indeksi on tallennettu erilliseen tiedostoon
    </li>
  </ul>

  <img :src="'STAC.png'" style="width: 100%" />

  <p>
    Maailmanlaajuisesti on olemassa paljon STAC-katalogeja.
    STAC Index -sivusto sisältää
    <a href="https://stacindex.org/catalogs" target="_blank">
      listan julkisista STAC luetteloista</a>
    ja tarjoaa myös hyvän mahdollisuuden tutustua erilaisiin luetteloihin.
  </p>
  <p>
    Etsiessä dataa STAC luetteloista tärkeimmät kriteerit ovat sijainti,
    aika sekä kokoelman nimi.
  </p>
  <p>
    STAC on mahdollista toteuttaa <strong>staattisena</strong> kokoelmana
    JSON-tiedostoja tai <strong>ohjelmointirajapintana (API:na)</strong>.
    STAC API tukee nopeaa hakua myös isoista aineistoista,
    joissa on tuhansia tai miljoonia tuotteita.
  </p>
  <p>
    Paras tallennusvaihtoehto STAC:ista linkitetylle varsinaiselle datalle
    on pilvioptimoitu tiedostomuoto:
    <a href="https://www.cogeo.org/"> Cloud-Optimized GeoTiff (COG)</a>
    rasteriaineistoille ja <a href="https://copc.io/">COPC</a>
    pistepilviaineistoille. Pilvioptimoitut tiedostomuodot mahdollistavat
    aineistojen osittaisen latauksen, että ladataan vain tietty alue
    tai vain yleistetty versio aineistosta.
    Myös muita tiedostomuotoja voidaan käyttää, mutta riippuen niiden
    sisäisistä rakenteista osittainen lataus voi toimia epäoptimaalisesti.
  </p>
  <p>
    Jotta STAC rajapintaa voi hyödyntää aineistojen hakemiseen, tarvitaan erillisiä <strong>työkaluja</strong>.
    <a href="https://radiantearth.github.io/stac-browser/" target="_blank">STAC Browser:ia</a>
    voi käyttää STAC-datan hakemiseen rajapinnasta verkkoselaimella.
    <a href="https://stacindex.org/ecosystem#/" target="_blank">STAC loppukäyttäjän työkaluja</a> on tarjolla
    <a href="https://pystac-client.readthedocs.io/en/latest" target="_blank">Pythonille </a>,
    <a href="https://cran.r-project.org/web/packages/rstac/index.html" target="_blank">R:lle</a>,
    <a href="https://stac-utils.github.io/qgis-stac-plugin/" target="_blank">QGIS:lle</a>
    sekä <a href="https://github.com/JuliaClimate/STAC.jl" target="_blank">Julialle</a>.
    Lisäksi <a href="https://docs.csc.fi/support/tutorials/gis/virtual-rasters/#creating-virtual-raster-with-gdal-gdal_translate-and-stac" target="_blank">GDAL</a>
    mahdollistaa virtuaalirastereiden muodostamisen STAC haun tulosten pohjalta.
    Jokaisella STAC luettelolla on osoite, joka on annettava työkaluille luetteloiden löytäämiseksi.
  </p>

  <h3>Esimerkkiskriptit: Python ja R</h3>
  <p>
    Pythonille ja R:lle on olemassa lisäksi kirjastoja moniaikaisen rasteridatan lataukseen ja analysointiin. Nämä työkalut tukevat myös rinnakkaislaskentaa, jolloin suurten aineistojen käsittely on helposti mahdollista.
    CSC on valmistellut esimerkkiskriptejä <a href="https://www.github.com/csc-training/geocomputing/blob/master/python/STAC" target="_blank">Pythonille</a>
    ja <a href="https://www.github.com/csc-training/geocomputing/blob/master/R/STAC" target="_blank">R:lle</a>, jotka havainnollistavat, miten dataa etsitään ja käytetään STAC rajapinnasta ja mitkä ovat tärkeimmät tarvittavat kirjastot.
  </p>

  <h2>Paituli STAC sisältö</h2>
  <p>
    Paituli STAC luettelo sisältää suomalaista dataa, täällä hetkellä noin 100 eri aineistoa.
    Tarkka aineistolista löytyy <a href="https://radiantearth.github.io/stac-browser/#/external/paituli.csc.fi/geoserver/ogc/stac/v1?.language=en" target="_blank">
      STAC Browser Paituli STAC:lle sivustolta</a>,
    katso mitä kokoelmia on saatavilla, etsi tuotteita sekä esikatsele
    COG-tiedostoja.
  </p>
  <c-list>
    <c-list-item>
      <c-list-item-title>Tallennettuna CSC:n Espoon ja Kajaanin datakeskukseen</c-list-item-title>
      <ul>
        <li>
          Paituli oma aineisto, paljon erilaisia aineistoja.
          Erilaisia tiedostomuotoja,
          mm. GeoTiff, COG, JPG2000 ja NetCDF.
        </li>
        <li>
          Kaikkilla Paitulin aineistojen Tuotteilla on 2 Resurssia -
          yksi julkinen URL-osoite Espoon dataan ja yksi Puhdin paikallinen polku.
          Puhtin paikallisia polkuja voi ja tulisi käyttää vain,
          jos työskennellään CSC:n Puhti superkoneella.
        </li>
      </ul>
    </c-list-item>
    <c-list-item>
      <c-list-item-title>Tallennettuna CSC:n Kajaanin datakeskukseen</c-list-item-title>
      <ul>
        <li>
          ESA, <a href="https://a3s.fi/sentinel-readme/README.txt" target="_blank">Sentinel-2 products</a >,
          processed to Level-2A (Surface Reflectance), a selection of mostly cloud-free products
          from Finland. Downloaded to CSC Allas by Maria Yli-Heikkilä (LUKE), Arttu Kivimäki
          (NLS/FGI) and Matias Heino (Aalto). Files in original JPG2000 format.
        </li>
        <li>
          <a href="https://vm0160.kaj.pouta.csc.fi/geocubes/datasets/" target="_blank">
            Geoportti geocubes</a>, paljon erilaisia rasteriaineistoja.
          Kaikki aineistot laskettu samaan pikselijakoon, saatavilla eri mittakaavoissa.
          Kaikki tiedostot ovat GeoTiffeja, jokaisesta aineisosta saatavilla myös COG.
        </li>
      </ul>
    </c-list-item>
    <c-list-item>
      <c-list-item-title>
        FMI:lla tallennettuna, <a href="https://pta.data.lit.fmi.fi/stac/root.json" target="_blank">FMI Tuulituhohaukka</a>
        staattisesta STAC luettelosta, kaikki tiedostot COG:na:
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
    Paitulin STAC rajapinnan osoite on: <a href="https://paituli.csc.fi/geoserver/ogc/stac/v1" target="_blank">https://paituli.csc.fi/geoserver/ogc/stac/v1</a>
  </p>
  <p>
    <a href="https://gis-workshops.a3s.fi/2023-06-13-stac-workshop.pdf"
    >Slides of "STAC - how to find and use spatiotemporal data easily?" workshop</a
    >, 13.6.2023
  </p>
  <p>
    Paituli STAC on kehitetty <a href="https://www.aka.fi/en/" target="_blank">
      Suomen Akatemian </a> <a href="https://www.geoportti.fi/" target="_blank">Geoportti</a>
    rahoituksella.
  </p>
  <p>
    Jos teillä on palautetta, ole hyvä ja ota yhteyttä CSC:hen: servicedesk@csc.fi.
    Jos haluat lisää (omia?) aineistoja Paituli STAC:iin, varmista ensin,
    että aineistot ovat ladattavissa URL-osoitteiden avulla
    (pilvioptimoitussa tiedostomuodossa) ja sitten ota yhteyttä CSC:lle.
  </p>
</template>
