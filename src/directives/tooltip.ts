import type { DirectiveBinding } from 'vue'

const tooltipState = new WeakMap<HTMLElement, {
  tooltip: HTMLDivElement
  timer: number | null
  show: () => void
  hide: () => void
}>()

const SHOW_DELAY = 500 // ms
const TOP_OFFSET = 8   // px

// This directive shows tooltips, but also hacks past c-buttons' shadow root to
// change the cursor depending on the button's state. If you are reading this
// and know how to do that with CSS, please do that instead - seems impossible?

export const vTooltip = {
  mounted(el: HTMLElement, binding: DirectiveBinding<string>) {
    const parent = document.querySelector('header') || document.body
    const tooltip = document.createElement('div')
    tooltip.textContent = binding.value
    tooltip.className = 'v-tooltip'
    parent.appendChild(tooltip)

    let timer: number | null = null
    // Change cursor based on whether the parent c-button is disabled,
    // and show tooltip after the delay
    const show = () => {
      const target = (el.shadowRoot?.querySelector('button') as HTMLElement) ?? el
      const isDisabled = el.classList.contains('c-button--disabled')
      target.style.cursor = isDisabled ? 'not-allowed' : ''

      timer = window.setTimeout(() => {
        const rect = el.getBoundingClientRect()
        tooltip.style.opacity = '1'
        tooltip.style.left = `${rect.left + window.scrollX}px`
        tooltip.style.top =
          `${rect.top + window.scrollY - tooltip.offsetHeight - TOP_OFFSET}px`
      }, SHOW_DELAY)
    }
    // Hide tooltip and reset timer
    const hide = () => {
      if (timer !== null) {
        clearTimeout(timer)
        timer = null
      }
      tooltip.style.opacity = '0'
    }

    el.addEventListener('mouseenter', show)
    el.addEventListener('mouseleave', hide)

    tooltipState.set(el, { tooltip, show, hide, timer })
  },

  updated(el: HTMLElement, binding: DirectiveBinding<string>) {
    const state = tooltipState.get(el)
    if (state) {
      state.tooltip.textContent = binding.value
    }
  },

  unmounted(el: HTMLElement) {
    const state = tooltipState.get(el)
    if (!state) return

    el.removeEventListener('mouseenter', state.show)
    el.removeEventListener('mouseleave', state.hide)
    state.tooltip.remove()
    tooltipState.delete(el)
  },
}
