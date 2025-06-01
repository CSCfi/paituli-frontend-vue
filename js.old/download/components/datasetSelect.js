import $ from 'jquery'

import auth from '../../shared/auth'
import datasets from '../datasets'
import { translate } from '../../shared/translations'
import map from './map'

const rootElem = $('#form-input-container')
const producerInput = initInput(rootElem, 'producer', 'data.producer')
const dataInput = initInput(rootElem, 'data', 'data.data')
const scaleInput = initInput(rootElem, 'scale', 'data.scale')
const yearInput = initInput(rootElem, 'year', 'data.year')
const formatInput = initInput(rootElem, 'format', 'data.format')
const coordsysInput = initInput(rootElem, 'coordsys', 'data.coordSys')

function init(datasetId) {
  producerInput.on('change', producerSelected)
  dataInput.on('change', datasetSelected)
  scaleInput.on('change', scaleSelected)
  yearInput.on('change', yearSelected)
  formatInput.on('change', formatSelected)
  coordsysInput.on('change', () => coordsysSelected())

  filterProducers()
  if (datasetId !== null) {
    selectDataset(datasetId)
  }
}

function initInput(rootElem, name, translationPath) {
  const row = $('<article>', {
    class: 'form-input-row',
    id: name + '-row',
  })
  const label = $('<div>', {
    class: 'form-input-label',
    id: name + '-label',
  })
  const input = $('<select>', {
    class: 'form-input',
    id: name + '-input',
  })
  label.append(translate(translationPath))
  label.appendTo(row)
  input.appendTo(row)
  row.appendTo(rootElem)
  return input
}

function selectDataset(datasetId) {
  const selectedData = datasets.getById(datasetId)
  if (typeof selectedData !== 'undefined') {
    producerInput.val(selectedData.org)
    producerInput.trigger('change')
    dataInput.val(selectedData.name)
    dataInput.trigger('change')
    scaleInput.val(selectedData.scale)
    scaleInput.trigger('change')
    yearInput.val(selectedData.year)
    yearInput.trigger('change')
    formatInput.val(selectedData.format)
    formatInput.trigger('change')
    coordsysInput.val(selectedData.coord_sys)
    coordsysInput.trigger('change')
  }
}

const onlyDistinct = (value, index, self) => self.indexOf(value) === index
const onlyAuthorized = (data) => auth.loggedIn() || data.access === 1

function filterProducers() {
  const producers = datasets
    .getAll()
    .filter(onlyAuthorized)
    .map((data) => data.org)
    .filter(onlyDistinct)
  updateOptions(producerInput, sortDropdownData('ascending', producers), true)
}

function producerSelected() {
  if (!producerInput.val().startsWith('--')) {
    const names = datasets
      .getAll()
      .filter((data) => data.org === producerInput.val())
      .filter(onlyAuthorized)
      .map((data) => data.name)
      .filter(onlyDistinct)
    updateOptions(dataInput, sortDropdownData('ascending', names), false)
  } else {
    addEmptyOption(dataInput)
  }
}

function datasetSelected() {
  if (!dataInput.val().startsWith('--')) {
    const scales = datasets
      .getAll()
      .filter((data) => data.org === producerInput.val())
      .filter((data) => data.name === dataInput.val())
      .map((data) => data.scale)
      .filter(onlyDistinct)
    updateOptions(scaleInput, sortDropdownData('shortest', scales), false)
  } else {
    addEmptyOption(scaleInput)
  }
}

function scaleSelected() {
  if (!scaleInput.val().startsWith('--')) {
    const years = datasets
      .getAll()
      .filter((data) => data.org === producerInput.val())
      .filter((data) => data.name === dataInput.val())
      .filter((data) => data.scale === scaleInput.val())
      .map((data) => data.year)
      .filter(onlyDistinct)
    updateOptions(yearInput, sortDropdownData('newest', years), false)
  } else {
    addEmptyOption(yearInput)
  }
}

