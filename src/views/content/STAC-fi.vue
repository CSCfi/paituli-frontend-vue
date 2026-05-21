<script setup lang="ts">
import AppLink from '@/components/common/AppLink.vue';
import { URLS } from '@/shared/constants';
import { copyToClipboard } from '@/shared/util';
import { CAlertType } from '@cscfi/csc-ui';
import { mdiClipboardMultipleOutline } from '@mdi/js'
</script>

<template>
  <h1>Paituli STAC</h1>
  <p>
    <AppLink to="https://stacspec.org/en/">STAC</AppLink> - Spatio Temporal Asset Catalog - on spesifikaatio ajallisen ulottuvuuden omaavan paikkatiedon kuvailemiseksi. Se yksinkertaistaa huomattavasti aineistojen <strong>hakua ja lataamista</strong>. STAC:ia käytetään eniten kaukokartoitus- ja muun rasteridatan kanssa, mutta se sopii myös vektori- ja pistepilviaineistoille. STAC sopii parhaiten aikasarjoja käsitteleviin käyttötapauksiin. Jos STAC yleisesti ei ole tuttu, lue STAC käsitteistä tämän sivun lopussa.
  </p>

  <h2>Paituli STAC aineistot</h2>
  <p>
    Paituli STAC sisältää täällä hetkellä ~175 rasteriaineistoa:
  </p>
  <ul>
    <li>
      <strong>~125 Paitulin aineistoa</strong>. Kaikilla Paitulin aineistoilla on 2 Resurssia - yksi julkinen URL-osoite ja yksi paikallinen polku CSC:n Puhti superkoneella. Paikallisia polkuja voi ja tulisi käyttää vain, jos työskennellään CSC:n Puhti superkoneella.
    </li>
    <li>
      ESA:n <AppLink to="http://urn.fi/urn:nbn:fi:fd-e1007ae5-1529-3e5c-8bf2-b218c77e25a5">Sentinel-2-tuotteet</AppLink>, prosessoitu tasolle 2A (Surface Reflectance), valikoima pääosin pilvettömiä kuvia Suomesta. Ladattu CSC Allakseen: Maria Yli-Heikkilä (LUKE), Arttu Kivimäki (MML/FGI) ja Matias Heino (Aalto).
    </li>
    <li>
      <AppLink to="https://vm0160.kaj.pouta.csc.fi/geocubes/datasets/">Geoportti geocubes</AppLink>, paljon erilaisia rasteriaineistoja. Kaikki aineistot laskettu samaan pikselijakoon, saatavilla eri mittakaavoissa.
    </li>
    <li>
      <AppLink to="https://pta.data.lit.fmi.fi/stac/root.json">12 aineistoa Ilmatieteen laitoksen Tuulituhohaukka-STAC:ista</AppLink>, sisältäen mm. Sentinel-1-, Sentinel-2- ja Landsat-mosaiikkeja sekä indeksejä.
    </li>
  </ul>
  <c-alert :type="CAlertType.Info">
    <span>
      Tarkka aineistolista löytyy <AppLink to="https://radiantearth.github.io/stac-browser/#/external/paituli.csc.fi/geoserver/ogc/stac/v1?.language=en">STAC Browser Paituli STAC:lle -sivustolta</AppLink>.
    </span>
  </c-alert>

  <h2>STAC:in käyttö</h2>
  <p>
    Datan hakemiseen ja lataamiseen STAC:ista on saatavilla useita työkaluja:
  </p>
  <ul>
    <li>
      <AppLink to="https://radiantearth.github.io/stac-browser/#/external/paituli.csc.fi/geoserver/ogc/stac/v1?.language=en">STAC Browser </AppLink> sopii parhaiten STAC sisältöihin tutustumiseen verkkoselaimella. Se ei vaadi asennuksia koneelle. STAC Browser tukee aineistojen hakua otsikon ja kuvauksen mukaan. Lisäksi on mahdollinen datan haku sijainnin ja ajan mukaan. STAC Browseria voidaan käyttää kokoelman tunnisteen ja resurssien nimien hakuun muita työkaluja varten.
    </li>
    <li>
      Pythonille, R:lle ja Julialle on kirjastoja STAC-hakuun sekä datan helppoon lataamiseen määriteltyihin datakuutioihin. Nämä soveltuvat parhaiten edistyneempään analyysiin. Työkalut tukevat myös rinnakkaislaskentaa, joten suurten aineistojen käsittely toimii hyvin. CSC on laatinut <strong>esimerkkiskriptejä</strong> <AppLink to="https://www.github.com/csc-training/geocomputing/blob/master/python/STAC">Pythonille</AppLink> ja <AppLink to="https://www.github.com/csc-training/geocomputing/blob/master/R/STAC">R:lle</AppLink>.
    </li>
    <li>
      <AppLink to="https://docs.qgis.org/latest/en/docs/user_manual/working_with_ogc/ogc_client_support.html#stac-spatiotemporal-asset-catalogs">QGIS</AppLink> ja <AppLink to="https://pro.arcgis.com/en/pro-app/latest/help/data/imagery/introduction-to-stac.htm">ArcGIS Pro</AppLink> sisältävät sisäänrakennetun tuen STAC-aineistojen hakuun ja lataamiseen.
    </li>
    <li>
      <AppLink to="https://docs.csc.fi/support/tutorials/gis/virtual-rasters/#creating-virtual-raster-with-gdal-gdal_translate-and-stac">GDAL</AppLink> mahdollistaa virtuaalirasterien luomisen STAC-hakutuloksista.
    </li>
  </ul>
  <p>
    Jokaisella STAC-katalogilla on oma osoite (end-point), joka annetaan työkaluille, jotta ne löytävät katalogin.
  </p>
  <p>
    <span>
      Paitulin STAC rajapinnan osoite on: <code>{{ URLS.STAC_PAITULI_BASE }}</code>
      <c-button ghost @click="copyToClipboard(URLS.STAC_PAITULI_BASE)" size="small">
        Kopioi <c-icon :path="mdiClipboardMultipleOutline" size="18" />
      </c-button>
    </span>
  </p>


  <h2>STAC käsitteet</h2>
  <span>
    (Suomennokset eivät ole vakiintuneita)
  </span>
  <ul dir="auto">
    <li>
      <strong>Catalog</strong> (suom. Luettelo) - yleinen palvelun metatieto ja linkit saatavilla oleviin Kokoelmiin. Esimerkki: Paituli STAC.
    </li>
    <li>
      <strong>Collection</strong> (suom. Kokoelma) - Kokoelmaan liittyvä metatieto ja linkit saatavilla oleviin Tuotteisiin. Yksi Kokoelma sisältää samantyyppisiä Tuotteita. Esimerkki: ESA/SYKE, Sentinel-2 kuukausittaiset indeksimosaiikit.
    </li>
    <li>
      <strong>Item</strong> (suom. Tuote) - ydinyksikkö, joka kuvailee dataa tietyltä ajalta ja paikalta. Tuote sisältää yhden tai useampia Resursseja. Esimerkki: ESA/SYKE, Sentinel-2 kuukausittaiset indeksimosaiikit alueelta X ja ajankohdasta Y.
    </li>
    <li>
      <strong>Asset</strong> (suom. Resurssi) - Tuotteeseen liittyvät tiedostot ja linkit, jotka voivat olla datatiedostoja tai linkkejä metatietoon jne. Esimerkki: NDVI indeksi ESA/SYKE, Sentinel-2 kuukausittaiset indeksimosaiikit alueelta X ja ajankohdasta Y. Aineisto sisältää myös muita indeksejä, joista jokainen on Resurssi, sillä jokainen indeksi on tallennettu erilliseen tiedostoon.
    </li>
  </ul>

  <img :src="'STAC.png'" style="width: 100%" />

  <p>
    Maailmanlaajuisesti on olemassa paljon STAC-katalogeja. STAC Index -sivusto sisältää <AppLink to="https://stacindex.org/catalogs">listan julkisista STAC luetteloista</AppLink>.
  </p>
  <p>
    Dataa etsiessä STAC luetteloista tärkeimmät kriteerit ovat sijainti, aika sekä kokoelman nimi. Tuotteilla voi olla myös lisätietoja, esimerkiksi kaukokartoituksen optisten kuvien pilvisyys, jota voidaan myös sisällyttää hakuehtoihin.
  </p>
  <p>
    Paras tallennusvaihtoehto STAC:ista linkitetylle varsinaiselle datalle on pilvioptimoitu tiedostomuoto: <AppLink to="https://www.cogeo.org/"> Cloud-Optimized GeoTiff (COG)</AppLink> rasteriaineistoille. Pilvioptimoitut tiedostomuodot mahdollistavat aineistojen osittaisen latauksen, niin että ladataan vain tietty alue tai vain yleistetty versio aineistosta. Myös muita tiedostomuotoja voidaan käyttää, mutta osittainen lataus voi toimia epäoptimaalisesti riippuen niiden sisäisistä rakenteista.
  </p>
  <p>
    Lisätietoa löytyy <AppLink to="https://gis-workshops.a3s.fi/2025-03-11-stac-workshop.pdf">"STAC – how to find and use spatiotemporal data easily?"</AppLink> (2025) -työpajan kalvoista.
  </p>

</template>

<style scoped>

c-button {
  margin-left: 1em;
}
</style>
