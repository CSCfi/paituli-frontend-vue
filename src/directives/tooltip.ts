import type { DirectiveBinding } from 'vue'

type TooltipState = {
  tooltip: HTMLDivElement
  show: () => void
  hide: () => void
  timer: number | null
}

const tooltipState = new WeakMap<HTMLElement, TooltipState>()

const SHOW_DELAY = 500 // ms
const TOP_OFFSET = 8   // px

export const vTooltip = {
  mounted(el: HTMLElement, binding: DirectiveBinding<string>) {
    const tooltip = document.createElement('div')
    tooltip.textContent = binding.value
    tooltip.className = 'v-tooltip'
    document.body.appendChild(tooltip)

    let timer: number | null = null

    const show = () => {
      timer = window.setTimeout(() => {
        const rect = el.getBoundingClientRect()
        tooltip.style.opacity = '1'
        tooltip.style.left = `${rect.left + window.scrollX}px`
        tooltip.style.top =
          `${rect.top + window.scrollY - tooltip.offsetHeight - TOP_OFFSET}px`
      }, SHOW_DELAY)
    }

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
