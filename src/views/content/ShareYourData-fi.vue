<script setup lang="ts">

import AppLink from '@/components/common/AppLink.vue';
import {
  mdiFormatListBulletedType,
  mdiHandHeartOutline,
  mdiPackageVariantClosed,
  mdiMap,
  mdiEmailFastOutline,
  mdiCalendarClock
} from '@mdi/js';

</script>

<template>
  <h1>Jaa paikkatietoaineistosi Paitulissa</h1>
  <p>
    Suomalaisilla korkeakouluilla ja tutkimuslaitoksilla on mahdollisuus jakaa omia paikkatietoaineistojaan Paitulissa ilmaiseksi. Aineistojen julkaisu ei tarkoita aineistoon liittyvien oikeuksien luovuttamista. Aineisto voi olla tuotettu esimerkiksi osana tutkimusprojektia. Aineiston kuvaama alue voi olla Suomesta tai globaali. Jokainen Paitulin aineisto saa myös pysyvän tunnisteen URN-formaatissa.
  </p>
  <p>
    Julkaisun jälkeen kuka tahansa voi ladata aineistosi. Aineistoja, jotka soveltuvat <AppLink to="http://docs.geoserver.org/latest/en/user/">GeoServeriin</AppLink>, voidaan esikatsella lataussivulla ja ne ovat saatavilla myös vakiomuotoisina <AppLink to="/webservices">OGC-verkkopalveluina</AppLink>. Rasteriaineistot lisätään myös <AppLink to="/stac">STAC</AppLink>:iin.
  </p>
  <p>
    CSC laatii vuosittain raportin Paitulin käytöstä, mukaan lukien kunkin aineiston latausmäärät. Raportti toimitetaan kaikille aineistojen tuottajille.
  </p>
  <p>
    CSC julkaisee aineistot maksutta eikä saa niihin mitään oikeuksia.
  </p>

  <h2>Vaiheet aineiston jakamiseen</h2>
  <c-list>
    <c-list-item>
      <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
      <c-icon slot="pre" :path="mdiHandHeartOutline" />
      <c-list-item-title>
        <strong>1. Varmista, että aineisto voidaan julkaista</strong>
      </c-list-item-title>
      <span>
        Sinun tulee joko omistaa aineisto tai sinulla tulee olla aineiston omistajan lupa sen julkaisemiseen. Mikään sopimuksellinen tai immateriaalioikeudellinen rajoite ei saa estää aineiston avaamista. Aineisto tulee lisensoida uudelleenkäytön sallivalla lisenssillä.  Paituli suosittelee <AppLink to="https://creativecommons.org/licenses/by/4.0/"> Creative Commons BY 4.0 -lisenssiä</AppLink>.
      </span>
    </c-list-item>

    <c-list-item>
      <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
      <c-icon slot="pre" :path="mdiFormatListBulletedType" />
      <c-list-item-title>
        <strong>2. Kuvaile aineisto</strong>. Aineistokuvauksen tulee sisältää:
      </c-list-item-title>
      <ul>
        <li>Otsikko suomeksi ja englanniksi</li>
        <li>Lyhyt kuvaus suomeksi ja englanniksi (noin 5–10 riviä)</li>
        <li>Pidempi kuvaus voidaan lisätä PDF-tiedostona (valinnainen)</li>
        <li>Aineiston tuottaja: organisaatio, tarvittaessa tutkija nimellä ja ORCID-tunnuksella</li>
        <li>Aineiston keräyspäivämäärä</li>
        <li>Mittakaava / pikselikoko</li>
        <li>Koordinaattijärjestelmä</li>
        <li>Lisenssi, esimerkiksi CC-BY-4.0</li>
        <li>Projekti, jossa aineisto tuotettiin: nimi ja verkkosivu (valinnainen)</li>
        <li>DOI-, URN- tai muu pysyvä tunniste, jos aineistolla sellainen jo on (valinnainen)</li>
      </ul>
    </c-list-item>

    <c-list-item>
      <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
      <c-icon slot="pre" :path="mdiPackageVariantClosed" />
      <c-list-item-title>
        <strong>3. Pakkaa aineisto</strong>
      </c-list-item-title>
      Nämä ovat suosituksia. Jos jokin muu ratkaisu sopii aineistollesi paremmin, ota yhteyttä CSC:hen.
      <ul>
        <li>
          Muoto: <AppLink to="https://www.cogeo.org/#implementations">Cloud-optimized GeoTIFF</AppLink> rasteriaineistoille, GeoPackage tai Shape vektoriaineistoille, LAZ laserkeilausaineistoille sekä netCDF tai Zarr moniulotteisille aineistoille.
        </li>
        <li>
          Koordinaattijärjestelmä: ETRS-TM35FIN (EPSG:3067) Suomea koskeville aineistoille, WGS-84 (EPSG:4326) globaaleille aineistoille.
        </li>
        <li>
          Jaa aineisto karttalehdille tarvittaessa. Jos karttalehtijako on erillisenä tiedostona, liitä se mukaan aineistopakettiin.
        </li>
      </ul>
    </c-list-item>

    <c-list-item>
      <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
      <c-icon slot="pre" :path="mdiMap" />
      <c-list-item-title>
        <strong>4. Aineiston visualisointi</strong> (valinnainen)
      </c-list-item-title>
      <span>
        Jos haluat käyttää tiettyä <strong>karttatyyliä</strong> aineiston visualisointiin WMS- ja WMTS-palveluissa, laadi tyylikuvaus <AppLink to="https://docs.geoserver.org/latest/en/user/styling/sld/">SLD</AppLink> -muodossa ja lisää se aineistopakettiin.
      </span>
    </c-list-item>

    <c-list-item>
      <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
      <c-icon slot="pre" :path="mdiEmailFastOutline" />
      <c-list-item-title>
        <strong>5. Lähetä aineisto</strong> ja sen kuvaus osoitteeseen giscoord@csc.fi
      </c-list-item-title>
      <span>
        Pienemmät aineistot voi lähettää sähköpostin liitteenä. Suurempiin aineistoihin suositellaan <AppLink to="https://filesender.funet.fi/">FUNET FileSenderiä</AppLink>, joka tukee jopa 300 GB tiedostoja. Jos aineisto on tätä suurempi ja sijaitsee Allas-palvelussa tai CSC:n superkoneilla, tai jos lataamisessa ilmenee ongelmia, ota yhteyttä CSC:hen.
      </span>
    </c-list-item>

    <c-list-item>
      <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
      <c-icon slot="pre" :path="mdiCalendarClock" />
      <c-list-item-title>
        <strong>6. CSC julkaisee aineistosi Paituliin</strong>
      </c-list-item-title>
      Tämä kestää yleensä yhdestä kahteen viikkoa.
    </c-list-item>
  </c-list>

  <p>
    Vaihtoehtona Paitulissa julkaisemiselle on <AppLink to="https://www.fairdata.fi/">Fairdata-palvelu</AppLink>. Jos pohdit, kumpi palvelu sopii paremmin käyttötarkoitukseesi, tutustu <AppLink to="https://www.nic.funet.fi/index/geodata/cscfairdata-IDAvsPaituli-241123.pdf">Paitulin ja Fairdatan vertailutaulukkoon</AppLink>.
  </p>
  <p>Jos sinulla on kysyttävää, ota yhteyttä CSC:hen: giscoord@csc.fi</p>
</template>

<style scoped>

c-icon {
  color: var(--c-info-700);
  position: relative;
  top: 0;
}
</style>
