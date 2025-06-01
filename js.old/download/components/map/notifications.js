import $ from 'jquery'

import { translate } from '../../../shared/translations'
import map from './map'
import layers from './layers'

function setDataAvailabilityWarning() {
  $('#notification-container').text(translate('map.dataAvailabilityWarning'))
  $('#notification-container').show()
}

function setNotifications() {
  if (map.getMaxResolution() !== null) {
    if (map.getView().getResolution() > map.getMaxResolution()) {
      createMaxResolutionWarning()
    } else if (layers.getDataLayer() == null) {
      setDataAvailabilityWarning()
    } else {
      clearWarning()
    }
  }
}

function createMaxResolutionWarning() {
  $('#notification-container').text(translate('map.resolutionwarning'))
  $('#notification-container').show()
}

function clearWarning() {
  $('#notification-container').empty()
  $('#notification-container').hide()
}

export default {
  setNotifications,
}
