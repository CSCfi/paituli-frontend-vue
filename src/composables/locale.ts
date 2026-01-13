import { createI18n } from 'vue-i18n'

// Available locales
type Locale = 'en' | 'fi'

// Items for locale changing
const languageItems = [
  { name: 'English 🇬🇧', action: () => setLocale('en') },
  { name: 'Suomeksi 🇫🇮', action: () => setLocale('fi') },
];

// Internationalization instance
const i18n = createI18n({
  legacy: false,
  messages: {} // Global translations here
})

const currentLocale = () => i18n.global.locale.value;

const setLocale = (locale: Locale) => {
  i18n.global.locale.value = locale
}

export function useLocale() {
  return {
    i18n,
    currentLocale,
    setLocale,
    languageItems,
  }
}