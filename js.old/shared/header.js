import $ from 'jquery'

import { translate, getCurrentLocale, changeLocale } from './translations'
import { LOCALE } from './constants'

import '../../css/main.css'
import '../../css/header.css'

const MATOMO_TAG = process.env.MATOMO_TAG

const languageSelector = $('#language-selector')
const homeLink = $('#home-link')
const metadataLink = $('#metadata-link')
const downloadLink = $('#download-link')
const helpLink = $('#help-link')
const webServicesLink = $('#webservices-link')
const filesLink = $('#files-link')
const stacLink = $('#stac-link')
const openDataLink = $('#open-data-link')

function setMatomoTag() {
	var meta = document.createElement('meta');
	meta.name = "fdwe-environment";
	meta.content = MATOMO_TAG;
	document.head.appendChild(meta);
}

setMatomoTag()

function setTranslations() {
  homeLink.text(translate('header.homePage'))
  metadataLink.text(translate('header.metadataPage'))
  downloadLink.text(translate('header.downloadPage'))
  helpLink.text(translate('header.helpPage'))
  webServicesLink.text(translate('header.webservicesPage'))
  filesLink.text(translate('header.filesPage'))
  stacLink.text(translate('header.stacPage'))  
  openDataLink.text(translate('header.openDataPage'))
  languageSelector.text(translate('header.language'))
}

languageSelector.click(function () {
  updateLanguage()
  return false
})

function toggleTabActivation(tab_id) {
  $('navbar-link').removeClass('active')
  $(tab_id).addClass('active')
  $(tab_id).next().addClass('active')
}

function updateLanguage() {
  if (getCurrentLocale() == LOCALE.FINNISH) {
    if (typeof Storage !== 'undefined') {
      localStorage.language = LOCALE.ENGLISH
      window.location.reload()
    }
  } else {
    changeLocale(LOCALE.FINNISH)
    if (typeof Storage !== 'undefined') {
      localStorage.language = LOCALE.FINNISH
      window.location.reload()
    }
  }
}

setTranslations()

export { toggleTabActivation }
