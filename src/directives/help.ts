import { type Directive } from 'vue'
import { setHelp, type HelpContents } from '@/modules/helpText'

// The directive value is either the contents as such, an id selector for an
// element holding them ('#something'), or plain help text without a label
type HelpValue = HelpContents | string | undefined

type HelpDirectiveEl = HTMLElement & {
  _value?: HelpValue
  _helpHandler?: () => void
}

// This directive can be used on any element to change the
// content of the help box whenever the element is clicked.
// The contents can be a plain string, or rich HTML content for e.g. links

export const vHelp: Directive<HTMLElement, HelpValue> = {
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
  const contents = resolve(el)
  if (contents != undefined) setHelp(contents, () => refresh(el))
}

function resolve(el: HelpDirectiveEl): HelpContents | undefined {
  const value = el._value
  if (typeof value == 'object') return value
  if (value == undefined) return classQuery(el)
  if (value.startsWith('#')) return idQuery(value)
  return { text: value }
}

// Selector based contents can always be looked up again, but an element that
// has been detached in the meanwhile no longer provides up-to-date contents
// (a re-render in another locale never reaches it), so we let the box default.
function refresh(el: HelpDirectiveEl) {
  if (isSelector(el._value) || el.isConnected) showHelp(el)
  else setHelp()
}

function isSelector(value: HelpValue) {
  return typeof value == 'string' && value.startsWith('#')
}

// If the directive is used with an id selector ('#something'),
// we'll query for such an element and render its html
function idQuery(selector: string) {
  const targets = document.querySelectorAll<HTMLElement>(selector)
  if (targets.length > 1) {
    console.warn('v-help found multiple ' + selector)
  }
  if (targets.length > 0) {
    return contentsOf(targets[0])
  }
  else {
    console.error('v-help query selector did not find anything')
  }
}

// If the directive is used without an argument,
// we assume there is a <help-content> inside the element's DOM
function classQuery(el: HelpDirectiveEl) {
  const target = el.querySelector<HTMLElement>('.help-content')
  if (target) {
    return contentsOf(target)
  }
  else {
    console.error('v-help did not find help content')
  }
}

// A <help-content> element carries its label in a data attribute
function contentsOf(target: HTMLElement): HelpContents {
  return { text: target.innerHTML, label: target.dataset.label }
}
