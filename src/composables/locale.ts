import { ref } from 'vue'

// Locale
type Locale = 'en' | 'fi'
const locale = ref<Locale>('en')


export function useLocale() {
  return {
    locale,
  }
}