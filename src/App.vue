<script setup lang="ts">
import { Toaster } from '@/components/ui/sonner'
import 'vue-sonner/style.css'
import { onBeforeMount, onErrorCaptured } from 'vue'
import { useStore } from '@/stores'
import type { Color } from '@/utils/types.ts'
import { useI18n } from 'vue-i18n'
import { useColorMode, useLocalStorage, usePreferredLanguages } from '@vueuse/core'
import { toast } from 'vue-sonner'
import carrotConfettisOptions from '@/utils/particles/carrots_rain.ts'
import snowParticlesOptions from '@/utils/particles/snow.ts'
import CookieBanner from '@/components/CookieBanner.vue'

const { setTheme } = useStore()
const i18n = useI18n()
const languages = usePreferredLanguages()
const mode = useColorMode()

const isCarroted = useLocalStorage('isCarroted', false)
const isChristmas = new Date().getMonth() === 11
const snowEnabled = useLocalStorage('snowEnabled', true)

onBeforeMount(() => {
  const theme = localStorage.getItem('theme') as Color | null

  if (theme) setTheme(theme)
  else setTheme('blue')

  const locale = localStorage.getItem('locale')
  if (locale) i18n.locale.value = locale
  else {
    for (const lang of languages.value) {
      if (i18n.availableLocales.includes(lang)) {
        i18n.locale.value = lang
        localStorage.setItem('locale', lang)
      }
    }
  }
  document.documentElement.lang = i18n.locale.value
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
