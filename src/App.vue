<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { useColorMode, useLocalStorage, usePreferredLanguages } from '@vueuse/core'
import { computed, onBeforeMount, onErrorCaptured } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { toast } from 'vue-sonner'
import 'vue-sonner/style.css'

import { CookieBanner } from '@/components'
import { Toaster } from '@/components/ui'
import { useStore } from '@/stores'
import carrotConfettisOptions from '@/utils/particles/carrots_rain.ts'
import snowParticlesOptions from '@/utils/particles/snow.ts'

const { setTheme } = useStore()
const i18n = useI18n()
const languages = usePreferredLanguages()
const mode = useColorMode()
const route = useRoute()

const privatePaths = ['/dash', '/auth', '/invitations']

useHead({
  htmlAttrs: { lang: computed(() => i18n.locale.value) },
  meta: [
    {
      name: 'robots',
      content: computed(() =>
        privatePaths.some((path) => route.path.startsWith(path)) ? 'noindex, nofollow' : undefined,
      ),
    },
  ],
})

const isCarroted = useLocalStorage('isCarroted', false)
const isChristmas = new Date().getMonth() === 11
const snowEnabled = useLocalStorage('snowEnabled', true)

onBeforeMount(() => {
  const store = useStore()
  setTheme(store.theme)

  const locale = useLocalStorage('locale', '')
  if (locale.value) i18n.locale.value = locale.value
  else {
    for (const lang of languages.value) {
      if (i18n.availableLocales.includes(lang)) {
        i18n.locale.value = lang
        locale.value = lang
      }
    }
  }
})

onErrorCaptured((err, instance, info) => {
  toast.error('An error occurred', {
    description: `${err.message} - ${info}`,
    duration: 15000,
  })
})
</script>

<template>
  <Toaster />
  <CookieBanner />
  <RouterView />

  <vue-particles
    v-if="snowEnabled && mode === 'light' && isChristmas"
    id="tsparticles"
    :options="{ particles: { ...snowParticlesOptions.particles, color: { value: '#000' } } }"
  />
  <vue-particles
    v-else-if="snowEnabled && isChristmas"
    id="tsparticles"
    :options="snowParticlesOptions"
  />
  <vue-particles v-if="isCarroted" id="tsparticles" :options="carrotConfettisOptions" />
</template>
