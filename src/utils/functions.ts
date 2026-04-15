import { useI18n } from 'vue-i18n'

export function selectLocale(locale: string) {
  const i18n = useI18n()
  switch (locale) {
    case 'fr':
      return i18n.t('components.navbar.customize.language.locales.fr')
    case 'tr':
      return i18n.t('components.navbar.customize.language.locales.tr')
    case 'en':
    default:
      return i18n.t('components.navbar.customize.language.locales.en')
  }
}
