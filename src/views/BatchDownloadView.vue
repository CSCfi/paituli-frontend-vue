<script setup lang="ts">
import CodeBlock from '@/components/tabs/CodeBlock.vue';
import { VCodeBlock } from '@wdns/vue-code-block';

</script>

<template>
  <h1>Bulk download over HTTPS, FTP and rsync</h1>

  <p>
    Paituli <a href="download.html">Download page</a> enables downloading data as .zip file max. 3
    Gb at a time. This can be rather limiting, if the needed dataset is bigger. For enabling bigger
    downloads, Paituli data is available also as files over HTTPS, FTP and rsync from nic.funet.fi
    service. FTP and rsync are in general easier to use, but in some organizations these might be
    forbidden by local admins. HTTPS should usually work.
  </p>

  <p>
    In the folder of each dataset is a Readme-file, that includes the basic infomartion and link to
    Etsin, where full dataset descriptions are available.
  </p>

  <p>The root paths for each protocol are:</p>

  <ul>
    <li>
      <strong>HTTP</strong>:
      <a href="http://www.nic.funet.fi/index/geodata/"
         target="_blank"
      >http://www.nic.funet.fi/index/geodata/</a
      >
    </li>
    <li><strong>FTP</strong>: ftp://ftp.funet.fi/index/geodata/</li>
    <li><strong>rsync</strong>: rsync://rsync.nic.funet.fi/ftp/pub/sci/geo/geodata/</li>
  </ul>

  <p>Main options for bulk download:</p>
  <ul>
    <li>Download a folder, possibly including subfolders.</li>
    <li>
      Download a list of selected files. The file list can be created on
      <a href="download.html">Download data</a> page.
    </li>
    <li>Mount FTP as local drive</li>
  </ul>

  <h2>Downloading a folder</h2>

  <p>
    This is a relatively easy option, if the download needs match with the folder structure. Each
    Paituli dataset has its own folder, so this suits well for downloading a full dataset.
  </p>

  <h3>Finding the path of the folder</h3>
  For finding the folder you can simply browse the directories in HTTP or FTP mode. The datasets
  have been stored in logical structure, so you might find what you are looking for. In the tree you
  have to first select the data producer, then dataset and then year (and other options). The
  folders have mostly names in Finnish.
  <p>
    The other option is to find the dataset specific path from
    <a href="download.html">Download data</a> page:
  </p>

  <ol>
    <li>Select the dataset you are interested</li>
    <li>Open the "Links" tab in lower left corner. The links for all 3 protocols are displayed.</li>
  </ol>

  <h3>Downloading the files of a folder and its possible subfolders</h3>
  <p>
    Different tools can be used for downloading a folder, see links to different tools' own
    documentation at the end of this page. The listed options here download automatically subfolders
    and keep the same structure on local computer.
  </p>
  <ol>
    <li>The easiest is <strong>a graphical FTP tool</strong> like FileZilla or WinSCP.</li>
    <li>
      <strong>rsync</strong> or <strong>wget</strong> command line tools. In some places FTP and
      rsync are forbidden at firewall level, then you can use wget with HTTPS.
    </li>
  </ol>

  <h4>Graphical FTP tools</h4>
  <ol>
    <li>Connect to server. host name: ftp.funet.fi, protocol: FTP, port number: 21.</li>
    <li>If username or password are asked, leave the fields empty.</li>
    <li>Navigate on the right side to the folder, where the dataset is stored.</li>
    <li>Open on the left side the folder, where you want to move the files.</li>
    <li>Drag the files or folders on the right side to left for download.</li>
  </ol>

  <h4>rsync</h4>

  <CodeBlock
    :content="`rsync -a rsync://rsync.nic.funet.fi/ftp/pub/sci/geo/geodata/<span style='color:orange;'>mml/hallintorajat_milj_tk/2017/</span> <span style='color:yellow;'>local_folder_to_save/</span>`"
  />

  <ul>
    <li>Change the highlighted parts in the command as needed.</li>
    <li>
      -a use archive mode, inc. save the original dates and download recursively also all subfolders
    </li>
  </ul>

  <h4>wget</h4>

  <p>wget has a lot of different options, one well working combination is this:</p>

  <CodeBlock
    :content="`wget -r -l inf -N -np -nH -x -c --cut-dirs=6 \\
      ftp://ftp.funet.fi/pub/sci/geo/geodata/<span style='color:orange;'>mml/hallintorajat_milj_tk/2017/</span> \\
      -P <span style='color:yellow;'>local_folder_to_save/</span>`"
  />

  <ul>
    <li>-r, recursive download</li>
    <li>-l inf, how deep the recursive search goes, default is 5, here set to infinite</li>
    <li>
      -N, update only, do not download already existing files, this is important if download was
      interrupted or updating already existing data.
    </li>
    <li>-np, do not download parent directories</li>
    <li>-nH, remove hostname</li>
    <li>-x, make directories similarly to Paituli</li>
    <li>
      -cuts-dirs, cut certain number of directories from the beginning to avoid too deep directory
      trees
    </li>
    <li>-c, continue broken download</li>
    <li>Use the ftp protocol if possible, otherwise you might get some extra index.* files.</li>
  </ul>

  <h2>Download a list of files</h2>
  <p>
    If you want to download only specific mapsheets of some dataset, you need to first create a list
    of files in Paituli and then download the files with a commandline tool.
  </p>

  <h3>Creating the list of files</h3>
  <ol>
    <li>Open the <a href="download.html">Download data</a> page.</li>
    <li>Select the dataset you are interested</li>
    <li>Select the mapsheets you need from the map or find them with the search.</li>
    <li>Click on the "Download list of files" button on the left side.</li>
    <li>You will receive the link to file list to your e-mail, download that file.<br /></li>
  </ol>

  <p>
    Alternatively you can make a custom file using the paths given in index map, which is available
    for each dataset in <a href="download.html">Download data</a> page Links tab.
  </p>

  <h3>Downloading the files with a list of files.</h3>
  <p>
    Unfortunately the graphical tools do not support downloading with a list of files, but is
    possible with command-line tools:
  </p>

  <h4>wget</h4>

  <p>Compared to previous example -i option is added to give the name of files list.</p>

  <div class="codeBlock">
  </div>

  <CodeBlock
    :content="`wget -i <span style='color:orange;'>file_list.txt</span>\
      -P <span style='color:yellow;'>local_folder_to_save/</span>`"
  />

  <h4>rsync</h4>

  <p>
    For rsync, remove from the beginning of each row 'http://www.nic.funet.fi/index/' in the file
    list.
  </p>

  <CodeBlock
    :content="`rsync -a --files-from=<span style='color:orange;'>file_list.txt</span>\
    rsync://rsync.nic.funet.fi/ftp/pub/sci/geo <span style='color:yellow;'>local_folder_to_save/</span>`"
  />

  <h4>Start-BitsTransfer in Windows PowerShell</h4>

  <p>Start-BitsTransfer requires a little bit more preparations:</p>
  <ol>
    <li>Add to your list of file a new first row: Source</li>
    <li>Make sure your local_folder_to_save exists.</li>
  </ol>

  <VCodeBlock
    :content="`Import-CSV .\<b style=color: blue>file_list.txt</b> | Start-BitsTransfer -Destination <b style=color: blue>local_folder_to_save/</b>`"
  />

  <p>
    This version of the command saves all files to the same folder. If you want to save the files to
    same folder structure as in Paituli, then make a .csv file with output paths, see
    <a href="https://www.jesusninoc.com/10/08/start-bitstransfer-examples/"
       target="_blank"
    >Start-BitsTransfer, Example 2.</a
    >
    Use for example Excel for this. All subfolders must exist before running the Start-BitsTransfer
    command.
  </p>

  <h2>Mount FTP as local drive</h2>

  <p>
    It is possible to mount an FTP site as local drive. This would enable opening the files directly
    from any GIS software without any extra manual steps for downloading. Of course the files
    actually have to be downloaded before using them, so opening a file from FTP is slower than
    actual local file.
  </p>

  <ul>
    <li>
      Linux users can use for example
      <a href="http://curlftpfs.sourceforge.net/" target="_blank">curlFtpFS</a>.
    </li>
    <li>
      For Windows there does not seem to be any such free software that would work with reasonable
      speed.
    </li>
  </ul>

  <h2>Recommended tools</h2>

  <ul>
    <li>
      Graphical FTP tools:
      <ul>
        <li><a href="https://filezilla-project.org/" target="_blank">Filezilla </a></li>
        <li>
          <a href="https://winscp.net/eng/download.php" target="_blank">WinSCP</a>, only for
          Windows.
        </li>
      </ul>
    </li>
    <li>
      Command line tools. rsync and wget can also continue interrupted download without downloading
      everything again. wget supports both HTTPS and FTP protocols. rsync and wget are included in
      most Linux and Mac distributions by default. In Windows you could use Windows Subsystem for
      Linux or add the tools yourself. Start-BitsTransfer is available in Windows PowerShell by
      default, it is not available for Linux or Mac.
      <ul>
        <li>
          <a
            href="http://www.linuxguide.it/command_line/linux-manpage/do.php?file=rsync"
            target="_blank"
          >rsync </a
          >.
          <a href="https://bobcares.com/blog/rsync-from-windows-to-linux-over-ssh" target="_blank">
            rsync installation to Windows
          </a>
        </li>
        <li>
          <a
            href="http://www.linuxguide.it/command_line/linux-manpage/do.php?file=wget"
            target="_blank"
          >wget</a
          >.
          <a href="https://eternallybored.org/misc/wget/" target="_blank">
            wget download for Windows
          </a>
        </li>
        <li>
          <a
            href="https://docs.microsoft.com/en-us/powershell/module/bitstransfer/start-bitstransfer"
            target="_blank"
          >Start-BitsTransfer</a
          >
        </li>
      </ul>
    </li>
  </ul>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
