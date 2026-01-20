<template>
  <h1>Paitulista</h1>
  <p>
    Paituli on paikkatietoaineistojen latauspalvelu.
    Paituli on ensisijaisesti suunnattu korkeakouluopiskelijoille,
    -tutkijoille sekä henkilökunnan jäsenille, mutta on avoin kaikille.
    Palvelun kautta on saatavilla suomalaisia paikkatietoaineistoja,
    jotka ovat tärkeitä tutkimuksessa ja opetuksessa.
    Muista paikkatietoaineistopalveluista poiketen Paitulista
    löydät myös historiallisia vuosiversioita.
    Useiden aineistojen ensimmäiset versiot ovat vuodelta 2005,
    jolloin Paituli aloitti toimintansa.
    Tällä hetkellä palvelusta on ladattavissa seuraavien
    organisaatioiden tuottamia paikkatietoaineistoja:
  </p>
  <ul>
    <li>
      <a href="https://dvv.fi" target="_blank">Digi- ja väestötietovirasto</a>
    </li>
    <li>
      <a href="https://blogs.helsinki.fi/saavutettavuus/" target="_blank">Helsingin yliopisto, Digital Geography Lab</a>
    </li>
    <li>
      <a href="https://www.luomus.fi/fi" target="_blank">Helsingin yliopisto, Luomus</a>
    </li>
    <li>
      <a href="http://www.ilmatieteenlaitos.fi" target="_blank">Ilmatieteen laitos (FMI)</a>
    </li>
    <li>
      <a href="http://www.kotus.fi" target="_blank">Kotimaisten kielten keskus (KOTUS)</a>
    </li>
    <li>
      <a href="http://www.latuviitta.org/" target="_blank">Latuviitta</a>
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
      <a href="http://www.tilastokeskus.fi" target="_blank">Tilastokeskus</a>
    </li>
    <li>
      <a href="http://www.digiroad.fi" target="_blank">Väylävirasto, Digiroad</a>
    </li>
  </ul>
  <p>
    Saatavilla olevat aineistot löydät
    <RouterLink to="/download">Latauspalvelu</RouterLink>-sivulta.
    Aineistoilla on erilaisia lisenssejä, yleisin lisenssi on CC-BY-4.0.
    Muista tutustua paikkatietoaineistoihin liittyviin käyttöehtoihin
    ennen aineistojen käyttöönottoa.
  </p>
  <p>Paituli tarjoa aineistojen lataamiseksi neljä vaihtoehtoa:</p>
  <ul>
    <li>
      Aineistojen lataus zip-pakettina
      <RouterLink to="/download">Latauspalvelusta</RouterLink>.
      Pakatun zip-tiedoston koko on rajoitettu 3 Gb.
      Lataussivu tarjoa myös esikatselumahdollisuuden
      suurelle osalle aineistoista.
    </li>
    <li>
      Isommat ainestokokonaisuudet voi ladata HTTP,
      <RouterLink to="/files">FTP ja rsync</RouterLink>
      -työkalujen avulla.
    </li>
    <li>
      Useat aineistot ovat saatavilla myös OGC
      <RouterLink to="/webservices">Rajapintojen:</RouterLink>
      ylitse: WMS (Maps), WCS, WMTS (Tiles) and WFS (Features).
    </li>
    <li>
      <a href="https://research.csc.fi/gis_data_in_csc_computing_env" target="_blank">
        CSC Puhti supertietokoneen avoimet GIS aineistot
      </a>
      sisältävät melkein kaikki Paitulin aineistot,
      jotta näiden käyttö olisi helppoa ja nopea Puhdin käyttäjille.
    </li>
  </ul>
  <p>
    Paitulin aineistojen metatiedot on tallennettu
    <a
      href="https://etsin.fairdata.fi/datasets/paituli?keys=&amp;terms=&amp;p=1&amp;sort=best"
      target="_blank">
      Etsin
    </a>
    -hakupalveluun. Metatiedot sisältävät aineiston kuvauksen suomeksi
    ja englanniksi, yhteystiedot, käyttöehdot ja linkkejä lisätietoihin:
    dokumentteihin ja nettisivuille. Suorat linkit aineistokohtaisille
    Etsin-sivuille löytyvät Metatiedot-sivulta ja lataussivun
    Metatiedot-välilehdeltä.
  </p>
  <p>
    Korkeakoulujen henkilökunnalla ja opiskelijoilla on mahdollisuus myös
    <RouterLink to="/opendata">jakaa aineistoja</RouterLink>
    Paitulissa.
  </p>
  <p>
    Paitulin käyttö on käyttäjälle ilmaista. Paitulia ylläpitää
    <a href="https://www.csc.fi" target="_blank">CSC - Tieteen tietotekniikan keskus</a>
    ja rahoittaa
    <a href="https://minedu.fi/etusivu" target="_blank">Opetus- ja kulttuuriministeriö</a>
    sekä Suomen Akatemia
    <a href="https://www.geoportti.fi" target="_blank">Geoportti</a>
    projektin kautta.
    Paituli tarjotaan "best effort" palvelutasolla ja saavutettavuudella.
  </p>
  <p>
    Paituli on kehitetty CSC:llä hyödyntäen avoimen lähdekoodin ohjelmistoja, kuten:
    <a href="http://geoserver.org/" target="_blank">Geoserver</a>,
    <a href="https://openlayers.org/" target="_blank">OpenLayers</a>,
    <a href="https://postgis.net/" target="_blank">PostGIS</a>,
    <a href="https://quarkus.io/" target="_blank">Quarkus</a>
    ja
    <a href="https://vuejs.org/" target="_blank">Vue.js</a>.
    Paitulin lähdekoodi on Githubissa:
    <a href="https://github.com/CSCfi/paituli-frontend-vue/" target="_blank">front-end</a>
    ja
    <a href="https://github.com/CSCfi/avaa-paituli-backend" target="_blank">back-end</a>.
  </p>
  <p>
    Paitulin pysyvä linkitettävä osoite:
    <a href="https://www.csc.fi/paituli">www.csc.fi/paituli</a>
  </p>
  <p>
    <a href="http://www.nic.funet.fi/index/geodata/Paituli_2020.pptx" target="_blank">
      Paitulin PowerPoint esityskalvot
    </a>
    (2020).
  </p>


  <h1>Uutiset</h1>
  <c-list>
    <c-list-item>
      <c-list-item-title>19.12.2024</c-list-item-title>
      Lisätty Tilastokeskuksen kuntien avainluvut 2022.
    </c-list-item>
    <c-list-item>
      <c-list-item-title>13.9.2024</c-list-item-title>
      Ilmatieteenlaitoksen 10 km sääaineistoja päivitetty,
      nyt saatavilla data vuosille 1961-2023: päivittäinen alin, ylin
      ja keskilämpötila, sademäärä, lumen syvyys, ilmanpaine, säteily,
      suhteellinen kosteus sekä kuukausittainen keskilämpötila ja sademäärä.
    </c-list-item>
    <c-list-item>
      <c-list-item-title>9.8.2024</c-list-item-title>
      Lisätty Maanmittauslaitoksen maastotietokanta 2023 GeoPackage
      ja Shape formaateissa.
    </c-list-item>
    <c-list-item>
      <c-list-item-title>8.8.2024</c-list-item-title>
      Lisätty Tilastokeskuksen väesto kunnittain 2023 ja väestöruutuaineisto 2023.
    </c-list-item>
    <c-list-item>
      <c-list-item-title>24.5.2024</c-list-item-title>
      Lisätty Luonnonvarakeskusen valtakunnan metsien monilähteisessä inventoinnissa
      (MVMI) tuotetut karttamuotoiset metsävaratiedot: 2006 - 2021.
    </c-list-item>
    <c-list-item>
      <c-list-item-title>15.4.2024</c-list-item-title>
      Lisätty yli 30 000 historiallisia georeferoitua karttaa Maanmittauslaitoksen
      arkistosta vuosilta 1863-2020. Pitäjäkartat, taloudelliset kartat,
      topografiset kartat, maastokartat ja peruskartat mittakaavoissa
      1:20 000 - 1:500 000.
      <a
        href="https://www.maanmittauslaitos.fi/ajankohtaista/yli-30-000-vanhaa-karttaa-jopa-150-vuoden-takaa-nyt-paikkatietona"
        target="_blank">
        Lisätietoja MML:n sivuilta
      </a>
    </c-list-item>
    <c-list-item>
      <c-list-item-title>9.2.2024</c-list-item-title>
      Lisätty Tilastokeskuksen tieliikenneonnettomuudet 2022 ja Paavo 2024.
    </c-list-item>
    <c-list-item>
      <c-list-item-title>8.2.2024</c-list-item-title>
      Lisätty Maanmittauslaitoksen hallintorajat 2024.
    </c-list-item>
    <c-list-item>
      <c-list-item-title>15.12.2023</c-list-item-title>
      Lisätty Luonnonvarakeskuksen (LUKE) maannostietokanta.
    </c-list-item>
    <c-list-item>
      <c-list-item-title>14.12.2023</c-list-item-title>
      Kasvukauden 2022 and 2023 Sentinel 2A kuvia lisätty Paituli STAC:iin.
    </c-list-item>
    <c-list-item>
      <c-list-item-title>21.11.2023</c-list-item-title>
      Lisätty Maanmittauslaitoksen maastotietokannan 2005-2018 versiot
      GeoPackage formaatissa, näin että koko Suomi on yhdessä tiedostossa.
    </c-list-item>
    <c-list-item>
      <c-list-item-title>18.9.2023</c-list-item-title>
      Lisätty Ilmatieteenlaitoksen kuukauden keskilämpötilan ja sademäärän
      ennuste ja kuukauden keskilämpötilan ja sademäärän muutoksen ennuste 1975-2085.
    </c-list-item>
    <c-list-item>
      <c-list-item-title>25.8.2023</c-list-item-title>
      Paituli GeoServer versiopäivitys, myös STAC ja OGC API rajapintojen
      osoite muuttui. Uutena lisääntyi OGC API Coverages rajapinta.
    </c-list-item>
    <c-list-item>
      <c-list-item-title>22.8.2023</c-list-item-title>
      Paituli STAC aineitoihin lisätty Paitulin omat rasteriaineistot ja
      GeoPortti GeoCubes aineistot. Yhteensä nyt saatavilla 98 aineistoa.
    </c-list-item>
    <c-list-item>
      <c-list-item-title>16.8.2023</c-list-item-title>
      Lisätty Helsingin yliopiston Luonnontieteellisen keskusmuseon Luomus
      uusi SPECTRE aineisto. Se sisältää 24 aineistoa, jotka kuvaavat biologiseen
      monimuotoisuuteen kohdistuvia uhkia 1 km:n resoluutiolla kaikilta
      maa-alueilta globaalisti. Aineisto sisältää seuraavia aiheita:
      elinympäristön häviäminen, liiallinen hyödyntäminen, saastuminen ja ilmastonmuutos.
    </c-list-item>
    <c-list-item>
      <c-list-item-title>20.6.2023</c-list-item-title>
      Lisätty Luonnonvarakeskuksen (LUKE) puuston hiilivarasto ja puuston
      hiilivarston muutos aineistot.
    </c-list-item>
    <c-list-item>
      <c-list-item-title>19.4.2023</c-list-item-title>
      Lisätty Tilastokeskuksen oppilaitokset 2020 ja kuntien avainluvut 2021.
    </c-list-item>
    <c-list-item>
      <c-list-item-title>17.4.2023</c-list-item-title>
      Lisätty Maanmittauslaitoksen painoväri peruskartta 2023.
    </c-list-item>
    <c-list-item>
      <c-list-item-title>14.4.2023</c-list-item-title>
      <span>
        Lisätty uusi <RouterLink to="/stac">STAC API</RouterLink>
        ajallisen ulottuvuuden omaavan paikkatiedon etsimiseksi ja lataamiseksi.
      </span>
    </c-list-item>
    <c-list-item>
      <c-list-item-title>10.11.2021</c-list-item-title>
      Paitulin rajapintojen valikoimaan lisättiin uudet OGC API rajapinnat:
      Maps, Tiles and Features.
    </c-list-item>
    <c-list-item>
      <c-list-item-title>15.12.2020</c-list-item-title>
      <span>
        Paituli-palvelu uudistui ja siirtyi uudelle palvelimelle.
        Käyttäjän näkökulmasta Paituli jatkaa pitkälti nykyisessä muodossa.
        Muutamia muutoksia:

        Uudessa Paitulissa kaikki aineistot ovat kaikille avoimia.
        Viimeisest ainistot, jotka olivat saatavilla vain korkeakoulujen käyttäjille -
        (<a href="https://etsin.fairdata.fi/datasets/SLICES" target="_blank">
          SLICES</a>
        ja
        <a href="https://etsin.fairdata.fi/datasets/puustotulkinta" target="_blank">
          Maasto- ja puustotulkinta 1997</a>)
        ovat ladattavissa Etsimen kautta.
        MML:n ortokuvat eivät ole enää saatavilla WMS and WMTS rajapintojen
        kautta teknisistä syistä.
        <a href="https://www.maanmittauslaitos.fi/karttakuvapalvelu" target="_blank">
          MML</a>
        ja
        <a href="https://kartat.kapsi.fi/" target="_blank">
          Kapsi</a>
        tarjoavat ortokuva-rajapintoja.
      </span>
    </c-list-item>
    <c-list-item>
      <c-list-item-title>14.8.2020</c-list-item-title>
      <span>
        MML:n stereomallin avulla luokiteltu laserkeilausainainestolle
        on lisätty lastoolsilla generoitut
        <a
          href="https://rapidlasso.com/2012/12/03/lasindex-spatial-indexing-of-lidar-data/"
          target="_blank">
          indeksitiedostot
        </a>. Lisäksi on suurella osalla tiedostoja päivitetty headerin
        pistelukuja ja tiedoston kattama alue (bbox), joissa MML:n
        alkuperäisissä tiedostoissa on virheitä.
      </span>
    </c-list-item>
    <c-list-item>
      <c-list-item-title>21.3.2019</c-list-item-title>
      MML:n laserkeilausaineistoa, 2m DEM ja ortokuva-aineistoja
      päivitetään Paitulissa joka viikko sunnuntaisin.
    </c-list-item>
    <c-list-item>
      <c-list-item-title>2019</c-list-item-title>
      <span>
        Paitulissa oli aikaisemmin saatavilla
        <a
          href="https://www.syke.fi/fi-FI/Avoin_tieto/Paikkatietoaineistot/Ladattavat_paikkatietoaineistot">
          SYKE:n
        </a>,
        <a
          href="https://hakku.gtk.fi/fi/locations/search">
          GTK:n
        </a>ja
        <a
          href="https://www.museovirasto.fi/fi/palvelut-ja-ohjeet/tietojarjestelmat/kulttuuriympariston-tietojarjestelmat/kulttuuriympaeristoen-paikkatietoaineistot">
          Museoviraston
        </a>
        aineistoja.
        Nämä aineistot ovat nykyisin avoimesti saatavilla aineiston
        tuottajan omassa palvelussa.
      </span>
    </c-list-item>
  </c-list>

</template>