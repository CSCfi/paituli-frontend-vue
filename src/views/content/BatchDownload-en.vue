<script setup lang="ts">
import CodeBlock from '@/components/CodeBlock.vue';

import { APP_SETTINGS } from '@/shared/constants'

</script>

<template>
  <h1>Bulk download over HTTPS, FTP and rsync</h1>
  <p>
    The
    <RouterLink to="/download">Download Data</RouterLink>
    page supports compressed archive (zip) downloads up to
    {{ APP_SETTINGS.MAX_ZIP_SIZE }} MB in size, which can be rather
    limiting if the needed dataset is bigger.
    Paituli data is available also as files over HTTP, FTP
    and rsync protocols, which enable progressive download of large
    datasets without size limits.
  </p>
  <p>This page will go over the details on how to either:</p>
  <ul>
    <li>Download an entire dataset.</li>
    <li>
      Download a subset of a dataset using a file list.
    </li>
    <li>Mount dataset(s) as a network drive</li>
  </ul>
  <!--p>The root paths for each protocol are:</p>
  <ul>
    <li>
      <strong>HTTP</strong>:
      <a :href=URLS.HTTP_LINKS_BASE target="_blank">
        {{ URLS.HTTP_LINKS_BASE }}
      </a>
    </li>
    <li><strong>FTP</strong>: {{ URLS.FTP_LINKS_BASE }}</li>
    <li><strong>rsync</strong>: {{ URLS.RSYNC_LINKS_BASE }}</li>
  </ul-->

  <p>
    To achieve these, you need the <strong>path</strong>
    (network address) the dataset it is stored at.<br>
    The
    <RouterLink to="/download" target="_blank">Download Data</RouterLink>
    page provides this information:
  </p>
  <ol>
    <li>Select the dataset you are interested in</li>
    <li>Open the "Services" tab.</li>
    <li>Select "File Transfer".</li>
    <li>Copy the path of your choice, depending on which protocol suits your needs.</li>
  </ol>

  <h2>Downloading an entire dataset</h2>
  <p>
    Different tools can be used for downloading a dataset folder.
    Please refer to the tools' documentation if you encounter any problems.
    Also bear in mind that FTP and rsync connections can be disabled in
    some ornanizations. In such cases use HTTP with e.g. wget tool.
  </p>

  <h3>Graphical FTP tools</h3>
  Probably the easiest and most user-friendly approach is
  <strong>a graphical FTP tool</strong> like
  <a href="https://filezilla-project.org/" target="_blank">FileZilla</a>
  or
  <a href="https://winscp.net/eng/download.php" target="_blank">WinSCP</a>
  (Windows only). The following brief instructions are for FileZilla:
  <ol>
    <li>Connect to the FTP server with:
      <ul>
        <li>host name: ftp.funet.fi</li>
        <li>protocol: FTP</li>
        <li>port number: 21</li>
        <li>Leave the username and password empty if asked</li>
      </ul>
    </li>
    <li>On the right side, navigate to the folder where the dataset is stored.</li>
    <li>On the left side, choose where you want to copy the dataset to on your own system.</li>
    <li>Drag the dataset you navigated to from right side to left size to start transfer.</li>
  </ol>

  <h3>rsync</h3>
  <p>
    If your system supports the rsync command line tool,
    simply change the highlighted parts in the command as needed.
    You need to specify the path to the dataset you want to download
    and then a local path to download to. The -a option combines several options,
    most notably downloading recursively and preserving file metadata.
  </p>
  <CodeBlock
    :content="`rsync -a <span style='color:yellow;'>rsync://rsync.nic.funet.fi/ftp/pub/sci/geo/geodata/mml/hallintorajat_milj_tk/2017/</span> <span style='color:cyan;'>local_folder_to_save/</span>`"
  />

  <h3>wget</h3>
  <p>
    While wget supports also HTTP, we use FTP here to avoid downloading
    some extra index.* files. The tool has a lot of different options,
    one well working combination is the following:
  </p>
  <CodeBlock
    :content="`wget -r -l inf -N -np -nH -x -c --cut-dirs=6 \\
      <span style='color:yellow;'>ftp://ftp.funet.fi/pub/sci/geo/geodata/mml/hallintorajat_milj_tk/2017/</span> \\
      -P <span style='color:cyan;'>local_folder_to_save/</span>`"
  />
  <ul>
    <li>-r, recursive download</li>
    <li>-l inf, how deep the recursive search goes, default is 5,
      here set to infinite</li>
    <li>-N, update only, do not download already existing files,
      this is important if download was
      interrupted or updating already existing data.</li>
    <li>-np, do not download parent directories</li>
    <li>-nH, remove hostname</li>
    <li>-x, make directories similarly to Paituli</li>
    <li>-cuts-dirs, cut certain number of directories from
      the beginning to avoid too deep directory trees</li>
    <li>-c, continue if download was interrupted</li>
  </ul>

  <h2>Download a list of files</h2>
  <p>
    If you want to download only specific mapsheets or some specific files
    from a dataset, you need to first create a list of files using Paituli
    and then download the files with a commandline tool.
  </p>

  <h3>Creating the file list</h3>
  <ol>
    <li>
      Open the
      <RouterLink to="/download" target="_blank">Download Data</RouterLink>
      page.
    </li>
    <li>Select the dataset you are interested in.</li>
    <li>Select the mapsheets you need using selection tools or with the search.</li>
    <li>Adjust the selected files if needed and click "Download".</li>
    <li>In the download modal, enable the "Download as file list" option before starting download.</li>
  </ol>

  <!--p>
    Alternatively you can make a custom file using the paths given in index map, which is available
    for each dataset in <a href="download.html">Download data</a> page Links tab.
  </p-->

  <h3>Downloading the listed files</h3>
  <p>
    Unfortunately the graphical tools do not support downloading with a list of files, but is
    possible with command-line tools:
  </p>

  <h4>wget</h4>
  <p>Compared to previous example -i option is added to give the name of files list.</p>
  <CodeBlock
    :content="`wget -i <span style='color:yellow;'>file_list.txt</span>\
      -P <span style='color:cyan;'>local_folder_to_save/</span>`"
  />

  <h4>rsync</h4>
  <p>
    Note! For rsync you must remove the 'http://www.nic.funet.fi/index/' from each row in the file
    list.
  </p>
  <CodeBlock
    :content="`rsync -a --files-from=<span style='color:yellow;'>file_list.txt</span>\
    rsync://rsync.nic.funet.fi/ftp/pub/sci/geo <span style='color:cyan;'>local_folder_to_save/</span>`"
  />

  <h4>Start-BitsTransfer in Windows PowerShell</h4>
  <p>Start-BitsTransfer requires a little bit more preparations:</p>
  <ol>
    <li>Edit your list of files and add "Source" as the new first line</li>
    <li>Make sure your local_folder_to_save exists.</li>
  </ol>
  <CodeBlock
    :content="`Import-CSV <span style='color: yellow;'>file_list.txt</span> | Start-BitsTransfer -Destination <span style='color: cyan;'>local_folder_to_save/</span>`"
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

  <h2>Mount FTP as a local drive</h2>
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

  <h2>Summary of tools and their resources</h2>

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
      Commandline tools:
      <ul>
        <li>

          <a
            href="http://www.linuxguide.it/command_line/linux-manpage/do.php?file=wget"
            target="_blank"
          >wget</a>
          supports both HTTPS and FTP protocols.
          It is also
          <a href="https://eternallybored.org/misc/wget/" target="_blank">
            available on Windows
          </a>.
        </li>
        <li>
          <a
            href="http://www.linuxguide.it/command_line/linux-manpage/do.php?file=rsync"
            target="_blank"
          >rsync</a>
          supports the rsync protocol. Also
          <a href="https://bobcares.com/blog/rsync-from-windows-to-linux-over-ssh" target="_blank">
            available on Windows
          </a>.
        </li>
        <li>
          rsync and wget are included in most Linux and Mac distributions
          by default. In Windows you can use the windows distributions
          linked above or use Windows Subsystem for Linux (WSL).
        </li>
        <li>
          <a
            href="https://docs.microsoft.com/en-us/powershell/module/bitstransfer/start-bitstransfer"
            target="_blank">
            Start-BitsTransfer
          </a>
          is available in Windows PowerShell by default.
          It is not available for Linux or Mac.
        </li>
      </ul>
    </li>
  </ul>
</template>
