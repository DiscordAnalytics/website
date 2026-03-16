<script setup lang="ts">
import { Field as VeeField, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { createCustomEventSchema } from '@/utils/formSchemas.ts'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { watch } from 'vue'

const props = defineProps<{
  isLoading: boolean
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (
    e: 'created',
    values: {
      eventKey: string
      graphName: string
      defaultMode: 'previous_hour' | 'fixed'
      defaultValue?: number | null
    },
  ): void
}>()

const form = useForm({
  validationSchema: toTypedSchema(createCustomEventSchema),
  initialValues: {
    defaultMode: 'fixed',
    defaultValue: 0,
  },
})

const onSubmit = form.handleSubmit(async (values) => {
  emit('created', values)
})

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen)
      form.resetForm({
        values: {
          defaultMode: 'fixed',
          defaultValue: 0,
        },
      })
  },
)
</script>

<template>
  <Dialog :open="$props.open" @update:open="$emit('update:open', $event)">
    <DialogTrigger as-child>
      <slot />
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{{ $t('pages.dash.stats.charts.customEvents.create.title') }}</DialogTitle>
        <DialogDescription>
          {{ $t('pages.dash.stats.charts.customEvents.create.description') }}
        </DialogDescription>
      </DialogHeader>

      <form id="createEventForm" class="w-full" @submit="onSubmit">
        <FieldGroup>
          <VeeField v-slot="{ field, errors }" name="eventKey">
            <Field :data-invalid="!!errors.length">
              <FieldLabel for="eventKeyInput">
                {{ $t('pages.dash.stats.charts.customEvents.fields.eventKey') }}
              </FieldLabel>
              <Input
                id="eventKeyInput"
                v-bind="field"
                placeholder="my_custom_event"
                autocomplete="off"
                autofocus
                :aria-invalid="!!errors.length"
                :disabled="isLoading"
              />
              <FieldError v-if="errors.length" :errors="errors.map((message) => ({ message }))" />
              <FieldDescription v-else>
                {{ $t('pages.dash.stats.charts.customEvents.fields.eventKeyDescription') }}
              </FieldDescription>
            </Field>
          </VeeField>

          <VeeField v-slot="{ field, errors }" name="graphName">
            <Field :data-invalid="!!errors.length">
              <FieldLabel for="chartTitleInput">
                {{ $t('pages.dash.stats.charts.customEvents.fields.chartTitle') }}
              </FieldLabel>
              <Input
                id="chartTitleInput"
                v-bind="field"
                placeholder="My Custom Event Chart"
                autocomplete="off"
                :aria-invalid="!!errors.length"
                :disabled="isLoading"
              />
              <FieldError v-if="errors.length" :errors="errors.map((message) => ({ message }))" />
              <FieldDescription v-else>
                {{ $t('pages.dash.stats.charts.customEvents.fields.chartTitleDescription') }}
              </FieldDescription>
            </Field>
          </VeeField>

          <VeeField v-slot="{ field }" name="defaultMode">
            <Field>
              <FieldLabel>
                {{ $t('pages.dash.stats.charts.customEvents.fields.defaultMode') }}
              </FieldLabel>
              <RadioGroup v-bind="field" default-value="fixed" class="flex flex-col gap-2">
                <Label class="flex items-center gap-2">
                  <RadioGroupItem value="previous_hour" />
                  {{ $t('pages.dash.stats.charts.customEvents.fields.previousHour') }}
                </Label>
                <Label class="flex items-center gap-2">
                  <RadioGroupItem value="fixed" />
                  {{ $t('pages.dash.stats.charts.customEvents.fields.fixedValue') }}
                </Label>
              </RadioGroup>
              <FieldDescription>
                {{ $t('pages.dash.stats.charts.customEvents.fields.defaultModeDescription') }}
              </FieldDescription>
            </Field>
          </VeeField>

          <VeeField v-slot="{ field, errors }" name="defaultValue">
            <Field :data-invalid="!!errors.length" v-if="form.values.defaultMode === 'fixed'">
              <FieldLabel>
                {{ $t('pages.dash.stats.charts.customEvents.fields.defaultValue') }}
              </FieldLabel>
              <Input
                type="number"
                v-bind="field"
                placeholder="0"
                :aria-invalid="!!errors.length"
                :disabled="isLoading"
                :default-value="0"
              />
              <FieldError v-if="errors.length" :errors="errors.map((message) => ({ message }))" />
              <FieldDescription v-else>
                {{ $t('pages.dash.stats.charts.customEvents.fields.defaultValueDescription') }}
              </FieldDescription>
            </Field>
          </VeeField>

          <Field orientation="horizontal" class="flex justify-end">
            <Button type="submit" form="createEventForm" :disabled="isLoading">
              <Spinner v-if="isLoading" />
              {{ $t('pages.dash.stats.charts.customEvents.create.submitButton') }}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </DialogContent>
  </Dialog>
</template>
