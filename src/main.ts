import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import '@/assets/index.css'
import { createI18n } from 'vue-i18n'
import * as locales from './locales'

const app = createApp(App)

export const i18n = createI18n<[locales.Translations], 'en' | 'fr'>({
  legacy: false,
  globalInjection: true,
  locale: 'en',
  messages: {
    en: locales.english,
    fr: locales.french,
  },
})

app.use(createPinia()).use(router).use(i18n)

app.mount('#app')
