<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { Field as VeeField } from 'vee-validate'
import { useCurrentUser } from '@/composables'
import { Label } from '@/components/ui/label'
import { AlertTriangleIcon } from 'lucide-vue-next'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

defineProps<{
  loading: boolean
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
      <a
        href="https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID"
        target="_blank"
      >
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
            <FieldError v-if="errors.length" :errors="errors.map((message) => ({ message }))" />
          </Field>
        </VeeField>

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
