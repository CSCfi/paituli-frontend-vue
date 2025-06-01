import $ from 'jquery'
require("jquery-ui/ui/widgets/tooltip");

import auth from '../shared/auth'
import datasets from './datasets'
import datasetSelect from './components/datasetSelect'
import featureSearch from './components/featureSearch'
import locationSearch from './components/locationSearch'
import map from './components/map'
import { translate } from '../shared/translations'
import { toggleTabActivation } from '../shared/header'

import 'jquery-ui/themes/base/tooltip.css'
import 'jquery-ui/themes/base/core.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'ol/ol.css'
import 'ol-layerswitcher/src/ol-layerswitcher.css'
import '../../css/download.css'
let pageDataIdParam = getUrlParameter('data_id')

function getUrlParameter(param) {
  const pageURL = window.location.search.substring(1)
  const urlVariables = pageURL.split('&')
  for (let i = 0; i < urlVariables.length; i++) {
    const parameterName = urlVariables[i].split('=')
    if (parameterName[0] == param) {
      return parameterName[1]
    }
  }
  return null
}

const fetchDatasets = async () => {
  const result = await datasets.executeQuery()
  if (result.ok) {
    if (pageDataIdParam === null || pageDataIdParam.length == 0) {
      init()
    } else {
      const selectedData = datasets.getById(pageDataIdParam)
      if (
        selectedData != null &&
        selectedData.access == 2 &&
        !auth.loggedIn()
      ) {
        window.location.replace('/')
      } else {
        init()
      }
    }
  }
}

function setTranslations() {
  $('#data-form legend').text(translate('data.header'))
  $('#resetview-button').attr('title', translate('map.reset'))
  $('#clearselection-button').attr('title', translate('map.clearSelection'))
  $('#panselection-button').attr('title', translate('map.pan'))
  $('#selectselection-button').attr('title', translate('map.select'))
  $('#infoselection-button').attr('title', translate('map.info'))
  $('#drawselection-button').attr('title', translate('map.draw'))

  $('#download-container-anchor').text(translate('info.downloadtab'))
  $('#feature-info-container-anchor').text(translate('info.featureinfotab'))
  $('#metadata-container-anchor').text(translate('info.metadatatab'))
  $('#links-container-anchor').text(translate('info.linkstab'))
}

function init() {
  $(document).tooltip({ track: true })
  setTranslations()
  datasetSelect.init(pageDataIdParam)
  locationSearch.init()
  featureSearch.init()
  map.resetView()
}

fetchDatasets()

$(function () {
  $('#header').load('header.html')
  $('#footer').load('footer.html', function () {
    $('.body_container').show()
    toggleTabActivation('#download-link')
  })
})
