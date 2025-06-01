import $ from 'jquery'
require("jquery-ui/ui/widgets/tabs");

import downloadTab from './downloadTab'
import featureInfoTab from './featureInfoTab'
import linksTab from './linksTab'
import metadataTab from './metadataTab'

import 'jquery-ui/themes/base/tabs.css'
import 'jquery-ui/themes/base/theme.css'

const tabContainerId = 'info-container'
const tabContainer = $('#' + tabContainerId)
tabContainer.tabs({
  activate: (event, ui) => (prevSelectedTab = ui.newPanel.get(0).id),
})
let prevSelectedTab = null

function selectTabAfterDatasetChange(hasInfoTab) {
  if (prevSelectedTab == null) {
    prevSelectedTab = downloadTab.TAB_ID
  }
  let newTabId = null
  if (prevSelectedTab == downloadTab.TAB_ID) {
    newTabId = downloadTab.TAB_ID
  } else if (prevSelectedTab == featureInfoTab.TAB_ID) {
    if (hasInfoTab) {
      newTabId = featureInfoTab.TAB_ID
    } else {
      newTabId = downloadTab.TAB_ID
    }
  } else if (prevSelectedTab == metadataTab.TAB_ID) {
    newTabId = metadataTab.TAB_ID
  }
  const index = $('#' + tabContainerId + ' a[href="#' + newTabId + '"]')
    .parent()
    .index()
  $('#' + tabContainerId).tabs('option', 'active', index)
}

function setInfoContent(contentType, params) {
  switch (contentType) {
    case 'download':
      downloadTab.init()
      break
    case 'featureinfo':
      featureInfoTab.init(params)
      break
    case 'metadata':
      metadataTab.init()
      linksTab.init()
      break
    default:
      break
  }
}

function selectTab(tabIndex) {
  tabContainer.tabs('option', 'active', tabIndex)
}

const show = () => tabContainer.show()
const hide = () => tabContainer.hide()
const clearFeatureInfo = () => featureInfoTab.clear()
const addFile = (event) => downloadTab.addFile(event)
const removeFile = (event) => downloadTab.removeFile(event)
const selectDownloadTab = () => selectTab(0)
const selectInfoTab = () => selectTab(1)

export default {
  show,
  hide,
  clearFeatureInfo,
  addFile,
  removeFile,
  selectDownloadTab,
  selectInfoTab,
  setInfoContent,
  selectTabAfterDatasetChange,
}
