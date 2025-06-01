import $ from 'jquery'

import controls from './controls'
import datasets from '../../datasets'
import featureSearch from '../featureSearch'
import highlightOverlay from './highlightOverlay'
import locationSearch from '../locationSearch'
import map from './map'
import tabs from '../tabs'
import layers from './layers'
import notifications from './notifications'

let numberOfMapSheets = 0

function update() {
  map.removeLayer(layers.getIndexLayer())
  map.removeLayer(layers.getDataLayer())
  locationSearch.clear()
  controls.clearFeatureSelection()
  tabs.clearFeatureInfo()
  featureSearch.clearResults()
  $('#feature-search-field').value = ''

  if (datasets.hasCurrent()) {
    tabs.setInfoContent('metadata')

    layers.init()
    const indexLayer = layers.getIndexLayer()
    const dataLayer = layers.getDataLayer()
    if (indexLayer !== null) {
      indexLayer.getSource().once('change', (event) => {
        let hasInfoTab = false
        if (event.target.getState() == 'ready') {
          hasInfoTab = datasets.hasFeatureInfo()
          numberOfMapSheets = datasets.getCurrent().map_sheets
          if (numberOfMapSheets > 1) {
            featureSearch.show()
          } else if (numberOfMapSheets === 1) {
            // if there is only one mapsheet, select all files
            controls
              .getSelectedFeatures()
              .extend(indexLayer.getSource().getFeatures())
            featureSearch.hide()
          }
          tabs.setInfoContent('download')
          controls.toggleVisibility(numberOfMapSheets)
        }
        tabs.selectTabAfterDatasetChange(hasInfoTab)
      })

      const maxScale = datasets.getCurrent().data_max_scale
      const maxResolution = maxScale !== null ? parseInt(maxScale) / 2835 : null
      map.setMaxResolution(maxResolution)

      if (dataLayer !== null) {
        map.insertDataLayer(dataLayer)
      }

      notifications.setNotifications()

      map.addLayer(indexLayer)
    }
    tabs.show()
  } else {
    numberOfMapSheets = 0
    tabs.hide()
  }
}

const getDataLayer = () => layers.getDataLayer()
const getIndexLayer = () => layers.getIndexLayer()
const getSelectedFeatures = () => controls.getSelectedFeatures()
const setSelectedFeatures = (value) => controls.setSelectedFeatures(value)
const clearFeatureSelection = () => controls.clearFeatureSelection()
const addHighlight = (event) => highlightOverlay.addHighlight(event)
const removeHighlight = (event) => highlightOverlay.removeHighlight(event)
const resetView = () => map.resetView()
const getView = () => map.getView()

export default {
  update,
  getDataLayer,
  getIndexLayer,
  getSelectedFeatures,
  setSelectedFeatures,
  clearFeatureSelection,
  addHighlight,
  removeHighlight,
  getView,
  resetView,
}
