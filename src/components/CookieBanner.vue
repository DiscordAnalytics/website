<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="translate-y-full opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="translate-y-full opacity-0"
  >
    <div v-if="analyticsConsent == null" class="fixed bottom-0 inset-x-0 z-50 p-4 sm:p-6">
      <div
        class="mx-auto max-w-xl rounded-lg border bg-background p-4 shadow-lg sm:p-6 flex flex-col gap-4"
      >
        <div class="flex flex-col gap-2">
          <h3 class="text-base font-semibold flex items-center gap-2">
            <CookieIcon />
            {{ t('components.cookieBanner.title') }}
          </h3>
          <p class="text-sm text-muted-foreground">
            {{ t('components.cookieBanner.description') }}
          </p>
        </div>
        <div class="flex items-center justify-end gap-2">
          <button
            class="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-4 border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
            @click="rejectCookies"
          >
            {{ t('components.cookieBanner.decline') }}
          </button>
          <button
            class="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-4 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            @click="acceptCookies"
          >
            {{ t('components.cookieBanner.accept') }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { CookieIcon } from '@lucide/vue'
import { useI18n } from 'vue-i18n'
import posthog from 'posthog-js'
import { useConfig } from '@/composables'
import { useLocalStorage } from '@vueuse/core'

const { t } = useI18n()
const config = useConfig()

const analyticsConsent = useLocalStorage<boolean | null>('analyticsConsent', null)

onMounted(() => {
  const { posthogProjectToken, posthogApiHost } = config
  if (!posthogProjectToken || !posthogApiHost) return

  posthog.init(posthogProjectToken, {
    api_host: posthogApiHost,
    ui_host: 'https://eu.posthog.com',
    capture_pageview: true,
    capture_pageleave: true,
    persistence: 'localStorage+cookie',
    opt_out_capturing_by_default: true,
    before_send: (event) => {
      if (!event || window.location.host.includes('localhost')) return null
      else return event
    },
  })

  if (analyticsConsent) {
    posthog.opt_in_capturing()
  }
})

function acceptCookies() {
  analyticsConsent.value = true
  posthog.opt_in_capturing()
}

function rejectCookies() {
  analyticsConsent.value = false
}
</script>
