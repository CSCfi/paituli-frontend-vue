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
import '../../css/metadata.css'

const filterControlPlaceholder = translate('metadataTable.filter')

$('#table')
  .bootstrapTable({
    url: `${URL.METADATA_API}/${getCurrentLocale()}`,
    locale: 'en-US',
    showMultiSort: true,
    showMultiSortButton: false,
    filterControl: true,
    sortPriority: [
      {
        sortName: 'org',
        sortOrder: 'asc',
      },
      {
        sortName: 'name',
        sortOrder: 'asc',
      },
      {
        sortName: 'year',
        sortOrder: 'asc',
      }
    ],
    columns: [
      {
        field: 'org',
        title: translate('metadataTable.producer'),
        sortable: true,
        filterControl: 'input',
        filterControlPlaceholder: filterControlPlaceholder,
      },
      {
        field: 'name',
        title: translate('metadataTable.name'),
        sortable: true,
        filterControl: 'input',
        filterControlPlaceholder: filterControlPlaceholder,
      },
      {
        field: 'scale',
        title: translate('metadataTable.scale'),
        sortable: true,
        filterControl: 'input',
        filterControlPlaceholder: filterControlPlaceholder,
      },
      {
        field: 'year',
        title: translate('metadataTable.year'),
        sortable: true,
        filterControl: 'input',
        filterControlPlaceholder: filterControlPlaceholder,
      },
      {
        field: 'format',
        title: translate('metadataTable.format'),
        sortable: true,
        filterControl: 'input',
        filterControlPlaceholder: filterControlPlaceholder,
      },
      {
        field: 'coord_sys',
        title: translate('metadataTable.coordSys'),
        sortable: true,
        filterControl: 'input',
        filterControlPlaceholder: filterControlPlaceholder,
      },
      {
        field: 'access',
        title: translate('metadataTable.download'),
        sortable: true,
        filterControl: 'input',
        filterControlPlaceholder: filterControlPlaceholder,
        formatter: (value, row) => {
          return value === 1
            ? '<a href="/download.html?data_id=' +
                row.data_id +
                '">' +
                translate('metadataTable.access') +
                '</a>'
            : '<a href="/download.html?data_id="' + row.data_id + '">HAKA</a>'
        },
      },
      {
        field: 'meta',
        title: translate('metadataTable.description'),
        sortable: true,
        filterControl: 'input',
        filterControlPlaceholder: filterControlPlaceholder,
        formatter: (value) =>
          value != null
            ? '<a href="http://urn.fi/' +
              value +
              ' " target="_blank">' +
              translate('metadataTable.description') +
              '</a>'
            : '-',
      },
    ],
  })
  .on('load-success.bs.table', function () {
    $('.table').show()
  })

$(function () {
  $('#header').load('header.html')
  $('.content-placeholder').load(translate('metadata.contentFile'))
  $('#footer').load('footer.html', function () {
    $('.body_container').show()
    toggleTabActivation('#metadata-link')
  })
})
