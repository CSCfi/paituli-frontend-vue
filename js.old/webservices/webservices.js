import $ from 'jquery'

import 'bootstrap-table/dist/bootstrap-table'
import 'bootstrap-table/dist/bootstrap-table-locale-all'
import 'bootstrap-table/dist/extensions/multiple-sort/bootstrap-table-multiple-sort'
import 'bootstrap-table/dist/extensions/filter-control/bootstrap-table-filter-control'

import { translate } from '../shared/translations'
import { URL } from '../shared/urls'
import { getCurrentLocale } from '../shared/translations'
import { toggleTabActivation } from '../shared/header'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-table/dist/bootstrap-table.min.css'

import '../../css/webservices.css'

const filterControlPlaceholder = translate('metadataTable.filter')

$('#table')
  .bootstrapTable({
    url: `${URL.METADATA_API}/${getCurrentLocale()}`,
    responseHandler: (res) => {
      return res.filter((data) => data.data_url != null)
    },
    locale: 'en-US',
    filterControl: true,
    showMultiSort: true,
    sortPriority: [
      {
        sortName: 'data_url',
        sortOrder: 'asc',
      },
    ],
    columns: [
      {
        field: 'data_url',
        title: translate('webservicesTable.dataUrl'),
        sortable: true,
        filterControl: 'input',
        filterControlPlaceholder: filterControlPlaceholder,
      },
      {
        field: 'name',
        title: translate('webservicesTable.layerName'),
        sortable: true,
        filterControl: 'input',
        filterControlPlaceholder: filterControlPlaceholder,
        formatter: (value, row) =>
          value != null
            ? row.org_abbreviation +
              ', ' +
              row.name +
              ', ' +
              row.scale +
              ', ' +
              row.year
            : '-',
      },
      {
        field: 'data_max_scale',
        title: translate('webservicesTable.scaleLimit'),
        sortable: true,
        filterControl: 'input',
        filterControlPlaceholder: filterControlPlaceholder,
      },
    ],
  })
  .on('load-success.bs.table', function () {
    $('.table').show()
  })

$(function () {
  $('#header').load('header.html')
  $('.content-article').load(translate('webservices.contentFile'))
  $('#footer').load('footer.html', function () {
    $('.body_container').show()
    toggleTabActivation('#webservices-link')
  })
})
