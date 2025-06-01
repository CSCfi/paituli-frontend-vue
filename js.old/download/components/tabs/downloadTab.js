import $ from 'jquery'

import datasets from '../../datasets'
import emailModal from '../emailModal'
import map from '../map'
import { translate } from '../../../shared/translations'

const MAX_DOWNLOADABLE_SIZE = 3000
const TAB_ID = 'download-container'
const rootElem = $('#' + TAB_ID)

// files selected for download
let filePaths = []
let fileLabels = []

function init() {
  let dlButtonWrapper = $('#dl-button-wrapper')
  if (!dlButtonWrapper.length) {
    dlButtonWrapper = $('<a>', { id: 'dl-button-wrapper' })
  }
  let dlButton = $('#download-button')
  if (!dlButton.length) {
    dlButton = $('<button>', {
      class: 'btn btn-light',
      id: 'download-button',
    })
  }
  dlButton.text(translate('info.download') + ': ~' + getDownloadSize() + ' Mb')
  dlButton.appendTo(dlButtonWrapper)

  let dlListWrapper = $('#dl-list-wrapper')
  if (!dlListWrapper.length) {
    dlListWrapper = $('<a>', {
      id: 'dl-list-wrapper',
    })
  }

  let dlListButton = $('#download-list-button')
  if (!dlListButton.length) {
    dlListButton = $('<button>', {
      class: 'btn btn-light',
      id: 'download-list-button',
    })
  }

  dlListButton.text(translate('info.downloadlist'))
  dlListButton.appendTo(dlListWrapper)
  // dlListWrapper.attr('data-toggle', 'buttonTooltip')
  dlListWrapper.attr({ title: translate('info.dlListTooltip') })
  dlListWrapper.tooltip({})

  // Hide files list download option, if HAKA-dataset, these are not in FTP.
  const dataAccess = datasets.getCurrent().access
  if (dataAccess == 1) {
    dlListButton.css('visibility', 'visible')
  } else {
    dlListButton.css('visibility', 'hidden')
  }

  let licenseHeader = $('#download-license-header')
  if (!licenseHeader.length) {
    licenseHeader = $('<h5>', {
      id: 'download-license-header',
      class: 'tab-content-header ',
    })
  }
  licenseHeader.text(translate('info.documents'))

  //http://www.nic.funet.fi/index/geodata/mml/NLS_terms_of_use.pdf -> crop after geodata/
  let licenseUrl = datasets.getCurrent().license_url
  let dlLicInputId = 'download-license-input'
  let dlLicContainer = $('#download-license-container')
  let dlLicInput = $('#' + dlLicInputId)
  let dlLicLabelLink = $('#download-license-link')

  dlLicContainer = $('<div>', {
    id: 'download-license-container',
  })
  dlLicLabelLink = $('<a>', {
    id: 'download-license-link',
    href: licenseUrl,
    target: '_blank',
    class: 'download-license-link',
    'data-value': translate('info.license'),
  })
  dlLicLabelLink.text(translate('info.license'))
  dlLicInput = $('<input>', {
    checked: 'checked',
    id: dlLicInputId,
    type: 'checkbox',
    value: cutLicenseURL(licenseUrl),
    class: 'download-checkbox',
  })
  dlLicInput.appendTo(dlLicContainer)
  dlLicLabelLink.appendTo(dlLicContainer)

  const downloadFilesHeader = $('<h5>', {
    id: 'download-file-header',
    class: 'tab-content-header ',
  })
  downloadFilesHeader.text(translate('info.files'))

  const selectedFeatures = map.getSelectedFeatures()
  if (selectedFeatures.getLength() > 0) {
    let dataListContainerElem = $('#data-download-list')
    if (!dataListContainerElem.length) {
      rootElem.empty()
      dlButtonWrapper.appendTo(rootElem)
      dlListWrapper.appendTo(rootElem)
      licenseHeader.appendTo(rootElem)

      dlLicContainer.appendTo(rootElem)

      downloadFilesHeader.appendTo(rootElem)
    }

    if (!dataListContainerElem.length) {
      dataListContainerElem = $('<div>', {
        id: 'data-download-list',
      })
    } else {
      dataListContainerElem.empty()
    }

    let i = 0
    fileLabels = []
    const dlLabelList = []

    selectedFeatures.forEach((feature) => {
      const label = feature.get('label')
      fileLabels.push(label)
      const filePath = feature.get('path')
      i += 1
      const inputId = 'download-file-input-' + i.toString()
      const dlLabel = $('<label>', {
        for: inputId,
        class: 'download-label',
        'data-value': label,
        ol_id: feature.getId(),
      })
      const dlInput = $('<input>', {
        checked: 'checked',
        id: inputId,
        type: 'checkbox',
        value: filePath,
        class: 'download-checkbox',
        ol_id: feature.getId(),
      })

      dlInput.on('change', () => {
        updateSelectedFeatures(feature, dlInput)
        updateDownloadFileList(
          dlButton,
          dlButtonWrapper,
          dlListButton,
          dlLicInput
        )
      })

      dlLabel.on('mouseenter', function (e) {
        map.addHighlight(e)
      })

      dlLabel.on('mouseleave', function (e) {
        map.removeHighlight(e)
      })

      dlLabel.append(dlInput)
      dlLabel.append(label)
      dlLabelList.push(dlLabel)
    })
    dlLabelList.sort((a, b) => {
      if (a.attr('data-value') >= b.attr('data-value')) {
        return 1
      } else {
        return -1
      }
    })
    dlLabelList.forEach((val) => val.appendTo(dataListContainerElem))
    if (i > 0) {
      dataListContainerElem.appendTo(rootElem)
    }
  } else {
    rootElem.empty()
    dlButtonWrapper.appendTo(rootElem)
    dlListWrapper.appendTo(rootElem)
    licenseHeader.appendTo(rootElem)
    dlLicContainer.appendTo(rootElem)
    downloadFilesHeader.appendTo(rootElem)
    const downloadInfo = $('<div>', {
      id: 'download-info-container',
    })
    downloadInfo.text(translate('info.info'))
    downloadInfo.appendTo(rootElem)
  }
  dlLicInput.on('change', () => {
    updateDownloadFileList(dlButton, dlButtonWrapper, dlListButton, dlLicInput)
    updateFileLabelListForLicense(dlLicInput, licenseUrl)
  })
  dlButton.on('click', (event) => {
    event.preventDefault()
    event.stopImmediatePropagation()
    if (
      dlLicInput.prop('checked') ? filePaths.length > 1 : filePaths.length > 0
    ) {
      emailModal.openDataModal(filePaths, fileLabels, getDownloadSize())
    }
  })
  dlListButton.on('click', (event) => {
    event.preventDefault()
    event.stopImmediatePropagation()
    if (
      dlLicInput.prop('checked') ? filePaths.length > 1 : filePaths.length > 0
    ) {
      emailModal.openListModal(filePaths, fileLabels, getDownloadSize())
    }
  })
  updateDownloadFileList(dlButton, dlButtonWrapper, dlListButton, dlLicInput)
  updateFileLabelListForLicense(dlLicInput, licenseUrl)
}

