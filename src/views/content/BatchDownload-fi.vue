<script setup lang="ts">
import CodeBlock from '@/components/CodeBlock.vue';

import { APP_SETTINGS } from '@/shared/constants'

</script>
<template>
  <h1>Massalataus HTTPS-, FTP- ja rsync-yhteyksien yli</h1>
  <p>
    <RouterLink to="/download">Latauspalvelu</RouterLink>
    -sivu tukee pakattuja (zip) latauksia kokoon
    {{ APP_SETTINGS.MAX_ZIP_SIZE }} MB asti, joka voi olla rajoittavaa,
    jos tarvittava aineisto on suurempi.
    Paitulin aineistot ovat saatavilla myös
    HTTP-, FTP- ja rsync-protokollien kautta, joiden avulla voi ladata
    asteittain suuria määriä aineistosisältöä ilman rajaa.
  </p>
  <p>Tällä sivulla käydään läpi, kuinka voit:</p>
  <ul>
    <li>Ladata koko aineiston.</li>
    <li>
      Ladata osan aineistosta tiedostolistan avulla.
    </li>
    <li>Mountata aineisto(t) verkkolevyksi</li>
  </ul>

  <p>
    Näiden toteuttamiseksi tarvitset aineiston
    <strong>polun</strong>
    (verkko-osoitteen), jossa se sijaitsee.<br>
    <RouterLink to="/download" target="_blank">Latauspalvelu</RouterLink>
    -sivu tarjoaa nämä tiedot:
  </p>
  <ol>
    <li>Valitse sinua kiinnostava aineisto</li>
    <li>Avaa "Palvelut"-välilehti.</li>
    <li>Klikkaa "Tiedostonsiirto".</li>
    <li>Kopioi haluamasi polku sen mukaan, mikä protokolla sopii käyttöösi.</li>
  </ol>

  <h2>Koko aineiston lataaminen</h2>
  <p>
    Kokonaisen aineistokansion lataamiseen voidaan käyttää useita eri työkaluja.
    Jos kohtaat ongelmia, tutustu työkalujen omaan dokumentaatioon.
    Huomaa myös, että FTP- ja rsync-yhteydet voivat olla estettyjä
    joissakin organisaatioissa. Tällöin käytä HTTP:tä esimerkiksi wget-työkalulla.
  </p>

  <h3>Graafiset FTP-työkalut</h3>
  Helpoin ja käyttäjäystävällisin tapa on käyttää
  <strong>graafista FTP-työkalua</strong>, kuten
  <a href="https://filezilla-project.org/" target="_blank">FileZilla</a>
  tai
  <a href="https://winscp.net/eng/download.php" target="_blank">WinSCP</a>
  (vain Windows). Seuraavat lyhyet ohjeet koskevat FileZillaa:
  <ol>
    <li>Yhdistä FTP-palvelimeen seuraavilla tiedoilla:
      <ul>
        <li>host name: ftp.funet.fi</li>
        <li>protocol: FTP</li>
        <li>port number: 21</li>
        <li>Jätä username ja password tyhjiksi, jos niitä kysytään</li>
      </ul>
    </li>
    <li>Siirry oikealla puolella kansioon, jossa aineisto sijaitsee.</li>
    <li>Valitse vasemmalla puolella kohdekansio omalta koneeltasi.</li>
    <li>Vedä aineisto oikealta puolelta vasemmalle aloittaaksesi siirron.</li>
  </ol>

  <h3>rsync</h3>
  <p>
    Jos järjestelmäsi tukee rsync-komentorivityökalua,
    vaihda komennossa korostetut osat tarpeidesi mukaan.
    Sinun tulee määrittää ladattavan aineiston polku
    sekä paikallinen kohdekansio. -a -valitsin yhdistää useita asetuksia,
    kuten rekursiivisen latauksen ja tiedostometatietojen säilyttämisen.
  </p>
  <CodeBlock
    :content="`rsync -a <span style='color:yellow;'>rsync://rsync.nic.funet.fi/ftp/pub/sci/geo/geodata/mml/hallintorajat_milj_tk/2017/</span> <span style='color:cyan;'>local_folder_to_save/</span>`"
  />

  <h3>wget</h3>
  <p>
    Vaikka wget tukee myös HTTP:tä, käytämme tässä FTP:tä,
    jotta vältetään ylimääräisten index.*-tiedostojen lataaminen.
    Työkalulla on runsaasti valitsimia; seuraava yhdistelmä toimii hyvin:
  </p>
  <CodeBlock
    :content="`wget -r -l inf -N -np -nH -x -c --cut-dirs=6 \\
      <span style='color:yellow;'>ftp://ftp.funet.fi/pub/sci/geo/geodata/mml/hallintorajat_milj_tk/2017/</span> \\
      -P <span style='color:cyan;'>local_folder_to_save/</span>`"
  />
  <ul>
    <li>-r, rekursiivinen lataus</li>
    <li>-l inf, rekursion syvyys (oletus 5, tässä ääretön)</li>
    <li>-N, päivitä vain uudet tiedostot</li>
    <li>-np, älä lataa ylähakemistoja</li>
    <li>-nH, poista isäntänimi</li>
    <li>-x, luo hakemistot kuten Paitulissa</li>
    <li>-cut-dirs, poistaa tietyn määrän hakemistoja polun alusta</li>
    <li>-c, jatka keskeytynyttä latausta</li>
  </ul>

  <h2>Tiedostolistan lataaminen</h2>
  <p>
    Jos haluat ladata vain tietyt karttalehdet tai yksittäisiä tiedostoja,
    luo ensin tiedostolista Paitulissa ja lataa sen jälkeen tiedostot
    komentorivityökalulla.
  </p>

  <h3>Tiedostolistan luominen</h3>
  <ol>
    <li>
      Avaa
      <RouterLink to="/download" target="_blank">Latauspalvelu</RouterLink>
      -sivu.
    </li>
    <li>Valitse haluamasi aineisto.</li>
    <li>Valitse karttalehdet valintatyökaluilla tai haun avulla.</li>
    <li>Poista tarvittaessa valintoja latauslistasta ja paina "Lataa".</li>
    <li>Ota latausikkunassa käyttöön "Lataa tiedostolistana" ennen latauksen aloittamista </li>
  </ol>

  <h3>Listattujen tiedostojen lataaminen</h3>
  <p>
    Graafiset työkalut eivät tue lataamista tiedostolistan avulla,
    mutta se onnistuu komentorivityökaluilla:
  </p>

  <h4>wget</h4>
  <p>Edelliseen esimerkkiin verrattuna lisätään -i -valitsin tiedostolistan nimeä varten.</p>
  <CodeBlock
    :content="`wget -i <span style='color:yellow;'>file_list.txt</span>\
      -P <span style='color:cyan;'>local_folder_to_save/</span>`"
  />

  <h4>rsync</h4>
  <p>
    Huom! rsyncin tapauksessa sinun tulee poistaa
    'http://www.nic.funet.fi/index/' jokaiselta riviltä tiedostolistassa.
  </p>
  <CodeBlock
    :content="`rsync -a --files-from=<span style='color:yellow;'>file_list.txt</span>\
    rsync://rsync.nic.funet.fi/ftp/pub/sci/geo <span style='color:cyan;'>local_folder_to_save/</span>`"
  />

  <h4>Start-BitsTransfer Windows PowerShellissa</h4>
  <p>Start-BitsTransfer vaatii hieman enemmän valmistelua:</p>
  <ol>
    <li>Muokkaa tiedostolistaa ja lisää ensimmäiseksi riviksi "Source"</li>
    <li>Varmista, että kohdehakemisto (esimerkissä local_folder_to_save) on olemassa.</li>
  </ol>
  <CodeBlock
    :content="`Import-CSV <span style='color: yellow;'>file_list.txt</span> | Start-BitsTransfer -Destination <span style='color: cyan;'>local_folder_to_save/</span>`"
  />

  <p>
    Tämä komento tallentaa kaikki tiedostot samaan kansioon.
    Jos haluat säilyttää saman hakemistorakenteen kuin Paitulissa,
    luo .csv-tiedosto, jossa on tulostepolut (katso
    <a href="https://www.jesusninoc.com/10/08/start-bitstransfer-examples/"
       target="_blank"
    >Start-BitsTransfer, Esimerkki 2</a>).
    Voit käyttää esimerkiksi Exceliä. Kaikkien alikansioiden on oltava
    olemassa ennen komennon suorittamista.
  </p>

  <h2>FTP:n liittäminen paikalliseksi levyksi</h2>
  <p>
    FTP-sivusto on mahdollista liittää paikalliseksi levyksi.
    Tämä mahdollistaa tiedostojen avaamisen suoraan GIS-ohjelmistoista
    ilman erillistä latausta. Tiedostot kuitenkin ladataan käytön yhteydessä,
    joten FTP:n kautta avaaminen on hitaampaa kuin paikallisista tiedostoista.
  </p>

  <ul>
    <li>
      Linux-käyttäjät voivat käyttää esimerkiksi
      <a href="http://curlftpfs.sourceforge.net/" target="_blank">curlFtpFS</a>.
    </li>
    <li>
      Windowsille ei vaikuta olevan ilmaista ratkaisua,
      joka toimisi kohtuullisella suorituskyvyllä.
    </li>
  </ul>

  <h2>Yhteenveto työkaluista ja resursseista</h2>

  <ul>
    <li>
      Graafiset FTP-työkalut:
      <ul>
        <li><a href="https://filezilla-project.org/" target="_blank">FileZilla</a></li>
        <li>
          <a href="https://winscp.net/eng/download.php" target="_blank">WinSCP</a>, vain Windows.
        </li>
      </ul>
    </li>
    <li>
      Komentorivityökalut:
      <ul>
        <li>
          <a
            href="http://www.linuxguide.it/command_line/linux-manpage/do.php?file=wget"
            target="_blank"
          >wget</a>
          tukee sekä HTTPS- että FTP-protokollia ja on
          <a href="https://eternallybored.org/misc/wget/" target="_blank">
            saatavilla myös Windowsille
          </a>.
        </li>
        <li>
          <a
            href="http://www.linuxguide.it/command_line/linux-manpage/do.php?file=rsync"
            target="_blank"
          >rsync</a>
          tukee rsync-protokollaa ja on
          <a href="https://bobcares.com/blog/rsync-from-windows-to-linux-over-ssh" target="_blank">
            saatavilla myös Windowsille
          </a>.
        </li>
        <li>
          rsync ja wget sisältyvät oletuksena useimpiin Linux- ja Mac-jakeluihin.
          Windowsissa voit käyttää edellä linkitettyjä versioita tai
          Windows Subsystem for Linuxiä (WSL).
        </li>
        <li>
          <a
            href="https://docs.microsoft.com/en-us/powershell/module/bitstransfer/start-bitstransfer"
            target="_blank">
            Start-BitsTransfer
          </a>
          on oletuksena saatavilla Windows PowerShellissa.
          Sitä ei ole saatavilla Linuxille tai Macille.
        </li>
      </ul>
    </li>
  </ul>
</template>
