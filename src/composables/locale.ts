import { computed, defineAsyncComponent, type Component } from 'vue';
import { createI18n } from 'vue-i18n'

// Available locales
type Locale = 'en' | 'fi'

// Internationalization instance
const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    // These are global translations. To use these, you need to use global scope:
    // const { t } = useI18n({ useScope: 'global' })
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

// Import all content that is localized per-page
const pages = import.meta.glob<Component>('/src/views/content/*.vue')



export function useLocale() {

  // Changes the locale of the whole app
  function setLocale(locale: Locale) {
    i18n.global.locale.value = locale
  }
  const currentLocale = computed(() => i18n.global.locale.value);

  // Flags for visualization
  const flags: Record<string, string> = {
    en: 'EN 🇬🇧',
    fi: 'FI 🇫🇮',
  }
  const currentFlag = computed(() => flags[currentLocale.value] || '')

  // Items for locale changing dropdowns
  const languageItems = [
    { name: 'English 🇬🇧', action: () => setLocale('en') },
    { name: 'Suomeksi 🇫🇮', action: () => setLocale('fi') },
  ]

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

  return {
    i18n,
    currentLocale,
    currentFlag,
    setLocale,
    languageItems,
    loadLocalizedContent,
  }
}