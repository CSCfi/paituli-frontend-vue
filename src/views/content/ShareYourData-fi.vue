<script setup lang="ts">

import { mdiFormatListBulletedType, mdiHandHeartOutline, mdiPackageVariantClosed, mdiMap, mdiEmailFastOutline, mdiCalendarClock } from '@mdi/js';

</script>

<template>
  <h1>Jaa paikkatietoaineistosi Paitulissa</h1>
  <p>
    Suomen yliopistojen opiskelijoilla ja henkilökunnalla on mahdollisuus jakaa omia
    paikkatietoaineistojaan Paitulin kautta. Aineisto voi olla kerätty tieteellistä tutkimusta
    tai kurssiprojektia varten. Aineisto voi koskea Suomea tai mitä tahansa muuta aluetta maailmassa.
  </p>
  <p>
    Julkaisun jälkeen kuka tahansa voi ladata aineistosi. Aineistot, jotka soveltuvat
    <a href="http://docs.geoserver.org/latest/en/user/" target="_blank">GeoServeriin</a>,
    voidaan esikatsella lataussivulla ja ne ovat saatavilla myös
    vakiomuotoisina
    <RouterLink to="/webservices">OGC-verkkopalveluina</RouterLink>.
  </p>
  <p>
    CSC laatii vuosittain raportin Paitulin käytöstä, mukaan lukien kunkin aineiston latausmäärät.
    Raportti toimitetaan kaikille aineistojen tuottajille. Jokaisella Paitulissa olevalla
    aineistolla on pysyvä tunniste URN-muodossa.
  </p>
  <p>CSC julkaisee aineistot maksutta eikä saa niihin mitään oikeuksia.</p>

  <h2>Vaiheet aineiston jakamiseen</h2>
  <c-list>
    <c-list-item>
      <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
      <c-icon slot="pre" color="var(--c-primary-600)" :path="mdiHandHeartOutline" />
      <c-list-item-title>
        <strong>1. Varmista, että aineisto voidaan julkaista</strong>
      </c-list-item-title>
      <span>
        Sinun tulee joko omistaa aineisto tai sinulla tulee olla aineiston omistajan lupa sen
        julkaisemiseen. Mikään sopimuksellinen tai immateriaalioikeudellinen rajoite ei saa estää
        aineiston avaamista. Aineisto tulee lisensoida uudelleenkäytön sallivalla lisenssillä.
        Paituli suosittelee
        <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank">
          Creative Commons BY 4.0 -lisenssiä
        </a>.
      </span>
    </c-list-item>

    <c-list-item>
      <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
      <c-icon slot="pre" color="var(--c-primary-600)" :path="mdiFormatListBulletedType" />
      <c-list-item-title>
        <strong>2. Kuvaile aineisto</strong>.
        Aineistokuvauksen tulee sisältää:
      </c-list-item-title>
      <span><input type="checkbox"/><label>Otsikko suomeksi ja englanniksi</label></span>
      <span><input type="checkbox"/><label>Lyhyt kuvaus suomeksi ja englanniksi (noin 5–10 riviä)</label></span>
      <span><input type="checkbox"/><label>Pidempi kuvaus voidaan lisätä PDF-tiedostona (valinnainen)</label></span>
      <span><input type="checkbox"/><label>Aineiston tuottaja: organisaatio, tarvittaessa tutkija nimellä ja ORCID-tunnuksella</label></span>
      <span><input type="checkbox"/><label>Aineiston keräyspäivämäärä</label></span>
      <span><input type="checkbox"/><label>Mittakaava / pikselikoko</label></span>
      <span><input type="checkbox"/><label>Koordinaattijärjestelmä</label></span>
      <span><input type="checkbox"/><label>Lisenssi, esimerkiksi CC-BY-4.0</label></span>
      <span><input type="checkbox"/><label>Projekti, jossa aineisto tuotettiin: nimi ja verkkosivu (valinnainen)</label></span>
      <span><input type="checkbox"/><label>DOI-, URN- tai muu pysyvä tunniste, jos aineistolla sellainen jo on (valinnainen)</label></span>
    </c-list-item>

    <c-list-item>
      <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
      <c-icon slot="pre" color="var(--c-primary-600)" :path="mdiPackageVariantClosed" />
      <c-list-item-title>
        <strong>3. Pakkaa aineisto</strong>
      </c-list-item-title>
      Nämä ovat suosituksia. Jos jokin muu ratkaisu sopii aineistollasi paremmin,
      ota yhteyttä CSC:hen.
      <ul>
        <li>
          Muoto: <a href="https://www.cogeo.org/#implementations">Cloud-optimized GeoTIFF</a>
          rasteriaineistoille, GeoPackage tai Shape vektoriaineistoille,
          LAZ laserkeilausaineistoille sekä netCDF tai Zarr moniulotteisille aineistoille.
        </li>
        <li>
          Koordinaattijärjestelmä: ETRS-TM35FIN (EPSG:3067) Suomea koskeville aineistoille,
          WGS-84 (EPSG:4326) globaaleille aineistoille.
        </li>
        <li>
          Jaa aineisto karttalehdille tarvittaessa. Jos karttalehtijako on erillisenä tiedostona,
          liitä se mukaan aineistopakettiin.
        </li>
      </ul>
    </c-list-item>

    <c-list-item>
      <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
      <c-icon slot="pre" color="var(--c-primary-600)" :path="mdiMap" />
      <c-list-item-title>
        <strong>4. Aineiston visualisointi</strong> (valinnainen)
      </c-list-item-title>
      <span>
        Jos haluat käyttää tiettyä <strong>karttatyyliä</strong> aineiston visualisointiin
        WMS- ja WMTS-palveluissa, laadi tyylikuvaus
        <a href="http://docs.geoserver.org/latest/en/user/styling/sld-cookbook/" target="_blank">SLD</a>
        -muodossa ja lisää se aineistopakettiin. Mikäli SLD ei ole tuttu,
        myös ArcGIS- tai QGIS-yhteensopivia tyylejä voidaan toimittaa.
      </span>
    </c-list-item>

    <c-list-item>
      <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
      <c-icon slot="pre" color="var(--c-primary-600)" :path="mdiEmailFastOutline" />
      <c-list-item-title>
        <strong>5. Lähetä aineisto</strong> ja sen kuvaus osoitteeseen
        <a href="mailto:giscoord@csc.fi" rel="nofollow">giscoord@csc.fi</a>
      </c-list-item-title>
      <span>
        Pienemmät aineistot voi lähettää sähköpostin liitteenä.
        Suurempiin aineistoihin suositellaan
        <a href="https://filesender.funet.fi/" target="_blank">FUNET FileSenderiä</a>,
        joka tukee jopa 300 GB tiedostoja. Jos aineisto on tätä suurempi tai sijaitsee
        Allas- tai Puhti-palveluissa, tai jos lataamisessa ilmenee ongelmia,
        ota yhteyttä CSC:hen.
      </span>
    </c-list-item>

    <c-list-item>
      <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
      <c-icon slot="pre" color="var(--c-primary-600)" :path="mdiCalendarClock" />
      <c-list-item-title>
        <strong>6. CSC julkaisee aineistosi Paituliin</strong>
      </c-list-item-title>
      Tämä kestää yleensä yhdestä kahteen viikkoa.
    </c-list-item>
  </c-list>

  <p>
    Vaihtoehtona Paitulissa julkaisemiselle on
    <a href="https://www.fairdata.fi/" target="_blank">Fairdata-palvelu</a>.
    Jos pohdit, kumpi palvelu sopii paremmin käyttötarkoitukseesi,
    tutustu
    <a
      href="https://www.nic.funet.fi/index/geodata/cscfairdata-IDAvsPaituli-241123.pdf"
      target="_blank"
    >Paitulin ja Fairdatan vertailutaulukkoon</a>.
  </p>

  <p>Jos sinulla on kysyttävää, ota yhteyttä CSC:hen: giscoord@csc.fi</p>
</template>

<style>

c-list-item label {
  margin-left: 5px;
}
</style>
