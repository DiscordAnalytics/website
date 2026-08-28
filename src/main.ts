import type { Engine } from '@tsparticles/engine'
import Particles from '@tsparticles/vue3'
import { createHead } from '@unhead/vue/client'
import { createPinia } from 'pinia'
import { loadFull } from 'tsparticles'
import { createApp } from 'vue'

import '@/assets/index.css'

import App from './App.vue'
import { i18n } from './i18n'
import router from './router'

const app = createApp(App)

app
  .use(createPinia())
  .use(router)
  .use(i18n)
  .use(createHead())
  .use(Particles, {
    init: async (engine: Engine) => {
      await loadFull(engine)
    },
  })

app.mount('#app')
