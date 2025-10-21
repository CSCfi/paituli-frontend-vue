import { nextTick, ref } from 'vue'
import { type CToastMessage } from '@cscfi/csc-ui'

const toastsRef = ref<HTMLCToastsElement | null>(null)

export function useToasts() {
  function initToasts(element: HTMLCToastsElement | null) {
    toastsRef.value = element
  }

  // Displays a message near the header ribbon (by default)
  async function addToast(message: CToastMessage, customRef: HTMLCToastsElement | null = null) {
    // If we want to show a toast immediately upon mount, we have to
    // wait a tick for Vue to flush DOM and ensure the ref is assigned
    await nextTick()

    // Set a default title and duration (30 seconds), if not set
    if (!message.title) message.title = 'Notice'
    if (!message.duration && !message.persistent) message.duration = 30000

    if (customRef == null) toastsRef.value?.addToast(message)
    else customRef.addToast(message)
  }

  return { initToasts, addToast }
}
