<script setup lang="ts">
import { h, ref } from 'vue'
import CustomIcon from '@/components/CustomIcon.vue'
import SettingCard from '@/components/dash/SettingCard.vue'
import { CircleCheckIcon, CopyIcon, EyeIcon, EyeOffIcon, RefreshCwIcon } from 'lucide-vue-next'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import { Spinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'
import type { VotesProvider } from '@/utils/types.ts'
import { useClipboard } from '@vueuse/core'
import { toast } from 'vue-sonner'
import { useBotVotesProvider } from '@/composables'
import { useRouteParams } from '@vueuse/router'
import { useI18n } from 'vue-i18n'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Field as VeeField, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { Input } from '@/components/ui/input'
import { topggTokenUpdateFormSchema } from '@/utils/formSchemas.ts'

const { t } = useI18n()

const props = defineProps<{
  id: VotesProvider
  provider: string
}>()

const { copy, isSupported: isCopySupported } = useClipboard()
const botId = useRouteParams<string>('id')
const { config: providerConfig, update: updateProvider } = useBotVotesProvider(botId, props.id)

const isLoading = ref<boolean>(false)
const showToken = ref<boolean>(false)
const manualConfigOpen = ref<boolean>(false)

const manualConfigForm = useForm({
  validationSchema: toTypedSchema(topggTokenUpdateFormSchema),
})

function copyToken() {
  if (providerConfig.value?.webhookSecret) {
    copy(providerConfig.value?.webhookSecret)
    toast.success(t('pages.dash.settings.votes.provider.toast.copied'))
  }
}

function generateWebhookSecret() {
  const buffer = new Uint8Array(32)
  window.crypto.getRandomValues(buffer)
  return Array.from(buffer, (b) => b.toString(16).padStart(2, '0')).join('')
}

async function updateToken(token: string = generateWebhookSecret()) {
  isLoading.value = true
  await updateProvider(token)
    .then(() => {
      toast.success(t('pages.dash.settings.votes.provider.toast.regenerated'))
      manualConfigOpen.value = false
    })
    .catch((err) => toast.error(err.message))
  isLoading.value = false
}

const onManualConfigSubmit = manualConfigForm.handleSubmit(async (values) => {
  await updateToken(values.webhookSecret)
})
</script>

<template>
  <SettingCard
    :title="$props.provider"
    :icon="() => h(CustomIcon, { icon: $props.id, class: 'h-8 w-8' })"
    :description="
      $t('pages.dash.settings.votes.provider.description', { provider: $props.provider })
    "
  >
    <template v-if="$props.id === 'topgg'" #actions>
      <a
        v-if="!providerConfig?.connectionId"
        :href="`https://top.gg/bot/${botId}/dashboard/integrations`"
        target="_blank"
      >
        <Button class="w-full md:w-fit">
          {{ $t('pages.dash.settings.votes.provider.topgg.installButton') }}
        </Button>
      </a>
      <div v-else class="flex items-center gap-2 text-green-500">
        <CircleCheckIcon class="h-6 w-6" />
        <p>{{ $t('pages.dash.settings.votes.provider.topgg.active') }}</p>
      </div>

      <Dialog v-if="!providerConfig?.connectionId" v-model:open="manualConfigOpen">
        <DialogTrigger as-child>
          <Button variant="ghost" class="w-full md:w-fit">
            {{ $t('pages.dash.settings.votes.provider.topgg.manualConfig') }}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {{ $t('pages.dash.settings.votes.provider.topgg.manualConfigDialog.title') }}
            </DialogTitle>
            <DialogDescription>
              {{ $t('pages.dash.settings.votes.provider.topgg.manualConfigDialog.description') }}
            </DialogDescription>
          </DialogHeader>

          <form id="manualConfigForm" @submit="onManualConfigSubmit">
            <FieldGroup>
              <VeeField v-slot="{ field, errors }" name="webhookSecret">
                <Field :data-invalid="!!errors.length">
                  <FieldLabel for="webhookSecretInput">
                    {{
                      $t('pages.dash.settings.votes.provider.topgg.manualConfigDialog.tokenLabel')
                    }}
                  </FieldLabel>
                  <Input
                    id="webhookSecretInput"
                    v-bind="field"
                    :placeholder="$t('pages.dash.settings.votes.provider.tokenPlaceholder')"
                    autocomplete="off"
                    autofocus
                    :aria-invalid="!!errors.length"
                    :disabled="isLoading"
                  />
                  <FieldError
                    v-if="errors.length"
                    :errors="errors.map((message) => ({ message }))"
                  />
                  <FieldDescription v-else>
                    {{
                      $t(
                        'pages.dash.settings.votes.provider.topgg.manualConfigDialog.tokenDescription',
                      )
                    }}
                  </FieldDescription>
                </Field>
              </VeeField>

              <Field orientation="horizontal" class="flex justify-end">
                <Button type="submit" form="manualConfigForm" :disabled="isLoading">
                  <Spinner v-if="isLoading" />
                  {{
                    $t('pages.dash.settings.votes.provider.topgg.manualConfigDialog.submitButton')
                  }}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </DialogContent>
      </Dialog>
    </template>
    <template v-else #content>
      <div class="flex items-center gap-2 w-full flex-col md:flex-row">
        <InputGroup class="my-2 w-full">
          <InputGroupInput
            :default-value="providerConfig?.webhookSecret"
            :value="providerConfig?.webhookSecret"
            :placeholder="$t('pages.dash.settings.votes.provider.tokenPlaceholder')"
            :disabled="isLoading"
            readonly
            :type="showToken ? 'text' : 'password'"
          />
          <InputGroupAddon align="inline-end">
            <Spinner v-if="isLoading" />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              :aria-label="$t('pages.dash.settings.general.token.showToken')"
              :title="$t('pages.dash.settings.general.token.showToken')"
              size="icon-xs"
              @click="showToken = !showToken"
            >
              <EyeOffIcon v-if="showToken" />
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
          <Button size="icon" :disabled="isLoading" @click="updateToken()">
            <Spinner v-if="isLoading" />
            <RefreshCwIcon v-else />
          </Button>
        </div>
      </div>
    </template>
  </SettingCard>
</template>
