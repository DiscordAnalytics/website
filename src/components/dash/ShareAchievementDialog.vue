<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Field as VeeField, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { shareAchievementFormSchema } from '@/utils/formSchemas.ts'
import { Field, FieldError, FieldGroup } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

defineProps<{
  isLoading: boolean
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'shared', lang: string): void
}>()

const form = useForm({
  validationSchema: toTypedSchema(shareAchievementFormSchema),
})

const onSubmit = form.handleSubmit(async (values) => {
  emit('shared', values.lang)
})
</script>

<template>
  <Dialog @update:open="(value) => $emit('update:open', value)">
    <DialogTrigger>
      <slot />
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{{ $t('pages.dash.achievements.dialogs.share.title') }}</DialogTitle>
        <DialogDescription>
          {{ $t('pages.dash.achievements.dialogs.share.description') }}
        </DialogDescription>
      </DialogHeader>

      <form id="shareAchievementForm" @submit="onSubmit">
        <FieldGroup>
          <VeeField v-slot="{ field, errors }" name="lang">
            <Field :data-invalid="!!errors.length">
              <Select
                :name="field.name"
                :model-value="field.value"
                @update:model-value="field.onChange"
                :disabled="$props.isLoading"
                class="w-full"
              >
                <SelectTrigger>
                  <SelectValue
                    :placeholder="$t('pages.dash.achievements.dialogs.share.locales.select')"
                  />
                </SelectTrigger>
                <SelectContent class="w-(--reka-select-trigger-width)">
                  <SelectItem value="en">
                    {{ $t('pages.dash.achievements.dialogs.share.locales.en') }}
                  </SelectItem>
                  <SelectItem value="fr">
                    {{ $t('pages.dash.achievements.dialogs.share.locales.fr') }}
                  </SelectItem>
                  <SelectItem value="other">
                    {{ $t('pages.dash.achievements.dialogs.share.locales.other') }}
                  </SelectItem>
                </SelectContent>
              </Select>
              <FieldError v-if="errors.length" :errors="errors.map((message) => ({ message }))" />
            </Field>
          </VeeField>

          <VeeField v-slot="{ field, errors }" name="sure">
            <Field :data-invalid="!!errors.length">
              <Label class="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3">
                <Checkbox
                  id="sureCheckbox"
                  :default-value="false"
                  :aria-invalid="!!errors.length"
                  :disabled="$props.isLoading"
                  @update:model-value="
                    (checked) => {
                      field.onChange(checked)
                    }
                  "
                />
                <div class="grid gap-1.5 font-normal">
                  <p class="text-sm leading-none font-medium">
                    {{ $t('pages.dash.achievements.dialogs.share.confirmation.title') }}
                  </p>
                  <p class="text-muted-foreground text-sm">
                    {{ $t('pages.dash.achievements.dialogs.share.confirmation.description') }}
                  </p>
                </div>
              </Label>
              <FieldError v-if="errors.length" :errors="errors.map((message) => ({ message }))" />
            </Field>
          </VeeField>

          <Field orientation="horizontal" class="flex items-center justify-end pt-2">
            <Button type="submit" form="shareAchievementForm" :disabled="$props.isLoading">
              <Spinner v-if="$props.isLoading" />
              {{ $t('pages.dash.achievements.dialogs.share.publish') }}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </DialogContent>
  </Dialog>
</template>
