import { type Directive } from 'vue'
import { setHelp } from '@/modules/helpText'

type HelpDirectiveEl = HTMLElement & {
  _value?: string
  _helpHandler?: () => void
}

// This directive can be used on any element to change the
// content of the help box whenever the element is clicked.
// The contents can be a plain string, or rich HTML content for e.g. links

export const vHelp: Directive<HTMLElement, string | undefined> = {
  mounted(el: HelpDirectiveEl, binding) {
    el._value = binding.value
    el._helpHandler = () => {
      if (el._value?.startsWith('#')) idQuery(el)
      else if (el._value == undefined) classQuery(el)
      else setHelp(el._value)
    }
    el.addEventListener('click', el._helpHandler)
  },

  updated(el: HelpDirectiveEl, binding) {
    el._value = binding.value
  },

  unmounted(el: HelpDirectiveEl) {
    if (el._helpHandler) el.removeEventListener('click', el._helpHandler)
  }
}

// If the directive is used with an id selector ('#something'),
// we'll query for such an element and render its html
function idQuery(el: HelpDirectiveEl) {
  const target = document.querySelector<HTMLElement>(el._value!)
  if (target) {
    setHelp(target.innerHTML)
  }
  else {
    console.error('v-help query selector did not find anything')
  }
}

// If the directive is used without an argument,
// we assume there is a <help-content> inside the element's DOM
function classQuery(el: HelpDirectiveEl) {
  const target = el.querySelector('.help-content')
  if (target) {
    setHelp(target.innerHTML)
  }
  else {
    console.error('v-help did not find help content')
  }
}
