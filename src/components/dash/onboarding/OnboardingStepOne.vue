<script setup lang="ts">
import { AlertTriangleIcon } from '@lucide/vue'
import { Field as VeeField } from 'vee-validate'

import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Checkbox,
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  Input,
  Label,
  Spinner,
} from '@/components/ui'
import { useCurrentUser } from '@/composables'

const DEVELOPER_PORTAL_URL = 'https://discord.com/developers/applications'

defineProps<{
  loading: boolean
  failed: boolean
}>()

defineEmits<{
  (e: 'submit', event: SubmitEvent): void
}>()

const { userInfos, ownedBots } = useCurrentUser()
</script>

<template>
  <div v-if="userInfos && userInfos.botsLimit > ownedBots.length">
    <h1 v-if="ownedBots.length > 0" class="text-3xl font-black text-center my-4">
      {{ $t('pages.dash.onboarding.stepOne.addNewBot') }}
    </h1>
    <h1 v-else class="text-3xl font-black text-center my-4">
      {{ $t('pages.dash.onboarding.stepOne.welcome') }}
    </h1>
    <p class="flex flex-col items-center">
      {{ $t('pages.dash.onboarding.stepOne.subtitle') }}
      <a :href="DEVELOPER_PORTAL_URL" target="_blank" rel="noopener noreferrer">
        <Button variant="link">{{ $t('pages.dash.onboarding.stepOne.whereToGetId') }}</Button>
      </a>
    </p>
    <form id="addBotForm" @submit="(e) => $emit('submit', e)" class="max-w-100 mx-auto mt-8">
      <FieldGroup>
        <VeeField v-slot="{ field, errors }" name="botId">
          <Field :data-invalid="!!errors.length">
            <FieldLabel for="botIdInput">
              {{ $t('pages.dash.onboarding.stepOne.botIdLabel') }}
            </FieldLabel>
            <Input
              id="botIdInput"
              v-bind="field"
              :placeholder="$t('pages.dash.onboarding.stepOne.botIdPlaceholder')"
              autocomplete="off"
              autofocus
              :aria-invalid="!!errors.length"
              :disabled="$props.loading"
            />
            <FieldDescription v-if="!$props.failed">
              {{ $t('pages.dash.onboarding.stepOne.botIdHint') }}
            </FieldDescription>
            <FieldError v-if="errors.length" :errors="errors.map((message) => ({ message }))" />
          </Field>
        </VeeField>

        <Alert v-if="$props.failed" variant="destructive">
          <AlertTriangleIcon class="h-4 w-4" />
          <AlertTitle>{{ $t('pages.dash.onboarding.stepOne.failureHelp.title') }}</AlertTitle>
          <AlertDescription class="flex flex-col items-start gap-2">
            <span>{{ $t('pages.dash.onboarding.stepOne.failureHelp.description') }}</span>
            <div class="flex flex-wrap items-center gap-2">
              <a :href="DEVELOPER_PORTAL_URL" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm">
                  {{ $t('pages.dash.onboarding.stepOne.failureHelp.openPortal') }}
                </Button>
              </a>
              <RouterLink to="/support" target="_blank">
                <Button variant="ghost" size="sm">
                  {{ $t('pages.dash.onboarding.stepOne.failureHelp.contactSupport') }}
                </Button>
              </RouterLink>
            </div>
          </AlertDescription>
        </Alert>

        <VeeField v-slot="{ field, errors }" name="acceptTos">
          <Field :data-invalid="!!errors.length">
            <Label class="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3">
              <Checkbox
                id="acceptTosCheckbox"
                :default-value="false"
                :aria-invalid="!!errors.length"
                :disabled="$props.loading"
                @update:model-value="
                  (checked) => {
                    field.onChange(checked)
                  }
                "
              />
              <div class="grid gap-1.5 font-normal">
                <p class="text-sm leading-none font-medium">
                  {{ $t('pages.dash.onboarding.stepOne.acceptTos') }}
                </p>
                <p class="text-muted-foreground text-sm">
                  {{ $t('pages.dash.onboarding.stepOne.acceptTosDescription') }}
                  <a href="/docs/legals/terms" target="_blank">
                    <Button variant="link" class="px-0">
                      {{ $t('pages.dash.onboarding.stepOne.termsOfService') }}
                    </Button>
                  </a>
                  {{ $t('pages.dash.onboarding.stepOne.and') }}
                  <a href="/docs/legals/privacy-policy" target="_blank">
                    <Button variant="link" class="px-0">
                      {{ $t('pages.dash.onboarding.stepOne.privacyPolicy') }}
                    </Button>
                  </a>
                </p>
              </div>
            </Label>
            <FieldError v-if="errors.length" :errors="errors.map((message) => ({ message }))" />
          </Field>
        </VeeField>

        <Field>
          <Button type="submit" form="addBotForm" :disabled="$props.loading" class="w-full">
            <Spinner v-if="$props.loading" />
            {{ $t('pages.dash.onboarding.stepOne.submit') }}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  </div>
  <Empty v-else-if="userInfos" class="h-full">
    <EmptyHeader>
      <EmptyMedia variant="icon">
        <AlertTriangleIcon />
      </EmptyMedia>
      <EmptyTitle>{{ $t('pages.dash.onboarding.botLimitReached.title') }}</EmptyTitle>
      <EmptyDescription>
        {{ $t('pages.dash.onboarding.botLimitReached.description') }}
      </EmptyDescription>
      <EmptyContent>
        <RouterLink to="/support">
          <Button>{{ $t('pages.dash.onboarding.botLimitReached.joinSupport') }}</Button>
        </RouterLink>
      </EmptyContent>
    </EmptyHeader>
  </Empty>
</template>
