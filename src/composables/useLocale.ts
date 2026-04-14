import { useI18n } from 'vue-i18n'

export type DiscordLocale =
  | 'id'
  | 'da'
  | 'de'
  | 'en-GB'
  | 'en-US'
  | 'es-ES'
  | 'es-419'
  | 'fr'
  | 'hr'
  | 'it'
  | 'lt'
  | 'hu'
  | 'nl'
  | 'no'
  | 'pl'
  | 'pt-BR'
  | 'ro'
  | 'fi'
  | 'sv-SE'
  | 'vi'
  | 'tr'
  | 'cs'
  | 'el'
  | 'bg'
  | 'ru'
  | 'uk'
  | 'hi'
  | 'th'
  | 'zh-CN'
  | 'ja'
  | 'zh-TW'
  | 'ko'

const LOCALE_KEY_MAP: Record<DiscordLocale, string> = {
  id: 'pages.dash.commons.locales.id',
  da: 'pages.dash.commons.locales.da',
  de: 'pages.dash.commons.locales.de',
  'en-GB': 'pages.dash.commons.locales.en_GB',
  'en-US': 'pages.dash.commons.locales.en_US',
  'es-ES': 'pages.dash.commons.locales.es_ES',
  'es-419': 'pages.dash.commons.locales.es_419',
  fr: 'pages.dash.commons.locales.fr',
  hr: 'pages.dash.commons.locales.hr',
  it: 'pages.dash.commons.locales.it',
  lt: 'pages.dash.commons.locales.lt',
  hu: 'pages.dash.commons.locales.hu',
  nl: 'pages.dash.commons.locales.nl',
  no: 'pages.dash.commons.locales.no',
  pl: 'pages.dash.commons.locales.pl',
  'pt-BR': 'pages.dash.commons.locales.pt_BR',
  ro: 'pages.dash.commons.locales.ro',
  fi: 'pages.dash.commons.locales.fi',
  'sv-SE': 'pages.dash.commons.locales.sv_SE',
  vi: 'pages.dash.commons.locales.vi',
  tr: 'pages.dash.commons.locales.tr',
  cs: 'pages.dash.commons.locales.cs',
  el: 'pages.dash.commons.locales.el',
  bg: 'pages.dash.commons.locales.bg',
  ru: 'pages.dash.commons.locales.ru',
  uk: 'pages.dash.commons.locales.uk',
  hi: 'pages.dash.commons.locales.hi',
  th: 'pages.dash.commons.locales.th',
  'zh-CN': 'pages.dash.commons.locales.zh_CN',
  ja: 'pages.dash.commons.locales.ja',
  'zh-TW': 'pages.dash.commons.locales.zh_TW',
  ko: 'pages.dash.commons.locales.ko',
}

export default function useLocale() {
  const { t } = useI18n()

  function getLocaleName(locale: string): string | null {
    const key = LOCALE_KEY_MAP[locale as DiscordLocale]
    return key ? t(key) : null
  }

  return { getLocaleName }
}
