<script setup lang="ts">
import { Toaster } from '@/components/ui/sonner'
import 'vue-sonner/style.css'
import { onBeforeMount, onErrorCaptured } from 'vue'
import { useStore } from '@/stores'
import type { Color } from '@/utils/types.ts'
import { useI18n } from 'vue-i18n'
import { usePreferredLanguages } from '@vueuse/core'
import { toast } from 'vue-sonner'

const { setTheme } = useStore()
const i18n = useI18n()
const languages = usePreferredLanguages()

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

  <RouterView />
</template>
