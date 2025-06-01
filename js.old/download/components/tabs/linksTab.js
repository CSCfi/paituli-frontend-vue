import $ from 'jquery'

import datasets from '../../datasets'
import { translate } from '../../../shared/translations'
import { URL } from '../../../shared/urls'

const TAB_ID = 'links-container'
const rootElem = $('#' + TAB_ID)

function init() {
  rootElem.empty()
  const infoText = createParagraph('#links-info', translate('info.linksIntro'))
  infoText.appendTo(rootElem)

  const datasetPath = datasets.getCurrent().funet
  const rsyncPath =
    'rsync://rsync.nic.funet.fi/ftp/index/geodata/' + datasetPath

  const linksContainer = $('<div>', {
    id: 'links-container',
  })

  const ftpPath = URL.FTP_LINKS_BASE + datasetPath
  const httpPath = URL.HTTP_LINKS_BASE + datasetPath

  addLink('http', httpPath, linksContainer)
  linksContainer.append('<strong>ftp: </strong>' + ftpPath + '<br>')
  linksContainer.append('<strong>rsync: </strong>' + rsyncPath)
  linksContainer.appendTo(rootElem)

  const url = URL.WFS_INDEX_MAP_DOWNLOAD_SHAPE.replace(
    '!key!',
    'data_id'
  ).replace('!value!', datasets.getCurrent().data_id)

  let index_anchor = $('#index-anchor')
  if (!index_anchor.length) {
    index_anchor = $('<a>', {
      id: 'index-anchor',
      href: url,
      target: '_blank',
    })
  }
  index_anchor.text(translate('info.downloadindex') + ' ')

  $('<br>').appendTo(rootElem)
  rootElem.append(index_anchor)
  rootElem.append(translate('info.dlIndexMapInfo') + ' ')
  rootElem.append(
    translate('info.linksInfo').replace('!infolink!', URL.INFO_LINK)
  )
}

function createParagraph(id, text) {
  let p = $(id)
  if (!p.length) {
    p = $('<p>', {
      id: id,
    })
  }
  p.text(text)
  return p
}

function addLink(linkName, hrefValue, container) {
  let anchor = $('#' + linkName + '-anchor')
  if (!anchor.length) {
    anchor = $('<a>', {
      id: 'dataset-link-anchor',
      href: hrefValue,
      target: '_blank',
    })
  }
  container.append('<strong>' + linkName + ': </strong>')
  anchor.text(hrefValue)
  anchor.appendTo(container)
  container.append('<br>')
}

export default {
  TAB_ID,
  init,
}
