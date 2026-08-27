import { nextTick, ref, watch } from 'vue'
import { currentLocale } from '@/modules/locale'

export const helpText = ref<string>()
export const helpVisible = ref(false)

// Callback for resolving the current contents again, see setHelp()
let refresh: (() => void) | undefined

// Sets the help box text.
// Using a falsy argument will cause the help box to default.
// The optional refresh callback is used to resolve the same contents again
// after a locale change, so the box keeps showing what it was showing.
export function setHelp(text?: string, refreshFn?: () => void) {
  helpText.value = text
  refresh = text ? refreshFn : undefined
}

// The box introduces itself by opening once with initial contents, provided by
// the given callback. Later calls do nothing, so that the box never forces
// itself open again after the user has closed it.
let introduced = false
export function introduceHelp(setContents: () => void) {
  if (introduced) return
  introduced = true
  setContents()
  helpVisible.value = true
}

// The contents are stored as already rendered HTML, so they have to be
// resolved again after a locale change. The source element needs to be
// re-rendered in the new locale first, hence the nextTick.
watch(currentLocale, async () => {
  await nextTick()
  refresh?.()
})
