<script setup lang="ts">
import CodeBlock from '@/components/common/CodeBlock.vue';

import { APP_SETTINGS } from '@/shared/constants'

</script>
<template>
  <h1>Paitulin aineistojen massalataus HTTPS-, FTP- ja rsync-yhteyksien yli</h1>
  <p>
    Paitulin <RouterLink to="/download">Lataussivu</RouterLink> mahdollistaa aineistojen latauksen .zip tiedostona. Kerralla voi ladata max. {{  APP_SETTINGS.MAX_ZIP_SIZE / 1000 }} GB, joka voi isompien aineistojen osalta olla rajoittavaa.
    Tämä sivu kuvaa miten isompia aineistoja ladataan tiedostoina. Vaihtoehtoisesti isompien aineistojen käyttämiseen sopivat <RouterLink to="/webservices">OGC API-rajapinnat</RouterLink> tai <RouterLink to="/stac">STAC</RouterLink>.
  </p>

  <p>Vaihtoehdot isompien aineistojen lataamiseksi:</p>
  <ul>
    <li>Lataus tiedostolistauksen mukaisesti. Tiedostolistauksen voi muodostaa <RouterLink to="/download">Lataussivulla</RouterLink>.
    </li>
    <li>Hakemiston lataus, mahdollisesti alihakemistojen kanssa.
    </li>

  </ul>

  <p>Tiedostot ovat saatavilla kolmen rajapinnan yli:</p>
  <ul>
    <li>
      <strong>HTTPS</strong>:
      <a href="https://www.nic.funet.fi/index/geodata/"
         target="_blank"
      >https://www.nic.funet.fi/index/geodata/</a>
    </li>
    <li>
      <strong>FTP</strong>: ftp://ftp.funet.fi/pub/sci/geo/geodata/
    </li>
    <li>
      <strong>rsync</strong>: rsync://rsync.nic.funet.fi/index/geodata/
    </li>
  </ul>

  <p>FTP ja rsync on joissakin organisaatioissa rajoitettu pois palomuurin avulla. HTTPS toimii yleensä. </p>

  <p>Valitse sopiva lataustapa riippuen käyttämästäsi käyttöjärjestelmästä, palomuurin rajoituksista ja lataustoiveista:</p>

  <c-table>
    <table>
      <thead>
        <tr>
          <th>Lataustapa</th>
          <th>Windows</th>
          <th>Linux, Mac, Windows WSL</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Tiedostolistauksen avulla</td>
          <td>Paituli PowerShell skripti (HTTPS)</td>
          <td>rsync, wget (HTTPS)</td>
        </tr>
        <tr>
          <td>Hakemisto</td>
          <td>WinSCP, FileZilla (molemmat FTP)</td>
          <td>FileZilla (FTP), rsync, wget (FTP tai HTTPS)</td>
        </tr>
      </tbody>
    </table>
  </c-table>

  <p>Hakemiston lataaminen Windows käyttäjänä vaatii FTP:n tai rsync:n, niiden lisäksi sopivia työkaluja hakemiston lataamiseksi ei valitettavasti ole olemassa.
    Tällöin suosittelemme, että luot .txt tiedoston, jossa on vain haluamasi hakemiston nimi ja käytät Paituli PowerShell skriptiä hakemiston lataamiseksi. </p>

  <h2>Lataus tiedostolistauksen mukaisesti</h2>

  <p>
    Jos haluat ladata aineistosta vain tiettyjä karttalehtiä, sinun pitää ensin muodostaa tiedostolistaus Paitulin käyttöliittymällä, ja sitten ladata tiedostot komentorivityökaluilla.

  </p>

  <h3>Tiedostolistauksen muodostaminen</h3>

  <ol>
    <li>Avaa <RouterLink to="/download">Latauspalvelu</RouterLink>,</li>
    <li>Valitse haluamasi aineisto</li>
    <li>Valitse karttalehdet kartalta tai haulla</li>
    <li>Klikkaa "Lataa tiedostolista" painiketta.</li>
    <li>Saat tiedostolistauksen sähköpostiisi, lataa listaus omalle koneelle.</li>
  </ol>

  <p>
    Vaihtoehtoisesti tiedostolistauksen voi muodostaa hyödyntämällä
    indeksikartan path-sarakkeen tietoja. Indeksikartta on saatavilla Linkit
    välilehdeltä
    <a href="download.html">Latauspalvelu</a> sivulla.
  </p>


  <h3>Lataus tiedostolistauksen mukaisesti</h3>

  <p> Graafiset työkalut eivät valitettavasti tue tiedostolistauksen käyttöä, joten tämä on mahdollista vain komentorivityökaluilla.
    Windows-käyttäjille tarjoamme lataukseen PowerShell skriptin.
    Linux- ja Mac-käyttäjät voivat käyttää lataukseen <a href="http://www.linuxguide.it/command_line/linux-manpage/do.php?file=wget" target="_blank">wget</a> tai <a href="http://www.linuxguide.it/command_line/linux-manpage/do.php?file=rsync" target="_blank">rsync </a> ohjelmia, jotka ovat yleensä oletuksena saatavilla.
  </p>

  <h4>Paituli PowerShell skripti Windowsille</h4>

  <p>Windows-käyttäjille tarjoamme PowerShell skriptin lataukseen HTTPS:n kautta. Tämä toimii AINOASTAAN Windowsilla.
    Skripti luo uusia kansioita säilyttäen alkuperäisen kansiorakenteen sekä ohittaa jo ladatut tiedostot.
  </p>

  <p>Askeleet skriptin käyttämiseksi:</p>
  <ol>
    <li>Lataa tiedostojen lista.</li>
    <li>Lataa <a href="https://www.nic.funet.fi/index/geodata/download_paituli_data.ps1">Paituli latausskripti</a>.</li>
    <li>Avaa skripti tekstieditorilla (esim. Muistio) ja muokkaa skriptin alussa olevat polut, jotka on merkitty CHANGE kommentilla. Tallenna.</li>
    <li>Avaa PowerShell.</li>
    <li>Menee hakemistoon, johon tallensit skriptin, käytä cd-komentoa.</li>
    <li>Aja skripti: <div class="codeBlock">.\download_paituli_data.ps1</div></li>
  </ol>


  <h4>wget</h4>

  <p>
    Käytä -i optiota tiedostolistauksen määrittelemiseksi.
  </p>

  <CodeBlock
    :content="`wget -i <span style='color:yellow;'>file_list.txt</span>\
      -P <span style='color:cyan;'>local_folder_to_save/</span>`"
  />

  <h4>rsync</h4>
  <p>Ennen latausta, poista tiedostolistauksesta jokaisen rivin alusta 'http://www.nic.funet.fi/index/'.</p>

  <CodeBlock
    :content="`rsync -a --files-from=<span style='color:yellow;'>file_list.txt</span>\
    rsync://rsync.nic.funet.fi/ftp/pub/sci/geo <span style='color:cyan;'>local_folder_to_save/</span>`"
  />




  <h2>Hakemiston lataus</h2>

  <p>
    Tämä on suhteellisen helppo tapa tiedostojen lataamiseksi, jos tarvittavat tiedostot ovat palvelimella samassa hakemistossa. Jokainen Paitulin aineisto on omassa hakemistossaan, joten tämä sopii erittäin hyvin kokonaisen aineiston lataamiseksi.
  </p>

  <h3>Hakemiston löytäminen</h3>

  <p>Aineiston polku löytyy <RouterLink to="/download">Latauspalvelusta:</RouterLink>:</p>
  <ol>
    <li>Valitse haluamasi aineisto</li>
    <li>Napsauta "Rajapinnat" painiketta. Hakemistot kaikille kolmelle protokollalle näkyvät.</li>
  </ol>

  <p>
    Jokaisen aineiston hakemistossa on Readme-tiedosto,
    jossa aineiston perustietojen lisäksi on linkki Etsimeen, josta löytyvät
    laajemmat aineistokuvaukset.
  </p>

  <h3>Hakemistossa olevien kaikkien tiedostojen ja alihakemistojen lataus</h3>

  <p>
    Hakemiston lataukseen voi käyttää erilaisia ohjelmistoja, linkit työkalujen dokumentaatioon on listattu tämän sivun lopussa.
    Alla olevat esimerkit lataavat koko hakemiston sekä sen alihakemistot, ja tallentavat tiedostot vastaavaan hakemistorakenteeseen paikallisella koneella.
  </p>

  <ol>
    <li>Helppokäyttöisemmät ovat <strong>FTP ohjelmat</strong>, esim. FileZilla tai WinSCP. </li>
    <li><strong>rsync</strong> tai <strong>wget</strong> komentorivityökalut. Joskus organisaation palomuuri voi estää FTP ja rsync:n käytön. Silloin on parasta käyttää wget työkalua HTTPS:n kanssa.</li>
  </ol>

  <h4>FTP ohjelmat</h4>
  <ol>
    <li>Yhdistä palvelimeen. host name: ftp.funet.fi, protocol: FTP, port number: 21.</li>
    <li>Jos käyttäjätunnusta tai salasanaa kysytään, jätä kenttä tyhjäksi.</li>
    <li>Valitse oikealla hakemisto, mihin tarvitsemasi aineisto on tallennettu.</li>
    <li>Valitse vasemmalla hakemisto, mihin haluat ladata tiedostot.</li>
    <li>Vedä tiedostoja tai hakemistoja oikealta vasemmalle, jotta niiden lataus käynnistyisi. </li>
  </ol>

  <h4>rsync</h4>

  <CodeBlock
    :content="`rsync -a <span style='color:yellow;'>rsync://rsync.nic.funet.fi/ftp/index/geodata/mml/hallintorajat_milj_tk/2017/</span> <span style='color:cyan;'>local_folder_to_save/</span>`"
  />

  <ul>
    <li>
      Vaihda komennossa siniset osat vastaamaan valitsemaasi aineistoa ja
      tallennushakemistoasi.
    </li>
    <li>
      -a käytä arkisto tilaa, mm. säilyttää alkuperäiset aikaleimat ja lataa
      kaikki alihakemistot
    </li>
  </ul>

  <h4>wget</h4>

  <p>
    Joissakin organisaatioissa FTP ja rsync on estetty palomuurilla. Käytä silloin HTTPS-latausta wget:in kanssa. wget:llä on paljon asetuksia, joista yksi toimiva tapa on seuraava:
  </p>

  <CodeBlock
    :content="`wget -r -l inf -N -np -nH -x -c --cut-dirs=4 \\
      <span style='color:yellow;'>ftp://ftp.funet.fi/index/geodata/mml/hallintorajat_milj_tk/2017/</span> \\
      -P <span style='color:cyan;'>local_folder_to_save/</span>`"
  />
  <CodeBlock
    :content="`wget -r -l inf -N -np -nH -x -c --cut-dirs=4 \\
      <span style='color:yellow;'>https://www.nic.funet.fi/index/geodata/mml/hallintorajat_milj_tk/2017/</span> \\
      -P <span style='color:cyan;'>local_folder_to_save/</span>`"
  />

  <ul>
    <li>-r, lataa rekursiivisesti alihakemistot</li>
    <li>-l inf, miten syvälle rekursiivinen lataus lähtee, oletuksena 5, tässä
      laitettu loputtomaksi</li>
    <li>-N, vain päivitys, jo olemassa olevia tiedostoja ei ladata uudestaan. Tämä on
      tärkeää, jos lataus keskeytyy tai jos päivitetään jo aikaisemmin ladattua
      aineistoa</li>
    <li>-np, estää ylähakemistojen latautumisen</li>
    <li>-nH, poistaa palvelimen nimen</li>
    <li>-x, kopioi hakemistorakenteen</li>
    <li>-cuts-dirs, leikkaa hakemistoja polun alusta, että hakemistopuu ei olisi liian
      pitkä. Säädä tätä arvoa tarpeen mukaan.</li>
    <li>-c, jatkaa katkennutta latausta</li>
    <li>
      Jos mahdollista, käytä ftp palvelua, käyttämällä HTTPS protokollaa, saat
      ylimääräisiä index.* tiedostoja.
    </li>
  </ul>

  <p>Jos huomaat ongelmia tai tiedät paremman tavan Windowsilla tiedostojen lataamiseksi, ota yhteyttä CSC:hen.</p>

</template>
