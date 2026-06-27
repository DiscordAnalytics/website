import type { Engine } from '@tsparticles/engine'
import Particles from '@tsparticles/vue3'
import { createPinia } from 'pinia'
import { loadFull } from 'tsparticles'
import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'

import '@/assets/index.css'

import App from './App.vue'
import * as locales from './locales'
import router from './router'

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

app
  .use(createPinia())
  .use(router)
  .use(i18n)
  .use(Particles, {
    init: async (engine: Engine) => {
      await loadFull(engine)
    },
  })

app.mount('#app')
