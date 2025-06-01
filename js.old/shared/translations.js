import { LOCALE } from './constants'

let locale =
  typeof localStorage.language == 'undefined'
    ? LOCALE.FINNISH
    : localStorage.language

const translations = {
  appHeader: {
    fi: 'PaITuli - Paikkatietoja tutkimukseen ja opetukseen',
    en: 'PaITuli - Spatial data for research and teaching',
  },
  data: {
    header: {
      fi: 'Valitse aineisto:',
      en: 'Select dataset:',
    },
    producer: {
      fi: 'Tuottaja:',
      en: 'Producer:',
    },
    selectProducer: {
      fi: '--Valitse aineistotuottaja--',
      en: '--Select data producer--',
    },
    data: {
      fi: 'Aineisto:',
      en: 'Data:',
    },
    scale: {
      fi: 'Mittakaava:',
      en: 'Scale:',
    },
    year: {
      fi: 'Vuosi:',
      en: 'Year:',
    },
    format: {
      fi: 'Formaatti:',
      en: 'Format:',
    },
    coordSys: {
      fi: 'Koordinaatisto:',
      en: 'Coordinate system:',
    },
    metadata: {
      fi: 'Metatiedot',
      en: 'Metadata',
    },
    search: {
      fi: 'Hae karttalehtiä',
      en: 'Search mapsheets',
    },
    searchresult: {
      fi: 'Löydettiin !features! karttalehteä',
      en: 'Found !features! map sheets',
    },
    toomanyresults: {
      fi: 'Löydettiin liian monta karttalehteä. Rajaa hakua tarkemmaksi.',
      en: 'Found too many map sheets. Please search more specifically.',
    },
  },
  info: {
    download: {
      fi: 'Lataa zip tiedostona',
      en: 'Download as zip file',
    },
    downloadlist: {
      fi: 'Lataa tiedostolista',
      en: 'Download file list',
    },
    downloadTooltip: {
      fi:
        'Ladattavan zip tiedoston enimmäsikoko on 3GB. Suuremmilla aineistoilla lataa tiedostolista ja lataa aineisto ftp:n tai rsyncin avulla.',
      en:
        'Limit for downloading as a zip file is 3GB. For larger datasets download file list and use ftp/rsync',
    },
    dlListTooltip: {
      fi:
        'Lataa lista valituista tiedostoista polkuineen. Listan avulla voit ladata tiedostot esimerkiksi FTP:n tai rsyncin avulla. Ladattavien tiedostojen määrässä ei ole 3GB rajoitusta. Lisätietoja FTP ja rsync sivulta.',
      en:
        "Download a list of selected files including paths. You can use the list to download files using FTP or rsync. There isn't download size limit for this method. See FTP and rsync page for details",
    },
    dlIndexMapInfo: {
      fi:
        'Tiedosto sisältää kaikkien karttalehtien nimet, polut ja geometrian.',
      en: 'The shapefile contains names, paths and geometry of mapsheets.',
    },
    files: {
      fi: 'Tiedostot',
      en: 'Files',
    },
    documents: {
      fi: 'Dokumentit',
      en: 'Documents',
    },
    license: {
      fi: 'Käyttöehdot',
      en: 'Licence terms',
    },
    downloadindex: {
      fi: 'Indeksikartta Shape formaatissa.',
      en: 'Indexmap as a Shape file.',
    },
    info: {
      fi:
        'Valitse karttalehdet kartalta tai hae karttalehtia nimen perusteella. Karttalehtien valitsemiksi kartalta aktivoi ensin karttalehtien valinnan työkalu ja raaha kartalle sopivaan paikkaan nelikulmio tai klikkaa kartalla tarvitsemasi karttalehtiä. Jo valittuja karttalehtiä voi poistaa valinnasta valitsemalla niitä uudestaan.',
      en:
        'Select area of interest from the map or search map sheets by name. For selecting map sheets from the map first activate the map sheets selection tool and then draw a rectangle to a suitable area or click map sheets one by one. Already selected map sheets may be removed from selection by selecting them again.',
    },
    downloadtab: {
      fi: 'Ladattavat tiedostot',
      en: 'Files for download',
    },
    featureinfotab: {
      fi: 'Kohdetiedot',
      en: 'Feature info',
    },
    metadatatab: {
      fi: 'Metatiedot',
      en: 'Metadata',
    },
    linkstab: {
      fi: 'Linkit',
      en: 'Links',
    },
    metadatainfo: {
      fi:
        "Tämän aineiston <b>kaikki metatiedot</b> löytyvät Etsin-hakupalvelusta pysyvällä tunnisteella: <a href='!metadata_url!' target='_blank'>!metadata_url!</a>" +
        '</a>.',
      en:
        "<b>All metadata</b> for this dataset is available from Etsin metadata service with permanent ID: <a href='!metadata_url!' target='_blank'>!metadata_url!</a>",
    },
    metadatacontentheader: {
      fi: '<h6 class="tab-content-header">Aineiston kuvaus</h6>',
      en: '<h6 class="tab-content-header">Description of dataset</h6>',
    },
    metadatalinksheader: {
      fi: '<h6 class="tab-content-header">Aineistoa kuvaavat tiedostot</h6>',
      en: '<h6 class="tab-content-header">Files describing the dataset</h6>',
    },
    nometadataavailable: {
      fi: 'Aineiston kuvaus ei ole saatavilla',
      en: 'Dataset description not available',
    },
    featureinfodefault: {
      fi: 'Valitse Info-työkalu ja klikkaa karttaa',
      en: 'Select Info tool and click on map',
    },
    maxfeaturewarning: {
      fi:
        'Latauksen kokorajoitus on 3 GB. Korkeintaan !maxFeatures! karttalehteä voidaan valita.',
      en:
        'Download limit is 3 GB. Maximum of !maxFeatures! map sheets may be selected.',
    },
    linksHeader: {
      fi: 'Rsync/FTP/HTTP linkit aineistoon:',
      en: 'Rsync/FTP/HTTP links to dataset:',
    },
    linksInfo: {
      fi:
        "Lisätietoja <a target='_blank' href=!infolink!>FTP ja rsync sivulta</a>.",
      en:
        "Additional info: <a target='_blank' href=!infolink!>FTP and rsync page</a>.",
    },
    linksIntro: {
      fi:
        'Ladataksesi kokonaisia aineistoja tai selataksesi aineiston tiedostoja käytä alla olevia linkkejä:',
      en:
        'For downloading the full dataset or viewing the files included please use these links:',
    },
  },
  map: {
    basemap: {
      fi: 'Taustakartta',
      en: 'Background map',
    },
    indexmap: {
      fi: 'Indeksikartta',
      en: 'Index map',
    },
    datamap: {
      fi: 'Aineisto',
      en: 'Data',
    },
    catchment: {
      fi: 'Valuma-alueet',
      en: 'Catchment areas',
    },
    municipalitiesmap: {
      fi: 'Kuntajako',
      en: 'Municipalities',
    },
    reset: {
      fi: 'Näytä koko Suomi',
      en: 'Zoom to Finland',
    },
    pan: {
      fi: 'Siirrä karttaa hiirellä raahaamalla',
      en: 'Pan, move the map with dragging the mouse',
    },
    select: {
      fi:
        'Valitse karttalehtiä kartalta, raahaamalla nelikulmio tai klikkaamalla',
      en: 'Select map sheets from the map by drawing a rectangle or clicking',
    },
    info: {
      fi: 'Info, katso kohteiden ominaisuustietoja klikkaamalla',
      en: 'Info, see attribute data by clicking',
    },
    clearSelection: {
      fi: 'Poista kaikki karttalehdet valinnasta',
      en: 'Deselect all map sheets',
    },
    draw: {
      fi: 'Valitse karttalehtiä piirtämällä',
      en: 'Select map sheets by drawing',
    },
    dataAvailabilityWarning: {
      fi: 'Aineiston esikatselu ei ole saatavilla',
      en: 'Data preview is not available',
    },
    resolutionwarning: {
      fi: 'Lähennä karttaa nähdäksesi aineiston',
      en: 'Zoom in to see the data',
    },
    locationsearch: {
      fi: 'Etsi sijaintia...',
      en: 'Search for a location...',
    },
    locationNotFound: {
      fi: 'Annetulla haulla ei löytynyt sijantia',
      en: 'The provided query did not find any related location',
    },
  },
  email: {
    modalheader: {
      fi: 'Lähetä latauslinkki sähköpostiini',
      en: 'Send data download link to my e-mail',
    },
    modalheaderList: {
      fi: 'Lähetä tiedostolistaus sähköpostiini',
      en: 'Send file list to my e-mail',
    },
    datasetinfo: {
      fi: 'Valittu aineisto',
      en: 'Selected dataset',
    },
    inputsheader: {
      fi: 'Tiedot lataamista varten',
      en: 'Information for downloading',
    },
    emailfield: {
      fi: 'Sähköpostiosoite',
      en: 'E-mail',
    },
    emailfieldPlaceholder: {
      fi: 'esim@toinen.fi',
      en: 'example@other.com',
    },
    licensefield: {
      fi:
        "Hyväksyn <a href='!license!' target='_blank'>aineiston käyttöehdot</a>",
      en: "I accept the <a href='!license!' target='_blank'>dataset's license terms</a>",
    },
    privacylabel: {
      fi:
        "Olen tutustunut <a href='privacy.html' target='_blank'>Paitulin tietosuojaselosteeseen</a> ja annan suostumukseni henkilötietojeni käsittelyyn siinä kuvatulla tavalla.",
      en: "I have read <a href='privacy.html' target='_blank'>Paituli Privacy Policy</a> and give consent to processing of my personal data.",
    },    
    info: {
      fi:
        'Lähetettyäsi tilauksen saat hetken kuluttua sähköpostiisi latauslinkin.',
      en:
        'In a moment after sending the download order, you will receive an e-mail with a download link.',
    },
    infoList: {
      fi:
        'Lähetettyäsi tilauksen saat hetken kuluttua sähköpostiisi tiedostolistan.',
      en:
        'In a moment after sending the order, you will receive an e-mail with a file list.',
    },
    sendButton: {
      fi: 'Lähetä latauslinkki sähköpostiini',
      en: 'Send data download link to my e-mail',
    },
    sendButtonList: {
      fi: 'Lähetä tiedostolista sähköpostiini',
      en: 'Send file list link to my e-mail',
    },
    cancelButton: {
      fi: 'Peruuta',
      en: 'Cancel',
    },
    errorEmailLength: {
      fi: 'Sähköpostiosoite puuttuu',
      en: 'E-mail is missing',
    },
    errorEmailFormat: {
      fi: 'Virheellinen sähköpostiosoite',
      en: 'E-mail address invalid',
    },
    errorCheckboxChecked: {
      fi: 'Käyttöehtojen hyväksyminen on pakollista',
      en: 'Accepting the license terms is mandatory',
    },
    errorPrivacyCheckboxChecked: {
      fi: 'Tietoturvaselosteen hyväksyminen on pakollista',
      en: 'Accepting the privacy notification is mandatory',
    },    
  },
  metadataTable: {
    producer: {
      fi: 'Tuottaja',
      en: 'Producer',
    },
    name: {
      fi: 'Aineisto',
      en: 'Dataset',
    },
    scale: {
      fi: 'Mittakaava',
      en: 'Scale',
    },
    year: {
      fi: 'Vuosi',
      en: 'Year',
    },
    format: {
      fi: 'Formaatti',
      en: 'Format',
    },
    coordSys: {
      fi: 'CRS',
      en: 'CRS',
    },
    description: {
      fi: 'Kuvaus',
      en: 'Description',
    },
    license: {
      fi: 'Lisenssi',
      en: 'License',
    },
    download: {
      fi: 'Lataus',
      en: 'Download',
    },
    access: {
      fi: 'Lataa',
      en: 'Download',
    },
    filter: {
      fi: 'Rajaa tuloksia',
      en: 'Filter results',
    },
  },
  header: {
    homePage: {
      fi: 'Koti',
      en: 'Home',
    },
    metadataPage: {
      fi: 'Metatiedot',
      en: 'Metadata',
    },
    downloadPage: {
      fi: 'Latauspalvelu',
      en: 'Download data',
    },
    helpPage: {
      fi: 'Ohjeet',
      en: 'Help',
    },
    webservicesPage: {
      fi: 'Rajapinnat',
      en: 'Web services',
    },
    filesPage: {
      fi: 'Massalataus',
      en: 'Batch download',
    },
    stacPage: {
      fi: 'STAC',
      en: 'STAC',
    },	
    openDataPage: {
      fi: 'Jaa aineistosi',
      en: 'Share your data',
    },
    contactPage: {
      fi: 'Yhteystiedot',
      en: 'Contact',
    },
    contact: {
      fi: 'Yhteystiedot',
      en: 'Contact',
    },
    language: {
      fi: 'In English',
      en: 'Suomeksi',
    },
    login: {
      fi: 'Kirjaudu',
      en: 'Log in',
    },
    searchPlaceholder: {
      fi: 'Etsi AVAA-Portaalista',
      en: 'Search from AVAA Portal',
    },
    searchButton: {
      fi: 'Etsi',
      en: 'Search',
    },
  },
  webservicesTable: {
    dataUrl: {
      fi: 'Karttatason nimi',
      en: 'Layer name',
    },
    layerName: {
      fi: 'Karttatason otsikko',
      en: 'Layer title',
    },
    scaleLimit: {
      fi: 'Mittakaavarajoitus',
      en: 'Scale limit',
    },
  },
  contact: {
    contentFile: {
      fi: `contact_fi.html`,
      en: `contact_en.html`,
    },
  },
  help: {
    contentFile: {
      fi: `help_fi.html`,
      en: `help_en.html`,
    },
  },
  files: {
    contentFile: {
      fi: `files_fi.html`,
      en: `files_en.html`,
    },
  },
  stac: {
    contentFile: {
      fi: `stac_fi.html`,
      en: `stac_en.html`,
    },
  },  
  opendata: {
    contentFile: {
      fi: `opendata_fi.html`,
      en: `opendata_en.html`,
    },
  },
  home: {
    contentFile: {
      fi: `home_fi.html`,
      en: `home_en.html`,
    },
  },
  metadata: {
    contentFile: {
      fi: `metadata_fi.html`,
      en: `metadata_en.html`,
    },
  },
  webservices: {
    contentFile: {
      fi: `webservices_fi.html`,
      en: `webservices_en.html`,
    },
  },
  accessibility: {
    contentFile: {
      fi: `accessibility_fi.html`,
      en: `accessibility_en.html`,
    },
  },
  privacy: {
    contentFile: {
      fi: `privacy_fi.html`,
      en: `privacy_en.html`,
    },    
  },
  footer: {
    ministryLogo: {
      fi: './okm-logo-fi.gif',
      en: '../okm-logo-en.png',
    },
    avoinLogo: {
      fi: './ATT_pos_pysty_RGB_FI_transparent.png',
      en: './ATT_pos_pysty_RGB_EN_transparent.png',
    },
    accessibilityLink: {
      fi: 'Saavutettavuus',
      en: 'Accessibility',
    },
    privacyLink: {
      fi: 'Tietosuoja',
      en: 'Privacy',
    },
  },
}

const byString = (o, s) => {
  s = s.replace(/\[(\w+)\]/g, '.$1') // convert indexes to properties
  s = s.replace(/^\./, '') // strip a leading dot
  const a = s.split('.')
  for (let i = 0, n = a.length; i < n; ++i) {
    const k = a[i]
    if (k in o) {
      o = o[k]
    } else {
      return
    }
  }
  return o
}

const translate = (field) => byString(translations, field + '.' + locale)
const getCurrentLocale = () => locale
const changeLocale = (l) => (locale = l)

export { translate, getCurrentLocale, changeLocale }