function yearSelected() {
  if (!yearInput.val().startsWith('--')) {
    const formats = datasets
      .getAll()
      .filter((data) => data.org === producerInput.val())
      .filter((data) => data.name === dataInput.val())
      .filter((data) => data.scale === scaleInput.val())
      .filter((data) => data.year === yearInput.val())
      .map((data) => data.format)
      .filter(onlyDistinct)
    updateOptions(formatInput, sortDropdownData('ascending', formats), false)
  } else {
    addEmptyOption(formatInput)
  }
}

function formatSelected() {
  if (!formatInput.val().startsWith('--')) {
    const coordsyses = datasets
      .getAll()
      .filter((data) => data.org === producerInput.val())
      .filter((data) => data.name === dataInput.val())
      .filter((data) => data.scale === scaleInput.val())
      .filter((data) => data.year === yearInput.val())
      .filter((data) => data.format === formatInput.val())
      .map((data) => data.coord_sys)
      .filter(onlyDistinct)
    updateOptions(
      coordsysInput,
      sortDropdownData('ascending', coordsyses),
      false
    )
  } else {
    addEmptyOption(coordsysInput)
  }
}

function coordsysSelected() {
  const selectedData = datasets
    .getAll()
    .find(
      (data) =>
        data.org === producerInput.val() &&
        data.name === dataInput.val() &&
        data.scale === scaleInput.val() &&
        data.year === yearInput.val() &&
        data.format === formatInput.val() &&
        data.coord_sys === coordsysInput.val()
    )
  if (typeof selectedData !== 'undefined') {
    datasets.setCurrent(selectedData.data_id)
  } else {
    datasets.clearCurrent()
  }
  map.update()
}

function addEmptyOption(inputElem) {
  inputElem.empty()
  const title = '--'
  const optionElem = $('<option>', {
    value: title,
  })
  optionElem.text(title)
  inputElem.append(optionElem)
  inputElem.prop('disabled', true)
  inputElem.val($('#' + inputElem.attr('id') + ' option:first').val()).change()
}

function updateOptions(inputElem, optionNames, isProducerInput, optionIds) {
  if (optionIds === undefined) {
    optionIds = null
  }
  inputElem.empty()
  inputElem.prop('disabled', false)
  if (isProducerInput) {
    let title = translate('data.selectProducer')
    const optionElem = $('<option>', {
      value: title,
    })
    optionElem.text(title)
    inputElem.append(optionElem)
  }
  optionNames.forEach((value, idx) => {
    const optionElem = $('<option>', {
      value: value,
    })
    optionElem.text(value)
    if (optionIds !== null) {
      optionElem.attr('id', optionIds[idx])
    }
    inputElem.append(optionElem)
  })

  if (inputElem.find('option').length <= 1) {
    inputElem.prop('disabled', true)
  }
  inputElem.val($('#' + inputElem.attr('id') + ' option:first').val()).change()
}

function sortDropdownData(type, data) {
  switch (type) {
    case 'ascending':
      data.sort()
      break
    case 'newest': // Used for dates
      data.sort((a, b) => {
        const c = fixDropDownItemForOrdering(a)
        const d = fixDropDownItemForOrdering(b)
        return d - c
      })
      break
    case 'shortest':
      // Used for scales
      // The scales are basicallly ordered in numeric order from smaller
      // to bigger.

      data.sort((a, b) => {
        const c = fixDropDownItemForOrdering(a)
        const d = fixDropDownItemForOrdering(b)
        return c - d
      })
      break
    default:
      return null
  }
  return data
}

function fixDropDownItemForOrdering(label) {
  let d
  // Split is for cases like: 1:10 000, 25mx25m, "1:20 000, 1:50 000",
  // 2015-2017.
  // Count only with the last number.
  if (label.search(/[?,:.xX-]+/) != -1) {
    let parts = label.split(/[?,:.xX-]+/g)
    d = parts[parts.length - 1]
  } else {
    d = label
  }
  // Remove anything non-numeric
  d = d.replace(/\D/g, '')
  return d
}

export default {
  init,
}
