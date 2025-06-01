import $ from 'jquery'

import { translate } from '../shared/translations'
import { toggleTabActivation } from '../shared/header'

import 'bootstrap/dist/css/bootstrap.min.css'


$(function () {
  $('#header').load('header.html')
  $('.content-article').load(translate('privacy.contentFile'))
  $('#footer').load('footer.html', function () {
    $('.body_container').show()
    toggleTabActivation('')
  })
})
