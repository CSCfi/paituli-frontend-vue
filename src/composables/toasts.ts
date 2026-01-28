import { ref } from 'vue'
import { type CToastMessage } from '@cscfi/csc-ui'
import { useI18n } from 'vue-i18n'

// Global
const toastsRef = ref<HTMLCToastsElement | null>(null)

export function useToasts() {
  const { t } = useI18n({ useScope: 'global' })

  function initToasts(element: HTMLCToastsElement | null) {
    toastsRef.value = element
  }

  // Displays a message to the user (near the header ribbon by default)
  async function addToast(message: CToastMessage, customRef: HTMLCToastsElement | null = null) {

    // Set a default title and duration (30 seconds), if not set
    if (!message.title) message.title = t('toasts.default_title')
    if (!message.duration && !message.persistent) message.duration = 30000

    if (customRef == null) toastsRef.value?.addToast(message)
    else customRef.addToast(message)
  }

  return { initToasts, addToast }
}
