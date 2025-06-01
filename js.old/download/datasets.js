import $ from 'jquery'

import { URL } from '../shared/urls'
import { getCurrentLocale } from '../shared/translations'

let datasets = []
let currentDataset = {}

// OLD
// function fetch() {
//   return $.getJSON(`${URL.METADATA_API}/${getCurrentLocale()}`, (response) => {
//     datasets = response
//   })
// }

const executeQuery = async () => {
  let response = await fetch(`${URL.METADATA_API}/${getCurrentLocale()}`)
  datasets = await response.json()
  return response
}

const getAll = () => datasets
const getById = (id) => datasets.find((dataset) => dataset.data_id === id)
const hasCurrent = () => !$.isEmptyObject(currentDataset)
const hasFeatureInfo = () => typeof currentDataset.data_url !== 'undefined'
const getCurrent = () => currentDataset
const setCurrent = (id) => (currentDataset = getById(id))
const clearCurrent = () => (currentDataset = {})

export default {
  executeQuery,
  getById,
  getAll,
  hasCurrent,
  hasFeatureInfo,
  getCurrent,
  setCurrent,
  clearCurrent,
}
