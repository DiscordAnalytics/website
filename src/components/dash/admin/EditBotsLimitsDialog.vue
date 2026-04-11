<script setup lang="ts">
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Field as VeeField, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { adminUpdateBotLimitsFormSchema } from '@/utils/formSchemas.ts'
import { toast } from 'vue-sonner'
import { ref, watch } from 'vue'
import type { Bot } from '@/utils/types.ts'
import { useBots } from '@/composables'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps<{
  bots: Bot[]
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
}>()

const { updateLimits: updateBotLimits } = useBots()
const form = useForm({
  validationSchema: toTypedSchema(adminUpdateBotLimitsFormSchema),
})

const isLoading = ref<boolean>(false)

const onSubmit = form.handleSubmit(async (values) => {
  isLoading.value = true
  try {
    for (const bot of props.bots) {
      await updateBotLimits(
        bot.botId,
        values.goalsLimit,
        values.customEventsLimit,
        values.teammatesLimit,
      )
    }
    toast.success(t('pages.dash.admin.bots.editLimits.toast'))
  } catch (e: any) {
    toast.error(e.message)
  }
  isLoading.value = false
  emit('update:open', false)
})

watch(
  () => props.bots,
  (value) => {
    form.setValues({
      goalsLimit: value.length === 1 ? value[0]?.goalsLimit : 30,
      customEventsLimit: value.length === 1 ? value[0]?.customEventsLimit : 15,
      teammatesLimit: value.length === 1 ? value[0]?.customEventsLimit : 5,
    })
  },
)
</script>

<template>
  <Dialog :open="props.open" @update:open="$emit('update:open', $event)">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {{
            $t('pages.dash.admin.bots.editLimits.title', $props.bots.length, {
              named: { count: $props.bots.length, username: $props.bots[0]?.username },
            })
          }}
        </DialogTitle>
        <DialogDescription>
          {{
            $t('pages.dash.admin.bots.editLimits.description', $props.bots.length, {
              named: { username: $props.bots[0]?.username },
            })
          }}
        </DialogDescription>
      </DialogHeader>

      <form id="updateBotLimitsForm" @submit="onSubmit">
        <FieldGroup>
          <VeeField v-slot="{ field, errors }" name="goalsLimit">
            <Field :data-invalid="!!errors.length">
              <FieldLabel for="goalsLimitInput">
                {{ $t('pages.dash.admin.bots.fields.goalsLimit.label') }}
              </FieldLabel>
              <Input
                id="goalsLimitInput"
                v-bind="field"
                :default-value="$props.bots.length === 1 ? $props.bots[0]?.goalsLimit : 30"
                placeholder="30"
                type="number"
                autofocus
                :aria-invalid="!!errors.length"
                :disabled="isLoading"
              />
              <FieldError v-if="errors.length" :errors="errors.map((message) => ({ message }))" />
            </Field>
          </VeeField>

          <VeeField v-slot="{ field, errors }" name="customEventsLimit">
            <Field :data-invalid="!!errors.length">
              <FieldLabel for="customEventsLimitInput">
                {{ $t('pages.dash.admin.bots.fields.customEventsLimit.label') }}
              </FieldLabel>
              <Input
                id="customEventsLimitInput"
                v-bind="field"
                :default-value="$props.bots.length === 1 ? $props.bots[0]?.customEventsLimit : 15"
                placeholder="15"
                type="number"
                autofocus
                :aria-invalid="!!errors.length"
                :disabled="isLoading"
              />
              <FieldError v-if="errors.length" :errors="errors.map((message) => ({ message }))" />
            </Field>
          </VeeField>

          <VeeField v-slot="{ field, errors }" name="teammatesLimit">
            <Field :data-invalid="!!errors.length">
              <FieldLabel for="teammatesLimitInput">
                {{ $t('pages.dash.admin.bots.fields.teammatesLimit.label') }}
              </FieldLabel>
              <Input
                id="teammatesLimitInput"
                v-bind="field"
                :default-value="$props.bots.length === 1 ? $props.bots[0]?.teammatesLimit : 5"
                placeholder="5"
                type="number"
                autofocus
                :aria-invalid="!!errors.length"
                :disabled="isLoading"
              />
              <FieldError v-if="errors.length" :errors="errors.map((message) => ({ message }))" />
            </Field>
          </VeeField>

          <VeeField v-slot="{ field, errors }" name="sure">
            <Field :data-invalid="!!errors.length">
              <Label class="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3">
                <Checkbox
                  id="acceptTosCheckbox"
                  :default-value="false"
                  :aria-invalid="!!errors.length"
                  :disabled="isLoading"
                  @update:model-value="
                    (checked) => {
                      field.onChange(checked)
                    }
                  "
                />
                <div class="grid gap-1.5 font-normal">
                  <p class="text-sm leading-none font-medium">
                    {{ $t('pages.dash.admin.bots.fields.sure.label') }}
                  </p>
                  <p class="text-muted-foreground text-sm">
                    {{ $t('pages.dash.admin.bots.fields.sure.description') }}
                  </p>
                </div>
              </Label>
              <FieldError v-if="errors.length" :errors="errors.map((message) => ({ message }))" />
            </Field>
          </VeeField>

          <Field>
            <Button type="submit" form="updateBotLimitsForm" :disabled="isLoading" class="w-full">
              <Spinner v-if="isLoading" />
              {{ $t('pages.dash.admin.bots.editLimits.submit') }}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </DialogContent>
  </Dialog>
</template>
