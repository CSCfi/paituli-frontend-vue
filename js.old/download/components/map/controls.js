import $ from 'jquery'
import * as interaction from 'ol/interaction'
import * as condition from 'ol/events/condition'
import * as source from 'ol/source'
import * as layer from 'ol/layer'
import * as style from 'ol/style'

import tabs from '../tabs'
import map from './map'
import layers from './layers'
import datasets from '../../datasets'

let selectedTool = ''
let selectedFeatures = {}

const panSelectBtn = $('#panselection-button')
const selectSelectContainer = $('#selectselection-container')
const clearSelectContainer = $('#clearselection-container')
const infoSelectContainer = $('#infoselection-container')
const infoSelectBtn = $('#infoselection-button')
const drawSelectContainer = $('#drawselection-container')
selectSelectContainer.hide()
clearSelectContainer.hide()
infoSelectContainer.hide()
drawSelectContainer.hide()

function toggleVisibility(numberOfMapSheets) {
  // If more than 1 mapsheet, show mapsheet selection tools
  if (numberOfMapSheets > 1) {
    selectSelectContainer.show()
    clearSelectContainer.show()
    drawSelectContainer.show()
  } else {
    selectSelectContainer.hide()
    clearSelectContainer.hide()
    drawSelectContainer.hide()
  }
  // If layers has feature info, show info tool and container for results
  if (datasets.hasFeatureInfo()) {
    infoSelectContainer.show()
    $('#feature-info-container-tab').show()
  } else {
    if (infoSelectBtn.hasClass('active')) {
      panSelectBtn.click()
    }
    infoSelectContainer.hide()
    $('#feature-info-container-tab').hide()
  }
}

const getSelectedStyleFunction = function (feature) {
  return [
    new style.Style({
      stroke: new style.Stroke({
        color: 'rgba(102, 178, 255, 1.0)',
        width: 3,
      }),
      fill: new style.Fill({
        color: [255, 255, 255, 0.4],
      }),
      text: new style.Text({
        text: feature.get('label'),
        stroke: new style.Stroke({ width: 0.6 }),
      }),
      zIndex: 50,
    }),
  ]
}

// a normal select interaction to handle click
const featureSelectInteraction = new interaction.Select({
  toggleCondition: condition.always,
  style: getSelectedStyleFunction,
  multi: true, //Select several, if overlapping
})

featureSelectInteraction.on('select', () => tabs.setInfoContent('download'))
map.addInteraction(featureSelectInteraction)

selectedFeatures = featureSelectInteraction.getFeatures()
selectedFeatures.on('add', tabs.addFile)
selectedFeatures.on('remove', tabs.removeFile)

// a DragBox interaction used to select features by drawing boxes
const mapDragBox = new interaction.DragBox({})
mapDragBox.on('boxend', () => {
  const extent = mapDragBox.getGeometry().getExtent()

  // Check which mapsheets were selected before and which are new
  const newFeatures = []
  const oldFeaturesInSelection = []
  let existing

  layers
    .getIndexLayer()
    .getSource()
    .forEachFeatureIntersectingExtent(extent, (feature) => {
      existing = selectedFeatures.remove(feature)
      if (existing) {
        oldFeaturesInSelection.push(feature)
      } else {
        newFeatures.push(feature)
      }
    })
  if (newFeatures.length > 0) {
    selectedFeatures.extend(oldFeaturesInSelection)
    selectedFeatures.extend(newFeatures)
  }
  tabs.setInfoContent('download')
})
map.addInteraction(mapDragBox)

/* Add drawing vector source */
const drawingSource = new source.Vector({
  useSpatialIndex: false,
})

/* Add drawing layer */
const drawingLayer = new layer.Vector({
  source: drawingSource,
})
map.addLayer(drawingLayer)

/*
 * Declare interactions and listener globally so we can attach listeners to
 * them later.
 */
let draw

// Drawing interaction
draw = new interaction.Draw({
  source: drawingSource,
  type: 'Polygon',
  style: null,
})
map.addInteraction(draw)

