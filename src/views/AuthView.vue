<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { AlertCircleIcon, PlusIcon } from 'lucide-vue-next'
import { useRoute, useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { useAnalytics, useAuthToken, useOAuth } from '@/composables'
import ThemedImg from '@/components/ThemedImg.vue'
import CustomIcon from '@/components/CustomIcon.vue'
import { useI18n } from 'vue-i18n'

const state = ref<'loading' | 'error'>('loading')
const error = ref<string>('')

const i18n = useI18n()
const router = useRouter()
const route = useRoute()
const { config: oauthConfig, fetch: fetchOAuthConfig } = useOAuth()
const { setTokens } = useAuthToken()
const { identify } = useAnalytics()

const authErrors = {
  access_denied: i18n.t('pages.auth.errors.access_denied'),
  token_exchange_failed: i18n.t('pages.auth.errors.token_exchange_failed'),
  fetch_user_failed: i18n.t('pages.auth.errors.fetch_user_failed'),
  unsupported_user: i18n.t('pages.auth.errors.unsupported_user'),
  suspended_user: i18n.t('pages.auth.errors.suspended_user'),
  registrations_disabled: i18n.t('pages.auth.errors.registrations_disabled'),
} as { [key: string]: string }

function redirect() {
  if (oauthConfig.value)
    return (window.location.href = `https://discord.com/api/oauth2/authorize?client_id=${oauthConfig.value.clientId}&redirect_uri=${encodeURI(window.location.origin)}%2Fauth&response_type=code&scope=${oauthConfig.value.scopes.join('%20')}`)
}

onBeforeMount(async () => {
  const code = route.query.code as string | undefined
  const err = route.query.error as string | undefined
  const redirection = route.query.redirect as string | undefined

  if (!oauthConfig.value) await fetchOAuthConfig()
  if (err) {
    state.value = 'error'
    error.value = authErrors[err] ?? err
    return
  }

  if (!code) {
    if (redirection) localStorage.setItem('redirectAfterLogin', redirection)

    return redirect()
  }

  if (code === 'ok') {
    const { accessToken, refreshToken, expiresIn, id } = route.query as unknown as {
      accessToken: string
      refreshToken: string
      expiresIn: number
      id?: string
    }

    if (!id) {
      state.value = 'error'
      error.value = 'invalid_query'
      return
    }

    setTokens({
      accessToken,
      expiresIn,
      refreshToken,
      userId: id,
    })
    identify(id, { app_locale: i18n.locale.value })

    setTimeout(() => {
      const redirectAfterLogin = localStorage.getItem('redirectAfterLogin')

      if (redirectAfterLogin) {
        localStorage.removeItem('redirectAfterLogin')
        return router.push(redirectAfterLogin)
      } else return router.push('/')
    }, 1000)
  } else
    window.location.href = `${window.CONFIG.apiBaseUrl}/auth?code=${code}&scopes=${oauthConfig.value?.scopes.join('%20')}&redirection=${encodeURI(window.location.origin)}%2Fauth`
})
</script>

<template>
  <div
    v-if="state === 'loading'"
    class="container flex flex-col gap-8 justify-center items-center fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
  >
    <div class="flex items-center gap-4">
      <ThemedImg
        dark-img="/brand/long_logo_dark.webp"
        light-img="/brand/long_logo_light.webp"
        alt="Discord Analytics"
        class="w-32"
      />
      <PlusIcon />
      <CustomIcon icon="discord" class="fill-white light:fill-black w-24" />
    </div>
    <h1 class="text-xl font-bold text-center">
      {{ $t('pages.auth.connecting') }}
    </h1>
  </div>
  <div
    v-else-if="state === 'error'"
    class="container flex flex-col gap-8 justify-center items-center fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
  >
    <AlertCircleIcon class="w-32 h-32" />
    <h1 class="text-xl font-bold text-center">
      {{ $t('pages.auth.error') }}
    </h1>
    <h2 class="text-lg text-center">
      {{ error }}
    </h2>
    <Button @click="redirect()">
      {{ $t('pages.auth.retry') }}
    </Button>
  </div>
</template>
