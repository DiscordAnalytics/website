<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Field as VeeField, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import { Input } from '@/components/ui/input'
import type { Achievement } from '@/utils/types.ts'
import { watch } from 'vue'
import { editAchievementFormSchema } from '@/utils/formSchemas.ts'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

const props = defineProps<{
  achievement: Achievement | null
  isLoading: boolean
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'updated', values: { title: string; description: string }): void
}>()

const form = useForm({
  validationSchema: toTypedSchema(editAchievementFormSchema),
})

const onSubmit = form.handleSubmit(async (values) => {
  emit('updated', values)
})

watch(props, (value) => {
  if (value.open) {
    form.setValues({
      title: value.achievement?.title,
      description: value.achievement?.description,
      sure: !value.achievement?.shared,
    })
  }
})
</script>

<template>
  <Dialog @update:open="(value) => $emit('update:open', value)">
    <DialogTrigger>
      <slot />
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{{ $t('pages.dash.achievements.dialogs.edit.title') }}</DialogTitle>
      </DialogHeader>

      <form v-if="achievement" id="editAchievementForm" @submit="onSubmit">
        <FieldGroup>
          <VeeField v-slot="{ field, errors }" name="title">
            <Field :data-invalid="!!errors.length">
              <FieldLabel for="titleInput">
                {{ $t('pages.dash.achievements.dialogs.edit.fields.title') }}
              </FieldLabel>
              <Input
                id="titleInput"
                v-bind="field"
                placeholder="So famous"
                autocomplete="off"
                :aria-invalid="!!errors.length"
                :disabled="isLoading"
                :default-value="achievement.title"
              />
              <FieldError v-if="errors.length" :errors="errors.map((message) => ({ message }))" />
            </Field>
          </VeeField>

          <VeeField v-slot="{ field, errors }" name="description">
            <Field :data-invalid="!!errors.length">
              <FieldLabel for="descriptionInput">
                {{ $t('pages.dash.achievements.dialogs.edit.fields.description') }}
              </FieldLabel>
              <Input
                id="descriptionInput"
                v-bind="field"
                placeholder="Be on 50k servers"
                autocomplete="off"
                :aria-invalid="!!errors.length"
                :disabled="isLoading"
                :default-value="achievement.description"
              />
              <FieldError v-if="errors.length" :errors="errors.map((message) => ({ message }))" />
            </Field>
          </VeeField>

          <VeeField v-if="achievement.shared" v-slot="{ field, errors }" name="sure">
            <Field :data-invalid="!!errors.length">
              <Label class="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 mt-4">
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
                    {{ $t('pages.dash.achievements.dialogs.edit.confirmation.title') }}
                  </p>
                  <p class="text-muted-foreground text-sm">
                    {{ $t('pages.dash.achievements.dialogs.edit.confirmation.description') }}
                  </p>
                </div>
              </Label>
              <FieldError v-if="errors.length" :errors="errors.map((message) => ({ message }))" />
            </Field>
          </VeeField>

          <Field orientation="horizontal" class="flex items-center justify-end pt-2">
            <Button type="submit" form="editAchievementForm" :disabled="$props.isLoading">
              <Spinner v-if="$props.isLoading" />
              {{ $t('pages.dash.achievements.dialogs.edit.save') }}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </DialogContent>
  </Dialog>
</template>
