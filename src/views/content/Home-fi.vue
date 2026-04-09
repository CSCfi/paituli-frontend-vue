<template>
  <h1>Paitulista</h1>
  <p>Paituli on suomalainen paikkatietopalvelu. Paituli on ensisijaisesti suunnattu akateemisille käyttäjille, mutta se on avoin kaikille. Palvelun kautta on saatavilla paikkatietoaineistoja, jotka ovat tärkeitä tutkimuksessa ja opetuksessa. Muista paikkatietoaineistopalveluista poiketen Paitulista löydät myös historiallisia vuosiversioita. Useiden aineistojen ensimmäiset versiot ovat vuodelta 2005, jolloin Paituli aloitti toimintansa. Kaikilla aineistoilla on avoin lisenssejä, useimmiten CC-BY-4.0 lisenssi.
  </p>

  <p>Suomen akateemisilla käyttäjillä on mahdollisuus myös
    <RouterLink to="/opendata">jakaa aineistoja</RouterLink>
    Paitulissa.
  </p>
  <p>
    <a href="http://www.nic.funet.fi/index/geodata/Paituli_2026.pptx" target="_blank">Paitulin PowerPoint esityskalvot</a>
    (2026).
  </p>

  <h2>Aineistot</h2>

  Paituli sisältää seuraavien organisaatioiden tuottamia paikkatietoaineistoja:
  <ul>
    <li>
      <a href="https://dvv.fi" target="_blank">Digi- ja väestötietovirasto</a>
    </li>
    <li>
      <a href="https://www.helsinki.fi/fi" target="_blank">Helsingin yliopisto</a>
    </li>
    <li>
      <a href="http://www.ilmatieteenlaitos.fi" target="_blank">Ilmatieteen laitos (FMI)</a>
    </li>
    <li>
      <a href="http://www.kotus.fi" target="_blank">Kotimaisten kielten keskus (KOTUS)</a>
    </li>
    <li>
      <a href="https://science.nasa.gov/mission/landsat/" target="_blank">NASA/USGS, Landsat</a>
    </li>
    <li>
      <a href="http://www.luke.fi" target="_blank">Luonnonvarakeskus</a>
    </li>
    <li>
      <a href="http://www.maanmittauslaitos.fi" target="_blank">Maanmittauslaitos (MML)</a>
    </li>
    <li>
      <a href="https://www.ruokavirasto.fi/" target="_blank">Ruokavirasto</a>
    </li>
    <li>
      <a href="https://www.slu.se/en/" target="_blank">Ruotsin maatalousyliopisto</a>
    </li>
    <li>
      <a href="http://www.tilastokeskus.fi" target="_blank">Tilastokeskus</a>
    </li>
    <li>
      <a href="http://www.digiroad.fi" target="_blank">Väylävirasto, Digiroad</a>
    </li>
  </ul>
  <p><a href="https://etsin.fairdata.fi/datasets?facet_keyword=Paituli" target="_blank">Tarkka lista saatavilla olevista aineistoista</a> löytyy Fairdata Etsin-palvelusta. Etsimessä, kokeile vapaata tekstihakua tai vasemmalla olevia suodattimia aineistojen löytämiseksi.
  </p>

  <h2>Aineistojen käyttö</h2>

  <p>Paituli tarjoa aineistojen käyttämiseksi useita mahdollisuuksia:

    <ul>
      <li>
        <RouterLink to="/download">Latauspalvelu sivun</RouterLink> mahdollistaa:
        <ul>
          <li>Useiden <b>aineistojen esikatselun</b>, mm. ominaisuustiedon kysely.
          </li>
          <li>Kaikkien tai valittujen karttalehtien tiedostojen lataus <b>zip-pakettina</b>, max 3Gb.
          </li>
          <li>Kaikkien tai valittujen karttalehtien tiedostolistauksen lataus.
          </li>
        </ul>
      </li>
      <li>Isommat aineistokokonaisuudet voi data
        <RouterLink to="/files">HTTPS, FTP and rsync</RouterLink>
        työkalujen avulla.
      </li>
      <li>Useat aineistot ovat saatavilla
        <RouterLink to="/webservices">OGC API-rajapintojen kautta:</RouterLink>
        WMS / Maps, WCS / Coverages, WMTS / Tiles and WFS / Features.
      </li>
      <li>Paitulin kaikki rasteriaineistot ovat saatavilla <RouterLink to="/stac">STAC</RouterLink>:in kautta. Paituli STAC sisältää enemmän aineistoja kuin Paitulin latauspalvelu, esimerkiksi Geoportti Geocube aineistot ja useita suomalaisia kaukokartoitus aineistoja.
      </li>
      <li>
        <a href="https://research.csc.fi/gis_data_in_csc_computing_env" target="_blank">CSC Puhti supertietokoneen avoimet GIS aineistot</a>
        sisältävät melkein kaikki Paitulin aineistot, jotta näiden käyttö olisi helppoa ja nopea Puhdin käyttäjille.
      </li>
    </ul>
  </p>


  <h2>Uutiset</h2>
  <table>
    <tbody>
      <tr>
        <th>Päivämäärä</th>
        <th>Uutinen</th>
      </tr>
      <tr>
        <td>18.12.2025</td>
        <td>Lisätty Tilastokeskuksen kuntien avainluvut 2023 ja 2024. </td>
      </tr>
      <tr>
        <td>25.7.2025</td>
        <td>Lisätty Tilastokeskuksen väestö kunnittain 2024, väestöruutuaineisto 2024, tieliikenneonnettomuudet 2023 ja Paavo 2025.</td>
      </tr>
      <tr>
        <td>3.6.2025</td>
        <td>Ilmatieteenlaitoksen 10 km sääaineistoja päivitetty, nyt saatavilla data vuosille 1961-2024: päivittäinen alin, ylin ja keskilämpötila, sademäärä, lumen syvyys, ilmanpaine, säteily, suhteellinen kosteus, sekä kuukausittainen keskilämpötila ja sademäärä.</td>
      </tr>
      <tr>
        <td>2.6.2025</td>
        <td>Lisätty Digi- ja väestötietoviraston rakennusten osoitetiedot 2025 Shape-tiedostona.</td>
      </tr>
      <tr>
        <td>30.5.2025</td>
        <td>Lisätty Maanmittauslaitoksen aineistoja 2025: maastotietokanta, hallintorajat, kiinteistörajat, painoväri ja taustaväri-peruskartta, maastokartat useissa mittakaavoissa rasterina ja vektorina.</td>
      </tr>

      <tr>
        <td>24.5.2025</td>
        <td>Lisätty Luonnonvarakeskuksen valtakunnan metsien monilähteisessä inventoinnissa (MVMI) tuotetut karttamuotoiset metsävaratiedot: 2006 - 2021.</td>
      </tr>
      <tr>
        <td>15.4.2024</td>
        <td>Lisätty yli 30 000 historiallisia georeferoitua karttaa Maanmittauslaitoksen arkistosta vuosilta 1863-2020. Pitäjäkartat, taloudelliset kartat, topografiset kartat, maastokartat ja peruskartat mittakaavoissa 1:20 000 - 1:500 000. <a href="https://www.maanmittauslaitos.fi/ajankohtaista/yli-30-000-vanhaa-karttaa-jopa-150-vuoden-takaa-nyt-paikkatietona"  target="_blank">Lisätietoja MML:n sivuilta</a>.</td>
      </tr>
      <tr>
        <td>21.3.2019</td>
        <td>MML:n laserkeilausaineistoa, 2m DEM ja ortokuva-aineistoja päivitetään Paitulissa joka viikko sunnuntaisin.</td>
      </tr>

    </tbody>
  </table>

  <h2>Paituli palvelusta</h2>

  <p>Paitulin käyttö on käyttäjälle ilmainen. Paitulia ylläpitää
    <a href="https://www.csc.fi" target="_blank">CSC - Tieteen tietotekniikan keskus</a> ja rahoittavat
    <a href="https://minedu.fi/etusivu" target="_blank">Opetus- ja kulttuuriministeriö</a> sekä Suomen Akatemia <a href="https://www.geoportti.fi" target="_blank">Geoportti</a> projektin kautta. Paituli tarjotaan "best effort" palvelutasolla ja saavutettavuudella.
  </p>
  <p>Paituli on kehitetty CSC:llä hyödyntäen avoimen lähdekoodin ohjelmistoja, mm:
    <a href="http://geoserver.org/" target="_blank">Geoserver</a>,
    <a href="https://openlayers.org/" target="_blank">OpenLayers</a>,
    <a href="https://vuejs.org/" target="_blank">Vue</a>,
    <a href="https://postgis.net/" target="_blank">PostGIS</a>
    ja
    <a href="https://quarkus.io/" target="_blank">Quarkus</a>.
    Paitulin lähdekoodi on Githubissa:
    <a href="https://github.com/CSCfi/paituli-frontend-vue/" target="_blank">front-end</a> ja
    <a href="https://github.com/CSCfi/avaa-paituli-backend"  target="_blank">back-end</a>.
  </p>

  <p>Käyttötilastot ovat saatavilla <a href="https://www.nic.funet.fi/index/geodata/yearly_reports/" target="_blank">Paitulin vuosiraporteista</a>.
  </p>

</template>
