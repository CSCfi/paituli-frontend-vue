<script setup lang="ts">
import AppLink from '@/components/common/AppLink.vue';
import { URLS } from '@/shared/constants'
import { CAlertType } from '@cscfi/csc-ui';

</script>

<template>
  <h1>Paitulin rajapintapalvelut</h1>
  <p>
    Monet Paitulin aineistot ovat saatavilla OGC:n mukaisista rajapintapalveluista: WMS, WCS, WFS, WMTS. Myös uudet OGC API standardit ovat käytettävissä. OGC rajapintapalvelut mahdollistavat datan latauksen suoraan netti- tai työpöytäsovellukseen, tai aineiston analyysiskriptiin, jolloin dataa ei ladata ensin paikalliselle koneelle tiedostona. Tämä mahdollistaa aina ajan tasalla olevan datan käytön nopeasti ja helposti. Yhteyden muodostamiseksi tarvitaan palvelun URL osoite. Yhteyden muodostamisen jälkeen käyttäjälle listataan kaikki palvelusta saatavilla olevat karttatasot.
  </p>

  <h2>Saatavilla olevat aineistot</h2>
  <p>
    Paituli tarjoaa yli 600 aineistoa OGC rajapintojen kautta. Aineistojen tarkat nimet löytyvät <AppLink to="/download">Latauspalvelusta</AppLink>: valitse aineisto ja sen jälkeen klikkaa Rajapinnat.
  </p>
  <c-alert :type="CAlertType.Info">
    <span>
      <AppLink to="https://paituli.csc.fi/geoserver/web/wicket/bookmarkable/org.geoserver.web.demo.MapPreviewPage"> Lista kaikista OGC rajapintojen kautta saatavilla olevista aineistoista</AppLink>
    </span>
  </c-alert>
  <br>

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
          <td>Vektoriaineisto</td>
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
    Uudet <AppLink to="https://ogcapi.ogc.org/">OGC API standardit</AppLink> ovat vielä kehittymässä. Paitulissa OGC API rajapintojen saatavuus riippuu GeoServeriin tarjottavista mahdollisuuksista.
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
          <td><b>Maps</b>, hieman kuin WMS</td>
          <td>Karttakuva visualisointiin</td>
          <td>{{ URLS.OGC_MAPS_PAITULI_BASE }}</td>
        </tr>
        <tr>
          <td><b>Tiles</b>, hieman kuin WMTS</td>
          <td>Karttakuvan tiili visualisointiin</td>
          <td>{{ URLS.OGC_TILES_PAITULI_BASE }}</td>
        </tr>
        <tr>
          <td><b>Features</b>, hieman kuin WFS</td>
          <td>Vektoriaineisto</td>
          <td>{{ URLS.OGC_FEATURES_PAITULI_BASE }}</td>
        </tr>
        <tr>
          <td><b>Coverages</b>, hieman kuin WCS</td>
          <td>Rasteriaineisto</td>
          <td>{{ URLS.OGC_COVERAGES_PAITULI_BASE }}</td>
        </tr>
      </tbody>
    </table>
  </c-table>

  <h3>Käyttövinkkejä</h3>
  <p>
    WMTS-palvelussa karttatiilet ovat saatavilla vain etukäteen määritetyissä mittakaavoissa ja laajuuksissa. WMS-palvelussa kartan koko ja mittakaava voidaan valita vapaasti. WMTS-palvelu on yleensä nopeampi, sillä karttatiilet ovat usein jo palvelun välimuistissa valmiina. Karttatasosta voidaan pyytää myös vain osa käyttämällä suodattimia, esim. BBOX määrittelee pyydettävän maantieteellisen alueen.
  </p>
  <p>
    WMTS-palveluiden ruudukot: ERTS-TM35-FIN (EPSG:3067, <AppLink to="http://docs.jhs-suositukset.fi/jhs-suositukset/JHS180_liite1/JHS180_liite1.html#H7">JHS180</AppLink>) ja Spherical Mercator (EPSG:3857).
  </p>
  <p>
    Rajapinta-aineistojen lisenssiehdot ovat vastaavat kuin latauspalvelun kautta ladatuissa aineistoissa. Lisenssiehdot löytyvät <AppLink to="/download">Latauspalvelu</AppLink> -sivulta.
  </p>
  <p>
    Jos Paitulin rajapintoja käytetään nettisovelluksessa, aineiston tuottaja, nimi (mm vuosi) ja Paituli on mainittava.
  </p>

  <h3>OGC rajapintapalveluiden käyttöohjeita</h3>
  <ul>
    <li>
      <AppLink to="https://docs.qgis.org/latest/en/docs/user_manual/working_with_ogc/ogc_client_support.html#">QGIS manual: Working with OGC / ISO protocols</AppLink>
    </li>
    <li>
      <AppLink to="https://pro.arcgis.com/en/pro-app/latest/help/data/services/ogc-services.htm">ArcGIS Pro käyttöohje: About using OGC service layers</AppLink>
    </li>
    <li>
      <AppLink to="https://pro.arcgis.com/en/pro-app/latest/help/data/services/add-ogc-api-services.htm">ArcGIS Pro käyttöohje: Add OGC API services</AppLink>
    </li>
    <li>
      <AppLink to="http://www.stat.fi/static/media/uploads/org/avoindata/rajapintapalveluiden_kayttoonotto_qgis.pdf">Tilastokeskuksen rajapintapalveluiden käyttöönotto QGIS-ohjelmistossa</AppLink>
    </li>
    <li>
      <AppLink to="http://docs.geoserver.org/latest/en/user/services/index.html">GeoServerin käyttöohje</AppLink>
    </li>
  </ul>

</template>