function getDownloadSize() {
  const fileSize = datasets.getCurrent().file_size
  return fileSize !== null
    ? Math.ceil(fileSize * map.getSelectedFeatures().getLength())
    : 0
}

function updateSelectedFeatures(clickedFeature, dlInput) {
  if (dlInput.is(':checked')) {
    map.getSelectedFeatures().push(clickedFeature)
  } else {
    map.getSelectedFeatures().remove(clickedFeature)
  }
}

function updateFileLabelListForLicense(dlLicInput, licenseUrl) {
  const licenseIdx = fileLabels.indexOf(licenseUrl)
  if (dlLicInput.prop('checked')) {
    if (licenseIdx == -1) {
      fileLabels.push(licenseUrl)
    }
  } else {
    if (licenseIdx > -1) {
      fileLabels.splice(licenseIdx, 1)
    }
  }
}

function updateDownloadFileList(
  dlButton,
  dlButtonWrapper,
  dlListButton,
  dlLicInput
) {
  filePaths = []
  const markedForDownload = $('.download-checkbox:checked')
  markedForDownload.each((i, checkbox) => filePaths.push(checkbox.value))

  updateDownloadButton(dlButton, dlButtonWrapper, dlLicInput)
  updateDownloadListButton(dlListButton, dlLicInput)
}

function updateDownloadButton(dlButton, dlButtonWrapper, dlLicInput) {
  dlButton.text(translate('info.download') + ': ~' + getDownloadSize() + ' Mb')
  if (
    (dlLicInput.prop('checked')
      ? filePaths.length > 1
      : filePaths.length > 0) &&
    getDownloadSize() <= MAX_DOWNLOADABLE_SIZE
  ) {
    dlButton.prop('disabled', false)
    dlButtonWrapper.removeAttr('title')
  } else {
    if (getDownloadSize() > MAX_DOWNLOADABLE_SIZE) {
      dlButtonWrapper.attr('title', translate('info.downloadTooltip'))
    }
    dlButton.prop('disabled', true)
  }
}

function updateDownloadListButton(dlListButton, dlLicInput) {
  if (
    dlLicInput.prop('checked') ? filePaths.length > 1 : filePaths.length > 0
  ) {
    dlListButton.prop('disabled', false)
  } else {
    dlListButton.prop('disabled', true)
  }
}

function addFile(event) {
  fileLabels.push(event.element.get('label'))
}

function removeFile(event) {
  const deleteIdx = fileLabels.indexOf(event.element.get('label'))
  if (deleteIdx > -1) {
    fileLabels.splice(deleteIdx, 1)
  }
}

function cutLicenseURL(urn) {
  if (urn != null) {
    const arr = urn.split('geodata/')
    urn = arr[1]
  }
  return urn
}

export default {
  TAB_ID,
  init,
  addFile,
  removeFile,
}
