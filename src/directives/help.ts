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
    el._helpHandler = () => showHelp(el)
    el.addEventListener('click', el._helpHandler)
  },

  updated(el: HelpDirectiveEl, binding) {
    el._value = binding.value
  },

  unmounted(el: HelpDirectiveEl) {
    if (el._helpHandler) el.removeEventListener('click', el._helpHandler)
  }
}

// Resolves the element's help contents and hands them to the help box,
// together with a way of resolving them again later on
function showHelp(el: HelpDirectiveEl) {
  const content = resolve(el)
  if (content != undefined) setHelp(content, () => refresh(el))
}

function resolve(el: HelpDirectiveEl): string | undefined {
  if (el._value?.startsWith('#')) return idQuery(el)
  if (el._value == undefined) return classQuery(el)
  return el._value
}

// Selector based contents can always be looked up again, but an element that
// has been detached in the meanwhile no longer provides up-to-date contents
// (a re-render in another locale never reaches it), so we let the box default.
function refresh(el: HelpDirectiveEl) {
  if (el._value?.startsWith('#') || el.isConnected) showHelp(el)
  else setHelp()
}

// If the directive is used with an id selector ('#something'),
// we'll query for such an element and render its html
function idQuery(el: HelpDirectiveEl) {
  const targets = document.querySelectorAll<HTMLElement>(el._value!)
  if (targets.length > 1) {
    console.warn('v-help found multiple ' + el._value)
  }
  if (targets.length > 0) {
    return targets[0].innerHTML
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
    return target.innerHTML
  }
  else {
    console.error('v-help did not find help content')
  }
}
