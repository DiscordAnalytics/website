<script setup lang="ts">
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import SettingCard from '@/components/dash/SettingCard.vue'
import { Spinner } from '@/components/ui/spinner'
import { CopyIcon, EyeIcon, EyeOffIcon, KeyIcon, RefreshCwIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { useRouteParams } from '@vueuse/router'
import { useBot } from '@/composables'
import { useClipboard } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { onMounted, ref } from 'vue'
import { toast } from 'vue-sonner'

const botId = useRouteParams<string>('id')
const { getToken: getBotToken, regenToken: regenBotToken } = useBot(botId)
const { copy, isSupported: isCopySupported } = useClipboard()
const { t } = useI18n()

const isLoading = ref<boolean>(false)
const botToken = ref<string>('')
const showBotToken = ref<boolean>(false)

function copyToken() {
  copy(botToken.value)
  toast.success(t('pages.dash.onboarding.stepTwo.getToken.tokenCopied'))
}

async function onTokenRefresh() {
  isLoading.value = true
  await regenBotToken()
    .then(async () => {
      botToken.value = (await getBotToken()).token
      toast.success(t('pages.dash.settings.general.token.toast'))
      isLoading.value = false
    })
    .catch((err) => {
      toast.error(err.message)
      isLoading.value = false
    })
}

onMounted(() => {
  isLoading.value = true
  setTimeout(async () => {
    botToken.value = (await getBotToken()).token
    isLoading.value = false
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
