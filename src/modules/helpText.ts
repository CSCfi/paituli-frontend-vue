import { nextTick, ref, watch } from 'vue'
import { currentLocale } from '@/modules/locale'

export const helpText = ref<string>()
export const helpVisible = ref(false)

// The box is unhidden automatically on the first help contents, but only once,
// so that closing it doesn't get undone by every subsequent click.
let autoOpen = true

// Callback for resolving the current contents again, see setHelp()
let refresh: (() => void) | undefined

// Sets the help box text, unhiding the box if this is the first.
// Using a falsy argument will cause the help box to default.
// The optional refresh callback is used to resolve the same contents again
// after a locale change, so the box keeps showing what it was showing.
export function setHelp(text?: string, refreshFn?: () => void) {
  if (autoOpen) {
    helpVisible.value = true
    autoOpen = false
  }
  helpText.value = text
  refresh = text ? refreshFn : undefined
}

export function openHelp() {
  helpVisible.value = true
  autoOpen = false
}

// The contents are stored as already rendered HTML, so they have to be
// resolved again after a locale change. The source element needs to be
// re-rendered in the new locale first, hence the nextTick.
watch(currentLocale, async () => {
  await nextTick()
  refresh?.()
})
