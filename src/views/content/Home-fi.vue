<script setup lang="ts">
import AppLink from '@/components/common/AppLink.vue';
import { CAlertType } from '@cscfi/csc-ui';

</script>

<template>
  <h1>Paitulista</h1>
  <p>
    Paituli on suomalainen paikkatietopalvelu. Paituli on ensisijaisesti suunnattu akateemisille käyttäjille, mutta se on avoin kaikille. Palvelun kautta on saatavilla paikkatietoaineistoja, jotka ovat tärkeitä tutkimuksessa ja opetuksessa. Muista paikkatietoaineistopalveluista poiketen Paitulista löydät myös historiallisia vuosiversioita. Useiden aineistojen ensimmäiset versiot ovat vuodelta 2005, joka oli Paitulin perustamisvuosi. Kaikilla aineistoilla on avoimet lisenssit, useimmiten CC-BY-4.0.
  </p>
  <p>
    Käyttäjillä joilla on affiliaatio suomalaiseen korkeakouluun on mahdollisuus myös <AppLink to="/opendata">jakaa aineistoja</AppLink> Paitulissa.
  </p>

  <h2>Aineistot</h2>
  <p>
    Paituli sisältää seuraavien organisaatioiden tuottamia paikkatietoaineistoja:
  </p>
  <ul>
    <li><AppLink to="https://dvv.fi">Digi- ja väestötietovirasto</AppLink></li>
    <li><AppLink to="https://www.helsinki.fi/fi">Helsingin yliopisto</AppLink></li>
    <li><AppLink to="http://www.ilmatieteenlaitos.fi">Ilmatieteen laitos (FMI)</AppLink></li>
    <li><AppLink to="http://www.kotus.fi">Kotimaisten kielten keskus (KOTUS)</AppLink></li>
    <li><AppLink to="https://science.nasa.gov/mission/landsat/">NASA/USGS, Landsat</AppLink></li>
    <li><AppLink to="http://www.luke.fi">Luonnonvarakeskus</AppLink></li>
    <li><AppLink to="http://www.maanmittauslaitos.fi">Maanmittauslaitos (MML)</AppLink></li>
    <li><AppLink to="https://www.ruokavirasto.fi/">Ruokavirasto</AppLink></li>
    <li><AppLink to="https://www.slu.se/en/">Ruotsin maataloustieteellinen yliopisto</AppLink></li>
    <li><AppLink to="http://www.tilastokeskus.fi">Tilastokeskus</AppLink></li>
    <li><AppLink to="http://www.digiroad.fi">Väylävirasto, Digiroad</AppLink></li>
  </ul>
  <c-alert :type="CAlertType.Info">
    <span>
      Tarkka lista saatavilla olevista aineistoista löytyy <AppLink to="https://etsin.fairdata.fi/datasets?facet_keyword=Paituli"> Fairdata Etsin -palvelusta</AppLink>.
      <br>Aineistojen löytämiseksi Etsimessä kokeile vapaata tekstihakua tai vasemmalla olevia suodattimia.
    </span>
  </c-alert>

  <h2>Aineistojen käyttö</h2>
  <p>
    Paituli tarjoaa aineistojen käyttämiseksi useita mahdollisuuksia:
  </p>
  <ul>
    <li>
      <AppLink to="/download">Latauspalvelu</AppLink>, joka mahdollistaa:
      <ul>
        <li>
          Useiden <b>aineistojen esikatselun</b>, mm. ominaisuustiedon kyselyn.
        </li>
        <li>
          Kaikkien tai valittujen karttalehtien tiedostojen latauksen <b>zip-pakettina</b>, max 3Gb.
        </li>
        <li>
          Kaikkien tai valittujen karttalehtien tiedostolistauksen latauksen.
        </li>
      </ul>
    </li>
    <li>
      Isommat aineistokokonaisuudet voi ladata <AppLink to="/files">HTTPS, FTP and rsync</AppLink> työkalujen avulla.
    </li>
    <li>
      Useat aineistot ovat saatavilla <AppLink to="/webservices">OGC API-rajapintojen kautta</AppLink>: WMS / Maps, WCS / Coverages, WMTS / Tiles and WFS / Features.
    </li>
    <li>
      Paitulin kaikki rasteriaineistot ovat saatavilla <AppLink to="/stac">STAC</AppLink>:in kautta. Paituli STAC sisältää enemmän aineistoja kuin Paitulin latauspalvelu, esimerkiksi Geoportti Geocube -aineistot ja useita suomalaisia kaukokartoitusaineistoja.
    </li>
    <li>
      <AppLink to="https://research.csc.fi/gis_data_in_csc_computing_env">CSC Roihu supertietokoneen avoimet GIS aineistot</AppLink> sisältävät melkein kaikki Paitulin aineistot, jotta näiden käyttö olisi helppoa ja nopeaa Puhdin käyttäjille.
    </li>
  </ul>

  <h2>Uutiset</h2>
  <c-list>
    <c-list-item>
      <c-list-item-title>
        29.5.2026
      </c-list-item-title>
      <span>
        Paituli-verkkopalvelun laaja päivitys. Uusi Paituli tarjoaa pääosin samat toiminnot kuin aiempi versio. Uusia ominaisuuksia ovat karttalehtien valinta GeoJSONin ja paikannimen perusteella sekä kaikkien aineistojen tiedonsiirtolinkkien, mukaan lukien tiettyihin aineistoihin liittyvien rajapintojen, aiempaa parempi näkyvyys. Vanha Metadata-sivu ei ole enää käytettävissä; käytä <AppLink to="https://etsin.fairdata.fi/datasets?facet_keyword=Paituli">Fairdata Etsin</AppLink> -palvelua aineistojen löytämiseen.
      </span>
    </c-list-item>
    <c-list-item>
      <c-list-item-title>
        15.4.2026
      </c-list-item-title>
      Päivitetty Helsingin yliopisto/LUOMUS SPECTRE-aineistoja.
    </c-list-item>
    <c-list-item>
      <c-list-item-title>
        13.3.2026
      </c-list-item-title>
      Ilmatieteenlaitoksen 10 km sääaineistoja päivitetty, nyt saatavilla data vuosille 1961-2025: päivittäinen alin, ylin ja keskilämpötila, sademäärä, lumen syvyys, ilmanpaine, säteily, suhteellinen kosteus, sekä kuukausittainen keskilämpötila ja sademäärä.
    </c-list-item>
    <c-list-item>
      <c-list-item-title>
        4.3.2026
      </c-list-item-title>
      <span>
        Päivitetty <AppLink to="https://github.com/csc-training/geocomputing/tree/master/python/STAC" target="_blanc">STAC:in Python-esimerkkejä</AppLink>, uutena käytössä odc-stac-kirjasto.
      </span>
    </c-list-item>
    <c-list-item>
      <c-list-item-title>
        23.2.2026
      </c-list-item-title>
      Lisätty Ruotsin maatalousyliopiston peltomaa Pohjois-Suomessa 1947-1979 aineisto, joka on koneoppimismenetelmiin laskettu historiallisista maastokartoista.
    </c-list-item>
    <c-list-item>
      <c-list-item-title>
        18.12.2025
      </c-list-item-title>
      Lisätty Tilastokeskuksen kuntien avainluvut 2023 ja 2024.
    </c-list-item>
    <c-list-item>
      <c-list-item-title>
        25.7.2025
      </c-list-item-title>
      Lisätty Tilastokeskuksen väestö kunnittain 2024, väestöruutuaineisto 2024, tieliikenneonnettomuudet 2023 ja Paavo 2025.
    </c-list-item>
    <c-list-item>
      <c-list-item-title>
        2.6.2025
      </c-list-item-title>
      Lisätty Digi- ja väestötietoviraston rakennusten osoitetiedot 2025 Shape-tiedostona.
    </c-list-item>
    <c-list-item>
      <c-list-item-title>
        30.5.2025
      </c-list-item-title>
      Lisätty Maanmittauslaitoksen aineistoja 2025: maastotietokanta, hallintorajat, kiinteistörajat, painoväri ja taustaväri-peruskartta, maastokartat useissa mittakaavoissa rasterina ja vektorina.
    </c-list-item>
    <c-list-item>
      <c-list-item-title>
        24.5.2025
      </c-list-item-title>
      Lisätty Luonnonvarakeskuksen valtakunnan metsien monilähteisessä inventoinnissa (MVMI) tuotetut karttamuotoiset metsävaratiedot: 2006 - 2021.
    </c-list-item>
    <c-list-item>
      <c-list-item-title>
        15.4.2024
      </c-list-item-title>
      <span>
        Lisätty yli 30 000 historiallisia georeferoitua karttaa Maanmittauslaitoksen arkistosta vuosilta 1863-2020. Pitäjäkartat, taloudelliset kartat, topografiset kartat, maastokartat ja peruskartat mittakaavoissa 1:20 000 - 1:500 000. <AppLink to="https://www.maanmittauslaitos.fi/ajankohtaista/yli-30-000-vanhaa-karttaa-jopa-150-vuoden-takaa-nyt-paikkatietona" >Lisätietoja MML:n sivuilta</AppLink>.
      </span>
    </c-list-item>
    <c-list-item>
      <c-list-item-title>
        21.3.2019
      </c-list-item-title>
      MML:n laserkeilausaineistoa, 2m DEM ja ortokuva-aineistoja päivitetään Paitulissa joka viikko sunnuntaisin.
    </c-list-item>
  </c-list>

  <h2>Paituli palvelusta</h2>
  <p>
    Paitulin käyttö on käyttäjälle ilmaista. Paitulia ylläpitää <AppLink to="https://www.csc.fi">CSC - Tieteen tietotekniikan keskus</AppLink> ja rahoittavat <AppLink to="https://minedu.fi/etusivu">Opetus- ja kulttuuriministeriö</AppLink> sekä Suomen Akatemia <AppLink to="https://www.geoportti.fi">Geoportti</AppLink> projektin kautta. Paituli tarjotaan "best effort" palvelutasolla ja saavutettavuudella.
  </p>
  <p>
    Paituli on kehitetty CSC:llä hyödyntäen avoimen lähdekoodin ohjelmistoja, mm:
    <AppLink to="http://geoserver.org/">Geoserver</AppLink>,
    <AppLink to="https://openlayers.org/">OpenLayers</AppLink>,
    <AppLink to="https://vuejs.org/">Vue</AppLink>,
    <AppLink to="https://postgis.net/">PostGIS</AppLink>
    ja
    <AppLink to="https://quarkus.io/">Quarkus</AppLink>.
    Paitulin lähdekoodi on Githubissa:
    <AppLink to="https://github.com/CSCfi/paituli-frontend-vue/">front-end</AppLink> ja
    <AppLink to="https://github.com/CSCfi/avaa-paituli-backend" >back-end</AppLink>.
  </p>

  <p>
    Käyttötilastot ovat saatavilla <AppLink to="https://www.nic.funet.fi/index/geodata/yearly_reports/">Paitulin vuosiraporteista</AppLink>.
  </p>
  <p>
    <AppLink to="http://www.nic.funet.fi/index/geodata/Paituli_2026.pdf">Paitulin esityskalvot</AppLink> (2026).
  </p>

</template>

<style scoped>

c-list {
  --c-list-gap: 0;
}

</style>
