import { createI18n } from 'vue-i18n'

import * as locales from './locales'

export const i18n = createI18n<[locales.Translations], 'en' | 'fr'>({
  legacy: false,
  globalInjection: true,
  locale: 'en',
  messages: {
    en: locales.english,
    fr: locales.french,
  },
})
