import $ from 'jquery'

import { translate } from '../../../shared/translations'
import map from '../map'

const TAB_ID = 'feature-info-container'
const rootElem = $('#' + TAB_ID)

function init(event) {
  rootElem.empty()
  const dataLayer = map.getDataLayer()
  if (dataLayer) {
    const resolution = map.getView().getResolution()
    const url = dataLayer
      .getSource()
      .getFeatureInfoUrl(event.coordinate, resolution, 'EPSG:3857', {
        INFO_FORMAT: 'text/plain',
      })
      .replace('/gwc/service', '')
    if (url) {
      const iframe =
        '<iframe id="feature-info-iframe" seamless src="' + url + '"></iframe>'
      rootElem.html(iframe)
    }
  }
}

function clear() {
  const label = $('<div>', {
    id: 'feature-info-default-label',
  })
  label.append(translate('info.featureinfodefault'))
  rootElem.empty()
  rootElem.append(label)
}

export default {
  TAB_ID,
  init,
  clear,
}
