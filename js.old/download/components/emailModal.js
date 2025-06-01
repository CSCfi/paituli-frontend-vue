import $ from 'jquery'
import 'jquery-ui/ui/widgets/dialog'
import 'jquery-ui/themes/base/dialog.css'
import datasets from '../datasets'
import { getCurrentLocale, translate } from '../../shared/translations'
import { DOWNLOAD_TYPE } from '../../shared/constants'
import { URL } from '../../shared/urls'

let filePaths = []
let fileLabels = []
let downloadType = ''

const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
const emailInput = $('#email-input')
const licenseCheckbox = $('#license-checkbox')
const privacyCheckbox = $('#privacy-checkbox')
const tips = $('#email-modal-tips')

const modal = $('#email-modal').dialog({
  autoOpen: false,
  height: 'auto',
  width: 600,
  modal: true,
  closeOnEscape: true,
  draggable: true,
  resizable: false,
  close: () => {
    emailForm[0].reset()
    emailInput.removeClass('ui-state-error')
    licenseCheckbox.removeClass('ui-state-error')
    privacyCheckbox.removeClass('ui-state-error')
    $('#download-button').trigger('focus')
  },
})

const emailForm = modal.find('form')
emailForm.on('submit', (event) => {
  event.preventDefault()
  sendEmail()
})

$('#email-input-label').text(translate('email.emailfield'))
$('#email-input').attr('placeholder', translate('email.emailfieldPlaceholder'))
$('#email-modal-form fieldset legend').text(translate('email.inputsheader'))
$('#email-instructions').text(translate('email.info'))
$('#privacy-checkbox-label').html(translate('email.privacylabel'))

function sendEmail() {
  const valid = validate()
  if (valid && filePaths.length > 0) {
    const current = datasets.getCurrent()
    const downloadRequest = {
      data_id: current.data_id,
      downloadType,
      email: emailInput.val(),
      locale: getCurrentLocale(),
      filePaths: filePaths,
      filenames: fileLabels,
      org: current.org,
      data: current.name,
      scale: current.scale,
      year: current.year,
      coord_sys: current.coord_sys,
      format: current.format,
    }
    modal.data('email', emailInput.val())
    $.post({
      url: URL.DOWNLOAD_API,
      data: JSON.stringify(downloadRequest),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: () => modal.dialog('close'),
    })
    return true
  } else {
    return false
  }
}

function validate() {
  emailInput.removeClass('ui-state-error')
  licenseCheckbox.removeClass('ui-state-error')
  privacyCheckbox.removeClass('ui-state-error')
  return checkLength() && checkRegexp() && checkLicenseIsChecked() && checkPrivacyIsChecked()
}

function checkLength() {
  const email = emailInput.val()
  if (!email || email.length > 80 || email.length < 1) {
    displayValidationError(emailInput, translate('email.errorEmailLength'))
    return false
  } else {
    return true
  }
}

function checkRegexp() {
  if (!emailRegexp.test(emailInput.val())) {
    displayValidationError(emailInput, translate('email.errorEmailFormat'))
    return false
  } else {
    return true
  }
}

function checkPrivacyIsChecked() {
  if (!privacyCheckbox.prop('checked')) {
    displayValidationError(
      privacyCheckbox,
      translate('email.errorPrivacyCheckboxChecked')
    )
    return false
  } else {
    return true
  }
}

function checkLicenseIsChecked() {
  if (!licenseCheckbox.prop('checked')) {
    displayValidationError(
      licenseCheckbox,
      translate('email.errorCheckboxChecked')
    )
    return false
  } else {
    return true
  }
}

function displayValidationError(input, errorMessage) {
  input.addClass('ui-state-error')
  tips.text(errorMessage).addClass('ui-state-highlight')
  setTimeout(() => tips.removeClass('ui-state-highlight', 1500), 500)
}

function initModal(downloadSize, header, buttons) {
  initDataDescription(downloadSize)

  $('#email-modal-tips').empty()
  const email = modal.data('email')
  $('#email-input').val(email === null ? '' : email)

  modal.dialog('option', 'title', header)
  modal.dialog('option', 'buttons', buttons)
}

function initDataDescription(downloadSize) {
  const currentDataset = datasets.getCurrent()
  const container = $('#data-description')
  container.empty()
  $('#license-checkbox-label').html(
    translate('email.licensefield').replace(
      '!license!',
      currentDataset.license_url
    )
  )
  const description = [
    currentDataset.org,
    currentDataset.name,
    currentDataset.scale,
    currentDataset.year,
    currentDataset.coord_sys,
    currentDataset.format,
  ].join(', ')
  const content = $('<div>')
  content.text(
    translate('email.datasetinfo') +
      ': ' +
      description +
      ': ' +
      downloadSize +
      ' Mb'
  )
  content.appendTo(container)
}

function getModalButtons(submitLabel) {
  return [
    {
      text: translate(submitLabel),
      icons: {
        primary: 'ui-icon-mail-closed',
      },
      click: sendEmail,
      type: 'submit',
    },
    {
      text: translate('email.cancelButton'),
      icons: {
        primary: 'ui-icon-close',
      },
      click: () => modal.dialog('close'),
    },
  ]
}

function openDataModal(paths, labels, downloadSize) {
  filePaths = paths
  fileLabels = labels
  downloadType = DOWNLOAD_TYPE.ZIP
  initModal(
    downloadSize,
    translate('email.modalheader'),
    getModalButtons('email.sendButton')
  )
  modal.dialog('open')
}

function openListModal(paths, labels, downloadSize) {
  filePaths = paths
  fileLabels = labels
  downloadType = DOWNLOAD_TYPE.LIST
  initModal(
    downloadSize,
    translate('email.modalheaderList'),
    getModalButtons('email.sendButtonList')
  )
  modal.dialog('open')
}

const getEmail = () => modal.data('email')

export default {
  openDataModal,
  openListModal,
  getEmail,
}
