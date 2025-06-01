import $ from 'jquery'

import { translate } from './translations'
import '../../css/footer.css'

function setTranslations() {
  $('#okm-logo').attr('src', translate('footer.ministryLogo'))
  $('#avoin-logo').attr('src', translate('footer.avoinLogo'))
  $('#accessibilityLink').text(translate('footer.accessibilityLink'))
  $('#privacyLink').text(translate('footer.privacyLink'))

}

setTranslations()
