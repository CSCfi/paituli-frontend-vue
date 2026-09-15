import { ref } from 'vue'
import { type CToastMessage } from '@cscfi/csc-ui'

import { i18n } from '@/modules/locale'

const toastsRef = ref<HTMLCToastsElement | null>(null)

export const initToasts =
  (element: HTMLCToastsElement | null) => toastsRef.value = element;

// Displays a message to the user (near the header ribbon by default).
export async function addToast(
  message: CToastMessage,
  customRef: HTMLCToastsElement | null = null) {

  // Set a default title and duration (30 seconds), if not set
  if (!message.title) message.title = i18n.global.t('toasts.default_title')
  if (!message.duration && !message.persistent) message.duration = 30000

  if (customRef == null) toastsRef.value?.addToast(message)
  else customRef.addToast(message)
}

// Kept so that component call sites read like the other composables
export function useToasts() {
  return { addToast }
}
