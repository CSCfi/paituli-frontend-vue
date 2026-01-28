import { computed, defineAsyncComponent, type Component } from 'vue';
import { createI18n } from 'vue-i18n'

// Available locales
type Locale = 'en' | 'fi'

// Items for locale changing
const languageItems = [
  { name: 'English 🇬🇧', action: () => setLocale('en') },
  { name: 'Suomeksi 🇫🇮', action: () => setLocale('fi') },
]

const flags: Record<string, string> = {
  en: 'EN 🇬🇧',
  fi: 'FI 🇫🇮',
}

// Internationalization instance
const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    // These are global translations.
    // Component-specific translations are in the components' files.
    'en': {
      'toasts': {
        'default_title': 'Notice',
      },
    },
    'fi': {
      'toasts': {
        'default_title': 'Huomautus',
      },
    },
  },
})

const currentLocale = computed(() => i18n.global.locale.value);

const currentFlag = computed(() => {
  return flags[currentLocale.value] || ''
})

const setLocale = (locale: Locale) => {
  i18n.global.locale.value = locale
}

// Import all content that is localized per-page
const pages = import.meta.glob<Component>('/src/views/content/*.vue')

// For lazy loading textual template content for views
// These files use filename format `[name]-[locale].vue`, e.g. `Home-en.vue`
const loadLocalizedContent = (baseName: string, fallback: Locale = 'en') => computed(() => {
  const localizedPath = `/src/views/content/${baseName}-${currentLocale.value}.vue`
  const fallbackPath =  `/src/views/content/${baseName}-${fallback}.vue`
  if (!pages[localizedPath]) console.warn(`Missing localized ${baseName} page`)

  const loader = pages[localizedPath] ?? pages[fallbackPath]
  return defineAsyncComponent(async () => {
    return await loader()
  })
})


export function useLocale() {
  return {
    i18n,
    currentLocale,
    currentFlag,
    setLocale,
    languageItems,
    loadLocalizedContent,
  }
}