function updateDrawSelection(event) {
  const polygon = event.feature.getGeometry()
  const features = layers.getIndexLayer().getSource().getFeatures()

  const newFeatures = []
  const oldFeaturesInSelection = []
  let existing

  for (let i = 0; i < features.length; i++) {
    if (polygon.intersectsExtent(features[i].getGeometry().getExtent())) {
      existing = selectedFeatures.remove(features[i])
      if (existing) {
        oldFeaturesInSelection.push(features[i])
      } else {
        newFeatures.push(features[i])
      }
    }
  }

  if (newFeatures.length > 0) {
    selectedFeatures.extend(oldFeaturesInSelection)
    selectedFeatures.extend(newFeatures)
  }
  tabs.setInfoContent('download')
  //Remove the drawed polygon from map. The drawend is fired before the polygon is added to the source,
  //so the first simply sets the geometry to null, and after next polygon is drawn it is properly removed.
  //Possibly there is one-liner for this.
  event.feature.setGeometry(null)
  drawingSource.clear()
}

draw.on('drawend', (event) => updateDrawSelection(event))

// Select right tool
// Set default
let dragPan
map.getInteractions().forEach((i) => {
  if (i instanceof interaction.DragPan) {
    dragPan = i
  }
}, this)

function clearFeatureSelection() {
  selectedFeatures.clear()
  tabs.setInfoContent('download')
  return false
}

function selectPanTool() {
  $('#panselection-button').addClass('active')
  $('#selectselection-button').removeClass('active')
  $('#infoselection-button').removeClass('active')
  $('#drawselection-button').removeClass('active')

  selectedTool = 'drag'
  dragPan.setActive(true)
  featureSelectInteraction.setActive(false)
  mapDragBox.setActive(false)
  draw.setActive(false)
  map.removeInfoToolListener()
}

function selectSelectTool() {
  tabs.selectDownloadTab()

  $('#panselection-button').removeClass('active')
  $('#selectselection-button').addClass('active')
  $('#infoselection-button').removeClass('active')
  $('#drawselection-button').removeClass('active')

  selectedTool = 'select'
  dragPan.setActive(false)
  featureSelectInteraction.setActive(true)
  mapDragBox.setActive(true)
  draw.setActive(false)
  map.removeInfoToolListener()
}

function selectInfoTool() {
  tabs.selectInfoTab()

  $('#panselection-button').removeClass('active')
  $('#selectselection-button').removeClass('active')
  $('#infoselection-button').addClass('active')
  $('#drawselection-button').removeClass('active')

  selectedTool = 'info'
  featureSelectInteraction.setActive(false)
  mapDragBox.setActive(false)
  draw.setActive(false)
  if (selectedTool != 'drag') {
    dragPan.setActive(true)
  }
  map.addInfoToolListener()
}

function selectDrawTool() {
  tabs.selectDownloadTab()

  $('#panselection-button').removeClass('active')
  $('#selectselection-button').removeClass('active')
  $('#infoselection-button').removeClass('active')
  $('#drawselection-button').addClass('active')

  selectedTool = 'draw'
  dragPan.setActive(true)
  featureSelectInteraction.setActive(false)
  mapDragBox.setActive(false)
  mapDragBox.setActive(false)
  draw.setActive(true)
  map.removeInfoToolListener()
}

$('#resetview-button').on('click', () => map.resetView())
$('#panselection-button').on('click', selectPanTool)
$('#selectselection-button').on('click', selectSelectTool)
$('#clearselection-button').on('click', () => clearFeatureSelection())
$('#infoselection-button').on('click', selectInfoTool)
$('#drawselection-button').on('click', selectDrawTool)

selectPanTool()

const getSelectedFeatures = () => selectedFeatures
const setSelectedFeatures = (value) => (selectedFeatures = value)

export default {
  getSelectedFeatures,
  setSelectedFeatures,
  clearFeatureSelection,
  toggleVisibility,
  getSelectedStyleFunction,
}
