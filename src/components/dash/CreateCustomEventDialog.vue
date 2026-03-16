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
        <DialogTitle>Create custom event</DialogTitle>
        <DialogDescription>
          Custom events allow you to create charts for specific features of your bot.
        </DialogDescription>
      </DialogHeader>

      <form id="createEventForm" class="w-full" @submit="onSubmit">
        <FieldGroup>
          <VeeField v-slot="{ field, errors }" name="eventKey">
            <Field :data-invalid="!!errors.length">
              <FieldLabel for="eventKeyInput">Event Key</FieldLabel>
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
                The unique key you'll use in your code to seed the event.
              </FieldDescription>
            </Field>
          </VeeField>

          <VeeField v-slot="{ field, errors }" name="graphName">
            <Field :data-invalid="!!errors.length">
              <FieldLabel for="chartTitleInput">Chart title</FieldLabel>
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
                The chart name you'll see on the dashboard.
              </FieldDescription>
            </Field>
          </VeeField>

          <VeeField v-slot="{ field }" name="defaultMode">
            <Field>
              <FieldLabel>Default value behavior</FieldLabel>
              <RadioGroup v-bind="field" default-value="fixed" class="flex flex-col gap-2">
                <Label class="flex items-center gap-2">
                  <RadioGroupItem value="previous_hour" />
                  Use previous hour value
                </Label>
                <Label class="flex items-center gap-2">
                  <RadioGroupItem value="fixed" />
                  Use a fixed value
                </Label>
              </RadioGroup>
              <FieldDescription> Used when no data exists for a given hour. </FieldDescription>
            </Field>
          </VeeField>

          <VeeField v-slot="{ field, errors }" name="defaultValue">
            <Field :data-invalid="!!errors.length" v-if="form.values.defaultMode === 'fixed'">
              <FieldLabel>Default value</FieldLabel>
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
                The value used when no previous hour data exists.
              </FieldDescription>
            </Field>
          </VeeField>

          <Field orientation="horizontal" class="flex justify-end">
            <Button type="submit" form="createEventForm" :disabled="isLoading">
              <Spinner v-if="isLoading" />
              Create event
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </DialogContent>
  </Dialog>
</template>
