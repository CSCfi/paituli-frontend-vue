import { type Directive } from 'vue'

// c-select does not render its option list itself. It hands the list to a
// nested c-dropdown, which clones our c-option markup into its own shadow root
// and sizes the list to the width of the input field. Anything wider than the
// field then either overflows into a horizontal scrollbar, or - for a row laid
// out inside an option - wraps onto a second line. The cloned options live
// behind two shadow roots and cannot be reached from our stylesheets, so this
// directive adopts the rules straight into the dropdown's shadow root.

// The list keeps the field width as its minimum and grows rightwards from
// there, capped at a share of the viewport so it cannot grow out of reach.
// The dialog around it is overflow: visible, so nothing clips the wider list.
// Mobile dropdowns open full screen and size themselves, so they are left be.
const DROPDOWN_CSS = `
  :host(c-dropdown) ul:not(.mobile) {
    width: max-content;
    min-width: 100%;
    max-width: 90vw;
  }

  /* An option's tag is justified to the far end of the option, which leaves it
     touching the label on the widest option - the one option whose row has no
     free space left to justify against */
  :host(c-dropdown) li c-tag {
    margin-left: 1.5rem;
  }
`

const sheet = new CSSStyleSheet()
sheet.replaceSync(DROPDOWN_CSS)

// The dropdown and its shadow root only come into existence once c-select has
// rendered, which happens some frames after we are mounted
const MAX_ATTEMPTS = 60

const adoptStyles = (el: HTMLElement, attempt = 0) => {
  // The element is gone whenever its select got replaced while we waited
  if (!el.isConnected) return

  const root = el.shadowRoot?.querySelector('c-dropdown')?.shadowRoot
  if (!root) {
    if (attempt < MAX_ATTEMPTS) {
      requestAnimationFrame(() => adoptStyles(el, attempt + 1))
      return
    }
    console.warn(
      `No dropdown found in ${el.tagName}, its options cannot be sized to fit`)
    return
  }
  if (root.adoptedStyleSheets.includes(sheet)) return
  root.adoptedStyleSheets = [...root.adoptedStyleSheets, sheet]
}

export const vDropdownFit: Directive<HTMLElement> = {
  mounted: (el) => adoptStyles(el),
}
