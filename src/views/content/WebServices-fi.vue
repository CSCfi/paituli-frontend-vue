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
  <h4>Saatavilla olevat aineistot</h4>

  <p> Paituli tarjoaa yli 600 aineistoa OGC rajapintojen kautta. Aineistojen tarkat nimet löytyvät <a href="download.html">Latauspalvelusta</a>: valitse aineisto ja sitten klikkaa Rajapinnat.

    <ul>
      <li>
        <a href="https://paituli.csc.fi/geoserver/web/wicket/bookmarkable/org.geoserver.web.demo.MapPreviewPage">Lista kaikista OGC rajapintojen kautta saatavilla olevista aineistoista</a>
      </li>
    </ul>


  </p>
  <h2>Tuetut OGC API rajapintapalvelut</h2>

  <h3>Perinteiset OGC rajapinnat</h3>
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

  <h2>Uudet OGC API rajapintapalvelut</h2>
  <p>
    Uudet <a href="https://ogcapi.ogc.org/">OGC API standardit</a>
    ovat vielä kehittymässä. Paitulissa OGC API rajapintojen saatavuus
    riippuu GeoServerin tarjottavista mahdollisuuksista.
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

  <h3>Käyttövinkkejä</h3>
  <p>
    WMTS-palvelussa karttatiilet ovat saatavilla vain etukäteen määritetyissä mittakaavoissa ja laajuuksissa. WMS-palvelussa kartan koko ja mittakaava voidaan valita vapaasti. WMTS-palvelu on yleensä nopeampi, sillä karttatiilet ovat usein jo palvelun välimuistissa valmiina. Karttatasosta voidaan pyytä myös vain osa käyttämällä suodattimia, esim. BBOX määrittele pyydettävän maantietteellisen alueen.
  </p>

  <p>
    WMTS-palveluiden ruudukot: ERTS-TM35-FIN (EPSG:3067,
    <a
      href="http://docs.jhs-suositukset.fi/jhs-suositukset/JHS180_liite1/JHS180_liite1.html#H7"
      target="_blank"
    >JHS180</a
    >) ja Spherical Mercator (EPSG:3857).
  </p>

  <p>
    Rajapinta-aineistojen lisenssiehdot ovat vastaavat kuin latauspalvelun kautta
    ladatuissa aineistoissa. Lisenssiehdot löytyvät
    <a href="download.html">Latauspalvelu</a> sivulta.
  </p>
  <p>
    Jos Paitulin rajapintoja käytetään nettisovelluksessa, aineiston tuottaja, nimi (mm vuosi) ja Paituli on mainittava.
  </p>

  <h3>OGC rajapintapalveluiden käyttöohjeita</h3>
  <ul>
    <li><a href="https://docs.qgis.org/latest/en/docs/user_manual/working_with_ogc/ogc_client_support.html#">QGIS manual: Working with OGC / ISO protocols</a></li>
    <li><a href="https://pro.arcgis.com/en/pro-app/latest/help/data/services/ogc-services.htm">ArcGIS Pro käyttöohje: About using OGC service layers</a></li>
    <li><a href="https://pro.arcgis.com/en/pro-app/latest/help/data/services/add-ogc-api-services.htm">ArcGIS Pro käyttöohje: Add OGC API services</a></li>
    <li><a href="http://www.stat.fi/static/media/uploads/org/avoindata/rajapintapalveluiden_kayttoonotto_qgis.pdf">Tilastokeskuksen rajapintapalveluiden käyttöönotto QGIS-ohjelmistossa</a></li>
    <li><a href="http://docs.geoserver.org/latest/en/user/services/index.html">GeoServerin käyttöohje</a></li>
  </ul>

</template>
