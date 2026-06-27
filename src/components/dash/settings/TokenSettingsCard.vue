<script setup lang="ts">
import { CopyIcon, EyeIcon, EyeOffIcon, KeyIcon, RefreshCwIcon } from '@lucide/vue'
import { useClipboard } from '@vueuse/core'
import { useRouteParams } from '@vueuse/router'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { toast } from 'vue-sonner'

import { SettingCard } from '@/components'
import {
  Button,
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  Spinner,
} from '@/components/ui'
import { useAnalytics, useBot, useLoading } from '@/composables'

const botId = useRouteParams<string>('id')
const { getToken: getBotToken, regenToken: regenBotToken } = useBot(botId)
const { copy, isSupported: isCopySupported } = useClipboard()
const { t } = useI18n()
const { isLoading, withLoading } = useLoading()

const botToken = ref<string>('')
const showBotToken = ref<boolean>(false)

function copyToken() {
  copy(botToken.value)
  toast.success(t('pages.dash.onboarding.stepTwo.getToken.tokenCopied'))
}

async function onTokenRefresh() {
  await withLoading(async () => {
    await regenBotToken()
      .then(async () => {
        useAnalytics().capture('api_token_reset', { bot_id: botId.value })
        botToken.value = (await getBotToken()).token
        toast.success(t('pages.dash.settings.general.token.toast'))
      })
      .catch((err) => {
        toast.error(err.message)
      })
  })
}

onMounted(() => {
  setTimeout(async () => {
    await withLoading(async () => {
      botToken.value = (await getBotToken()).token
    })
  }, 100)
})
</script>

<template>
  <SettingCard
    :title="$t('pages.dash.settings.general.token.title')"
    :icon="KeyIcon"
    :description="$t('pages.dash.settings.general.token.description')"
    learn-more-link="/docs/get-started/installation"
  >
    <template #content>
      <div class="flex items-center gap-2 w-full flex-col md:flex-row">
        <InputGroup class="my-2 w-full">
          <InputGroupInput
            :value="botToken"
            :placeholder="$t('pages.dash.onboarding.stepTwo.getToken.tokenPlaceholder')"
            :disabled="isLoading"
            readonly
            :type="showBotToken ? 'text' : 'password'"
          />
          <InputGroupAddon align="inline-end">
            <Spinner v-if="isLoading" />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              :aria-label="$t('pages.dash.settings.general.token.showToken')"
              :title="$t('pages.dash.settings.general.token.showToken')"
              size="icon-xs"
              @click="showBotToken = !showBotToken"
            >
              <EyeOffIcon v-if="showBotToken" />
              <EyeIcon v-else />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        <div class="flex items-center gap-2 w-full md:w-fit">
          <Button
            v-if="isCopySupported"
            variant="outline"
            size="icon"
            :disabled="isLoading"
            @click="copyToken"
          >
            <CopyIcon />
          </Button>
          <Button :disabled="isLoading" @click="onTokenRefresh" class="w-full md:w-fit">
            <Spinner v-if="isLoading" />
            <RefreshCwIcon v-else />
            {{ $t('pages.dash.settings.general.token.refreshButton') }}
          </Button>
        </div>
      </div>
    </template>
  </SettingCard>
</template>
