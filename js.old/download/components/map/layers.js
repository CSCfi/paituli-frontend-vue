import $ from 'jquery'
import * as source from 'ol/source'
import * as layer from 'ol/layer'
import TileLayer from 'ol/layer/WebGLTile.js';
import * as ol_format from 'ol/format'
import * as style from 'ol/style'

import datasets from '../../datasets'
import { URL } from '../../../shared/urls'
import { translate } from '../../../shared/translations'

let dataLayer = null
let indexLayer = null

function init() {
  loadIndexLayer()
  loadDataLayer()
}

function loadDataLayer() {
  if (datasets.hasCurrent() && datasets.getCurrent().data_url != null) {
    const dataUrl = datasets.getCurrent().data_url
    dataLayer = new TileLayer({
      title: translate('map.datamap'),
      source: new source.TileWMS({
        url: URL.WMS_PAITULI_BASE_GWC,
        params: { 
			LAYERS: dataUrl, 
			VERSION: '1.1.1' 
		}, //
        //hidpi: false,
        serverType: 'geoserver',
      }),
      visible: true,
    })
	// Set max scale for those layers, that have limit
	if ( datasets.getCurrent().data_max_scale  != null ){
		dataLayer.setMaxResolution( datasets.getCurrent().data_max_scale / 2835 )
	}	
  } else {
    dataLayer = null
  }
}

let indexStyleFunction = function (feature) {
  return new style.Style({
    stroke: new style.Stroke({
      color: 'rgba(0, 0, 255, 1.0)',
      width: 2,
    }),
    fill: new style.Fill({
      color: 'rgba(0, 0, 255, 0)',
    }),
    text: new style.Text({
      text: feature.get('label'),
      stroke: new style.Stroke({ width: 0.6 }),
    }),
  })
}

function loadIndexLayer() {
  if (datasets.hasCurrent()) {
    const url = URL.WFS_INDEX_MAP_LAYER.replace('!key!', 'data_id').replace(
      '!value!',
      datasets.getCurrent().data_id
    )
    const indexSource = new source.Vector({
      format: new ol_format.GeoJSON(),
      loader: () => {
        $.ajax({
          jsonpCallback: 'loadIndexMapFeatures',
          dataType: 'jsonp',
          url:
            url +
            '&outputFormat=text/javascript&format_options=callback:loadIndexMapFeatures',
          success: (response) => {
            const features = indexSource.getFormat().readFeatures(response)
            indexSource.addFeatures(features)
          },
        })
      },
    })
    indexLayer = new layer.Vector({
      title: translate('map.indexmap'),
      source: indexSource,
      visible: true,
      style: indexStyleFunction,
    })
  } else {
    indexLayer = null
  }
}

const getDataLayer = () => dataLayer
const getIndexLayer = () => indexLayer

export default {
  init,
  getDataLayer,
  getIndexLayer,
  indexStyleFunction,
}
