<script setup lang="ts">
import CodeBlock from '@/components/CodeBlock.vue';

import { APP_SETTINGS } from '@/shared/constants'

</script>

<template>
  <h1>Bulk download of files from Paituli over HTTPS, FTP and rsync</h1>

  <p>
    Paituli <RouterLink to="/download">Download page</RouterLink> enables downloading data as .zip file max. 3 Gb at a time. This can be limiting, if the needed dataset is bigger. This page describes how to download bigger datasets as files. Alternative options are to use <RouterLink to="/webservices">OGC APIs</RouterLink> or <RouterLink to="/stac">STAC</RouterLink>, to get access to the data.
  </p>

  <p>For bigger downloads, there are two main options:</p>
  <ul>
    <li>Download a list of selected files. The file list can be created on <RouterLink to="/download">Download</RouterLink> page.
    </li>
    <li>Download a folder, possibly including subfolders.
    </li>

  </ul>

  <p>The files are available via three different protocols:</p>

  <ul>
    <li>
      <strong>HTTPS</strong>:
      <a href="https://www.nic.funet.fi/index/geodata/"
         target="_blank"
      >https://www.nic.funet.fi/index/geodata/</a>
    </li>
    <li>
      <strong>FTP</strong>: ftp://ftp.funet.fi/index/geodata/
    </li>
    <li>
      <strong>rsync</strong>: rsync://rsync.nic.funet.fi/index/geodata/
    </li>
  </ul>

  <p>FTP and rsync are in some organizations limited by firewalls. HTTPS should always work. </p>

  <p>Choose the right option for you, depending on your operating system, firewall limitations and download interests:</p>

  <table>
    <tr>
      <th>Download type</th>
      <th>Windows</th>
      <th>Linux, Mac, Windows WSL</th>
    </tr>
    <tr>
      <td>List of files</td>
      <td>Paituli PowerShell script (HTTPS)</td>
      <td>rsync, wget (HTTPS)</td>
    </tr>
    <tr>
      <td>Folder</td>
      <td>WinSCP, FileZilla (both FTP)</td>
      <td>FileZilla (FTP), rsync, wget (FTP or HTTPS)</td>
    </tr>
  </table>

  <p>If you want to download a folder, but have Windows and can not use FTP/rsync, then there is not suitable tools to download a folder. As workaround, create a .txt file with the folder name in it and use the Paituli PowerShell script to download the folder. </p>

  <h2>Download a list of files</h2>
  <p>
    If you want to download only specific mapsheets of some dataset, you need to first create a list of files in Paituli and then download the files with a commandline tool.
  </p>

  <h3>Creating the list of files</h3>
  <ol>
    <li>Open the <RouterLink to="/download">Download</RouterLink> page.</li>
    <li>Select the dataset you are interested</li>
    <li>
      Select the mapsheets you need from the map or find them with the search.
    </li>
    <li>Click on the "Download list of files" button on the left side.</li>
    <li>
      You will receive the link to file list to your e-mail, download that
      file.<br />
    </li>
  </ol>

  <p>Alternatively you can make a custom file using the paths given in index map, which is available for each dataset in <RouterLink to="/download">Download</RouterLink> page Links tab.</p>

  <h3>Downloading the files with a list of files.</h3>
  <p>Unfortunately the graphical tools do not support downloading with a list of files, but is possible with command-line tools. For Windows users we provide custom PowerShell script. Linux and Mac users can download with <a href="http://www.linuxguide.it/command_line/linux-manpage/do.php?file=wget" target="_blank">wget</a> or <a href="http://www.linuxguide.it/command_line/linux-manpage/do.php?file=rsync" target="_blank">rsync </a>, which should be always available by default.</p>

  <h4>Paituli PowerShell script for Windows</h4>

  <p>For Windows users we provide PowerShell script to download files via HTTPS. This works ONLY in Windows. The script creates new folders, to keep the original folder structure.
    The script skips already downloaded files. </p>

  <p>Steps to use the script:</p>
  <ol>
    <li>Download the files list.</li>
    <li>Download the <a href="https://www.nic.funet.fi/index/geodata/download_paituli_data.ps1">Paituli download script</a>.</li>
    <li>Open this script in a text editor (for example NotePad) and change the paths marked with CHANGE. Save.</li>
    <li>Open PowerShell.</li>
    <li>Move to the folder where you saved the script, use cd command</li>
    <li>Run the script:
      <CodeBlock
        content="\download_paituli_data.ps1"
      />
    </li>
  </ol>

  <h4>wget</h4>

  <p>
    Use -i option to give the name of files list.
  </p>

  <CodeBlock
    :content="`wget -i <span style='color:yellow;'>file_list.txt</span>\
      -P <span style='color:cyan;'>local_folder_to_save/</span>`"
  />

  <h4>rsync</h4>

  <p>For rsync, remove from the beginning of each row 'http://www.nic.funet.fi/index/' in the file list.</p>
  <CodeBlock
    :content="`rsync -a --files-from=<span style='color:yellow;'>file_list.txt</span>\
    rsync://rsync.nic.funet.fi/ftp/index/geodata <span style='color:cyan;'>local_folder_to_save/</span>`"
  />



  <h2>Download a dataset or a folder</h2>

  <p>
    This is a relatively easy option, if the download needs match with the folder structure. Each Paituli dataset has its own folder, so this suits well for downloading a full dataset. Some bigger datasets have also several sub-folders and then it is case specific, if the sub-folders match your download needs.
  </p>

  <h3>Finding the path of the folder</h3>

  <p>
    Find the dataset specific path from <RouterLink to="/download" target="_blank">Download </RouterLink> page:
  </p>

  <ol>
    <li>Select the dataset you are interested</li>
    <li>Click the "APIs" button. The paths for all 3 protocols are displayed. </li>
  </ol>

  <p>
    In the folder of each dataset is a Readme-file,
    that includes the basic infomartion and link to Etsin, where full dataset
    descriptions are available.
  </p>
  <h3>Tools for downloading a folder</h3>
  <p>
    Different tools can be used for downloading a folder. The listed options here download automatically subfolders and keep the same structure on local computer.
  </p>
  <ol>
    <li>The easiest is <strong>a graphical FTP tool</strong> like <a href="https://filezilla-project.org/" target="_blank">FileZilla</a> or <a href="https://winscp.net/eng/download.php" target="_blank">WinSCP</a> (only for Windows). </li>
    <li><strong><a href="http://www.linuxguide.it/command_line/linux-manpage/do.php?file=rsync" target="_blank">rsync </a></strong> or <strong><a href="http://www.linuxguide.it/command_line/linux-manpage/do.php?file=wget" target="_blank">wget</a></strong> provide more options and can continue interrupted download without downloading everything again. rsync and wget are included in most
      Linux and Mac distributions by default. In Windows you could use Windows Subsystem for Linux. </li>
  </ol>

  <h4>Graphical FTP tools</h4>
  <ol>
    <li>Connect to server. host name: ftp.funet.fi, protocol: FTP, port number: 21.</li>
    <li>If username or password are asked, leave the fields empty.</li>
    <li>Navigate on the right side to the folder, where the dataset is stored.</li>
    <li>Open on the left side the folder, where you want to move the files.</li>
    <li>Drag the files or folders on the right side to left for download. </li>
  </ol>

  <h3>rsync</h3>

  <CodeBlock
    :content="`rsync -a <span style='color:yellow;'>rsync://rsync.nic.funet.fi/ftp/index/geodata/mml/hallintorajat_milj_tk/2017/</span> <span style='color:cyan;'>local_folder_to_save/</span>`"
  />

  <ul>
    <li>Change the blue parts in the command as needed.</li>
    <li>
      -a use archive mode, inc. save the original dates and download recursively
      also all subfolders
    </li>
  </ul>

  <h4>wget</h4>

  <p>
    In some places FTP and rsync are forbidden at firewall level, then you can use HTTPS with wget. wget has a lot of different options, one well working combination is this:
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
    <li>-r, recursive download</li>
    <li>-l inf, how deep the recursive search goes, default is 5, here set to infinite</li>
    <li>-N, update only, do not download already existing files, this is important if
      download was interrupted or updating already existing data.</li>
    <li>-np, do not download parent directories</li>
    <li>-nH, remove hostname</li>
    <li>-x, make directories similarly to Paituli</li>
    <li>-cuts-dirs, cut certain number of directories from the beginning to avoid too
      deep directory trees</li>
    <li>-c, continue broken download</li>
    <li>
      Use the ftp protocol if possible, otherwise you might get some extra
      index.* files.
    </li>
  </ul>

  <p>If you notice any problems or know a better way for downloading from Windows, please inform CSC</p>
</template>
