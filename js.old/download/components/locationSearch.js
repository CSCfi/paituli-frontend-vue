import $ from 'jquery'
import * as proj from 'ol/proj'

import map from './map'
import { translate } from '../../shared/translations'
import { URL } from '../../shared/urls'

const searchInput = $('#location-search-input')
searchInput.attr('placeholder', translate('map.locationsearch'))

function search(searchStr) {
  $.getJSON(URL.NOMINATIM_API.replace('!query!', searchStr), (data) => {
    if (data.length > 0) {
      const center = proj.transform(
        [Number(data[0].lon), Number(data[0].lat)],
        'EPSG:4326',
        'EPSG:3857'
      )
      const zoom = searchStr.includes(',') ? 16 : 13
      map.getView().setCenter(center)
      map.getView().setZoom(zoom)
    } else {
      alert(translate('map.locationNotFound'))
    }
  })
}

function init() {
  searchInput.keypress((event) => {
    const keyCode = event.keyCode || event.charCode
    if (keyCode == 13) {
      const searchStr = searchInput.val()
      if (searchStr.length > 0) {
        search(searchStr)
      }
    }
  })
}

const clear = () => searchInput.val('')

export default {
  init,
  clear,
}
