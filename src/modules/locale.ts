import { computed, type Component } from 'vue';
import { createI18n } from 'vue-i18n'
import { setHelp } from '@/modules/helpText';

// Available locales
export type Locale = 'en' | 'fi'

// Internationalization instance
export const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('app-locale') || 'en',
  fallbackLocale: 'en',
  messages: {
    // These are global translations. To use these, you need to use global scope:
    // const { t } = useI18n({ useScope: 'global' })
    // Component-specific translations are in the components' files.
    'en': {
      'toasts': {
        'default_title': 'Notice',
      },
      'help': {
        'default': 'Click something for help!',
        'tooltip': 'Show help',
      },
    },
    'fi': {
      'toasts': {
        'default_title': 'Huomautus',
      },
      'help': {
        'default': 'Napsauta jotain saadaksesi siitä apua!',
        'tooltip': 'Näytä ohjeet',
      },
    },
  },
})

export const currentLocale = computed(() => i18n.global.locale.value);
export function setLocale(locale: Locale) {
  i18n.global.locale.value = locale
  localStorage.setItem('app-locale', locale)
  setHelp(undefined)
}

// Flags for visualization
const flags: Record<string, string> = {
  en: 'EN 🇬🇧',
  fi: 'FI 🇫🇮',
}
export const currentFlag = computed(() => flags[currentLocale.value] || '')

// Items for locale changing dropdowns
export const languageItems = [
  { name: 'English 🇬🇧', action: () => setLocale('en') },
  { name: 'Suomeksi 🇫🇮', action: () => setLocale('fi') },
]

// Import all content that is localized per-page
// These files use filename format `[name]-[locale].vue`, e.g. `Home-en.vue`
export const pages = import.meta.glob<Component>('/src/views/content/*.vue')

// Returns the loader of a localized page using the current locale,
// or the fallback locale if not found
export function getLocalizedPage(baseName: string): () => Promise<Component> {
  const basePath = '/src/views/content/'
  let path = basePath + `${baseName}-${currentLocale.value}.vue`
  if (!pages[path]) {
    // Use our fallback locale instead
    console.warn(`Missing localized ${baseName} page`)
    path = basePath + `${baseName}-${i18n.global.fallbackLocale}.vue`
  }
  return pages[path]
}
