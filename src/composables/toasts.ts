import { nextTick, ref } from 'vue'
import { type CToastMessage } from '@cscfi/csc-ui'

const toastsRef = ref<HTMLCToastsElement | null>(null)

export function useToasts() {
  function initToasts(element: HTMLCToastsElement | null) {
    toastsRef.value = element
  }

  // Displays a message near the header ribbon
  async function addToast(message: CToastMessage) {
    // If we want to show a toast immediately upon mount, we have to
    // wait a tick for Vue to flush DOM and ensure the ref is assigned
    await nextTick()

    if (!message.title) message.title = 'Notice'
    if (!message.duration) message.duration = 30000 // 30 seconds
    toastsRef.value?.addToast(message)
  }

  return { initToasts, addToast }
}
