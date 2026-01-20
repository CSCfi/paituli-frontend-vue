<script setup lang="ts">
import { URLS } from '@/shared/constants'

</script>

<template>
  <h1>Paitulin rajapintapalvelut</h1>
  <p>
    Monet Paitulin aineistot ovat saatavilla OGC:n mukaisista
    rajapintapalveluista: WMS, WCS, WFS, WMTS. Myös uudet OGC API standardit ovat käytettävissä.
    OGC rajapintapalvelut mahdollistavat datan latauksen suoraan netti- tai työpöytäsovellukseen,
    tai aineiston analyysiskriptiin, näin että dataa ei ladata ensin paikalliselle koneelle tiedostona.
    Tämä mahdollistaa aina ajan tasalla olevan datan käytön nopeasti ja helposti.
    Yhteyden muodostamiseksi tarvitaan palvelun URL osoite.
    Yhteyden muodostamisen jälkeen käyttäjälle listataan kaikki
    palvelusta saatavilla olevat karttatasot.
  </p>
  <p>
    Nähdäksesi karttatasojen tunnisteet sekä mitkä rajapinnat ovat saatavilla
    dataseteille, ensin valitse datasetti
    <RouterLink to="/download">Latauspalvelusta</RouterLink>
    ja sitten Palvelut ➔ OGC APIt.
  </p>

  <h2>Perinteiset OGC standardit</h2>
  <c-table>
    <table>
      <thead>
        <tr>
          <th>Tyyppi</th>
          <th>Pyynnön tulos</th>
          <th>Pääte</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><b>WMS</b>, Web Map Service</td>
          <td>Karttakuva visualisointiin</td>
          <td>{{ URLS.WMS_PAITULI_BASE }}</td>
        </tr>
        <tr>
          <td><b>WMTS</b>, Web Map Tile Service</td>
          <td>Karttakuvan tiili visualisointiin</td>
          <td>{{ URLS.WMTS_PAITULI_BASE_GWC }}</td>
        </tr>
        <tr>
          <td><b>WFS</b>, Web Feature Service</td>
          <td>Vectoriaineisto</td>
          <td>{{ URLS.WFS_PAITULI_BASE }}</td>
        </tr>
        <tr>
          <td><b>WCS</b>, Web Coverage Service</td>
          <td>Rasteriaineisto</td>
          <td>{{ URLS.WCS_PAITULI_BASE }}</td>
        </tr>
      </tbody>
    </table>
  </c-table>

  <h2>Uudet OGC standardit</h2>
  <p>
    Uudet <a href="https://ogcapi.ogc.org/">OGC API standardit</a>
    ovat vielä kehittymässä. Paitulissa OGC API rajapintojen saatavuus
    riippuu GeoServerin tarjottavista mahdollisuuksista.
    Myös asiakassovellukset ovat vielä kehittymässä,
    esimerkiksi ArcGIS Pro ja QGIS tukevat täällä hetkellä vain
    OGC API Features rajapintaa.
  </p>

  <c-table>
    <table>
      <thead>
        <tr>
          <th>Tyyppi</th>
          <th>Pyynnön tulos</th>
          <th>Pääte</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><b>Maps</b>, samankaltainen kuin WMS</td>
          <td>Karttakuva visualisointiin</td>
          <td>{{ URLS.OGC_MAPS_PAITULI_BASE }}</td>
        </tr>
        <tr>
          <td><b>Tiles</b>, samankaltainen kuin WMTS</td>
          <td>Karttakuvan tiili visualisointiin</td>
          <td>{{ URLS.OGC_TILES_PAITULI_BASE }}</td>
        </tr>
        <tr>
          <td><b>Features</b>, samankaltainen kuin WFS</td>
          <td>Vektoriaineisto</td>
          <td>{{ URLS.OGC_FEATURES_PAITULI_BASE }}</td>
        </tr>
        <tr>
          <td><b>Coverages</b>, samankaltainen kuin WCS</td>
          <td>Rasteriaineisto</td>
          <td>{{ URLS.OGC_COVERAGES_PAITULI_BASE }}</td>
        </tr>
      </tbody>
    </table>
  </c-table>

  <p>
    WMTS-palvelussa karttatiilit ovat saatavilla vain etukäteen
    määritetyissä mittakaavoissa ja laajuuksissa.
    WMS-palvelussa kartan koko ja mittakaava voidaan valita vapaasti.
    WMTS-palvelu on yleensä nopeampi, sillä karttatiilet ovat usein
    jo palvelun välimuistissa valmiina.
    Karttatasosta voidaan pyytä myös vain osa käyttämällä suodattimia,
    esim. BBOX määrittele pyydettävän maantietteellisen alueen.
  </p>
  <p>
    WMTS-palveluiden ruudukot: ERTS-TM35-FIN (EPSG:3067,
    <a
      href="http://docs.jhs-suositukset.fi/jhs-suositukset/JHS180_liite1/JHS180_liite1.html#H7"
      target="_blank">
      JHS180
    </a>)
    ja Spherical Mercator (EPSG:3857).
  </p>

  <p>
    Lisenssiehdot rajapintojen kautta käytetylle aineistolle on sama
    kuin Latauspalvelun kautta ladatulle aineistolle.
    Nähdäksesi aineiston lisenssin, valitse se
    <RouterLink to="/download">Latauspalvelusta</RouterLink>.
    Jos käytät edellä listattuja rajapintoja sovelluksessasi,
    Paituli täytyy mainita niiden ohessa.
  </p>

  <h2>OGC rajapintapalveluiden käyttöohjeita:</h2>
  <ul>
    <li>
      <a href="https://docs.qgis.org/3.16/en/docs/training_manual/online_resources/wms.html">
        QGIS koulutusohje: Web mapping services</a>
    </li>
    <li>
      <a href="https://pro.arcgis.com/en/pro-app/latest/help/data/services/ogc-services.htm">
        ArcGIS Pro käyttöohje: About using OGC service layers</a>
    </li>
    <li>
      <a href="https://pro.arcgis.com/en/pro-app/latest/help/data/services/add-ogc-api-services.htm">
        ArcGIS Pro käyttöohje: Add OGC API services</a>
    </li>
    <li>
      <a href="http://docs.geoserver.org/latest/en/user/services/index.html">
        GeoServerin käyttöohje</a>
    </li>
  </ul>

</template>
