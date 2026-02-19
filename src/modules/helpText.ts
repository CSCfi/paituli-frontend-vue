import { ref } from 'vue'

export const helpText = ref<string>()
export const helpVisible = ref(false)
let firstClick = true

// Sets the help box text, unhiding the box if this is the first.
// Using a falsy argument will cause the help box to default.
// (watch implemented in HelpBox.vue)
export function setHelp(text?: string) {
  if (firstClick) {
    helpVisible.value = true
    firstClick = false
  }
  helpText.value = text
}
